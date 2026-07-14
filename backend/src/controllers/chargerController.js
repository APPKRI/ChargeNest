const Charger = require("../models/Charger");
const Booking = require("../models/Booking");


function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;


    const a =

        Math.sin(dLat / 2) ** 2 +

        Math.cos(lat1 * Math.PI / 180) *

        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) ** 2;



    const c = 2 * Math.atan2(

        Math.sqrt(a),

        Math.sqrt(1 - a)

    );


    return R * c;

}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function statusAvailabilityScore(status) {
    if (status === "Available") return 25;
    if (status === "Booked" || status === "Occupied") return 10;
    return 0;
}

function getEffectiveStatus(charger, activeBookingCount) {
    if (charger.status !== "Available") return charger.status;
    return activeBookingCount > 0 ? "Booked" : "Available";
}



// GET /api/chargers

exports.getChargers = async (req, res) => {

    try {

        const chargers = await Charger.find();

        res.json(chargers);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// POST /api/chargers

exports.createCharger = async (req, res) => {

    try {


        const {

            name,

            latitude,

            longitude,

            power,

            price,

            type,

            status,

            hostId,

            availableSlots

        } = req.body;



        if (

            !name ||

            latitude === undefined ||

            longitude === undefined ||

            !power ||

            !price

        ) {


            return res.status(400).json({

                message: "Please provide all required fields"

            });

        }



        const charger = await Charger.create({


            name,

            latitude: Number(latitude),

            longitude: Number(longitude),

            power: Number(power),

            price: Number(price),

            type: type || "CCS2",

            status: status || "Available",

            hostId,

            availableSlots


        });



        res.status(201).json(charger);


    }

    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};




// POST /api/chargers/route-search

exports.routeSearch = async (req, res) => {


    try {


        const {

            geometry,
            maxDistanceKm

        } = req.body;



        if (


            !geometry ||

            !Array.isArray(geometry) ||

            geometry.length === 0

        ) {


            return res.status(400).json({

                message: "Geometry is required"

            });


        }




        const chargers = await Charger.find();
        // Keep recommendations close enough that drivers do not need a major detour.
        const corridorKm = clamp(Number(maxDistanceKm) || 5, 1, 5);
        const activeBookings = await Booking.aggregate([
            {
                $match: {
                    status: { $in: ["Pending", "Confirmed"] }
                }
            },
            {
                $group: {
                    _id: "$chargerId",
                    count: { $sum: 1 }
                }
            }
        ]);
        const bookingCounts = new Map(
            activeBookings.map((item) => [item._id.toString(), item.count])
        );



        const nearbyChargers = [];
        const cheapestPrice = Math.min(...chargers.map((charger) => charger.price || 0).filter(Boolean));

        for (const charger of chargers) {
            // Find the closest route point instead of accepting the first
            // point inside the corridor. The first match can be far away on
            // long routes, producing an incorrect dashed connector.
            let nearestDistance = Infinity;
            let nearestPointIndex = 0;

            geometry.forEach((point, index) => {
                if (!Array.isArray(point) || point.length < 2) return;

                const distance = getDistance(
                    charger.latitude,
                    charger.longitude,
                    point[0],
                    point[1]
                );

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestPointIndex = index;
                }
            });

            if (nearestDistance > corridorKm) continue;

            const plainCharger = charger.toObject();
            const effectiveStatus = getEffectiveStatus(
                plainCharger,
                bookingCounts.get(charger._id.toString()) || 0
            );
            const distanceScore = clamp(35 - (nearestDistance / corridorKm) * 35, 0, 35);
            const ratingScore = ((plainCharger.rating || 0) / 5) * 25;
            const priceScore = cheapestPrice
                ? clamp((cheapestPrice / plainCharger.price) * 15, 0, 15)
                : 10;
            const availabilityScore = statusAvailabilityScore(effectiveStatus);
            const finalScore = distanceScore + ratingScore + priceScore + availabilityScore;

            nearbyChargers.push({
                ...plainCharger,
                status: effectiveStatus,
                distanceFromRoute: Number(nearestDistance.toFixed(2)),
                nearestRoutePoint: geometry[nearestPointIndex],
                routeProgress: Number(((nearestPointIndex / Math.max(geometry.length - 1, 1)) * 100).toFixed(0)),
                rankingScore: Number(finalScore.toFixed(1)),
                scoreBreakdown: {
                    distanceScore: Number(distanceScore.toFixed(1)),
                    ratingScore: Number(ratingScore.toFixed(1)),
                    priceScore: Number(priceScore.toFixed(1)),
                    availabilityScore: Number(availabilityScore.toFixed(1))
                }
            });
        }




        nearbyChargers.sort((a, b) => b.rankingScore - a.rankingScore);

        res.json(nearbyChargers);


    }


    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};

exports.updateCharger = async (req, res) => {
    try {
        const { id } = req.params;
        const charger = await Charger.findById(id);
        if (!charger) {
            return res.status(404).json({ message: "Charger not found" });
        }
        
        if (charger.hostId && charger.hostId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to modify this charger" });
        }

        const updatedCharger = await Charger.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCharger);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCharger = async (req, res) => {
    try {
        const { id } = req.params;
        const charger = await Charger.findById(id);
        if (!charger) {
            return res.status(404).json({ message: "Charger not found" });
        }
        
        if (charger.hostId && charger.hostId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this charger" });
        }

        await Charger.findByIdAndDelete(id);
        res.json({ message: "Charger deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
