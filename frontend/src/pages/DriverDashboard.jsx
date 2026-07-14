import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TripPlanner from "../components/TripPlanner";
import RouteOverview from "../components/RouteOverview";
import Stats from "../components/Stats";
import BottomSection from "../components/BottomSection";
import DriverBookings from "../components/DriverBookings";
import VehiclesList from "../components/VehiclesList";
import ProfileView from "../components/ProfileView";
import SettingsView from "../components/SettingsView";

function DriverDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // State owned by DriverDashboard
    const [activeTab, setActiveTab] = useState("dashboard");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [routeOptions, setRouteOptions] = useState([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
    const [batteryPercentage, setBatteryPercentage] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [routeStats, setRouteStats] = useState({
        distance: 0,
        duration: 0,
        stops: 0
    });

    const [chargers, setChargers] = useState([]);
    const [recommendedCharger, setRecommendedCharger] = useState(null);
    const [isSearchingChargers, setIsSearchingChargers] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    // Booking modal state
    const [selectedChargerForBooking, setSelectedChargerForBooking] = useState(null);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("10:00 AM - 11:00 AM");

    const loadVehicles = () => {
        if (!user) return;
        const savedVehicles = JSON.parse(localStorage.getItem(`vehicles_${user.id}`) || "[]");
        const isLegacySampleVehicles = savedVehicles.length === 2 &&
            savedVehicles.some((item) => item.name === "Tata Punch EV" && Number(item.range) === 300) &&
            savedVehicles.some((item) => item.name === "Nexon EV Max" && Number(item.range) === 450);
        const realVehicles = isLegacySampleVehicles ? [] : savedVehicles;

        if (isLegacySampleVehicles) {
            localStorage.setItem(`vehicles_${user.id}`, JSON.stringify([]));
        }

        setVehicles(realVehicles);
        setVehicle((currentVehicle) => {
            if (currentVehicle && realVehicles.some((item) => item.id === currentVehicle)) {
                return currentVehicle;
            }
            return realVehicles[0]?.id || "";
        });
    };

    // Fetch bookings & recent searches on load
    const fetchBookings = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/api/bookings?driverId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
            loadVehicles();
            const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
            setRecentSearches(searches);
        }
        // Initialize booking date to today
        const today = new Date().toISOString().split("T")[0];
        setBookingDate(today);
    }, []);

    useEffect(() => {
        if (activeTab === "dashboard") {
            loadVehicles();
        }
    }, [activeTab]);

    // Get current geolocation
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Location is not supported by this browser. Please select your origin from the location suggestions.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    const data = await response.json();
                    const city = data.address?.city || data.address?.town || data.address?.village || "";
                    const state = data.address?.state || "";
                    const name = city && state ? `${city}, ${state}` : city || state || "Current Location";

                    setFrom(name);
                    setSelectedOrigin({ lat, lon });
                } catch (err) {
                    console.error("Nominatim reverse geocoding failed", err);
                    setFrom(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                    setSelectedOrigin({ lat, lon });
                }
            },
            (error) => {
                const messages = {
                    [error.PERMISSION_DENIED]: "Location access is blocked. Allow location access for this site in your browser settings, then try again.",
                    [error.POSITION_UNAVAILABLE]: "Your device could not determine a location. Please select your origin from the location suggestions.",
                    [error.TIMEOUT]: "Location request timed out. Please try again or select your origin from the location suggestions."
                };
                alert(messages[error.code] || "Unable to fetch your location. Please select your origin from the location suggestions.");
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    };

    // Route search logic
    const searchRoute = async (originOverride = null, destinationOverride = null) => {
        let origin = originOverride || selectedOrigin;
        let destination = destinationOverride || selectedDestination;

        // A typed city should be as usable as a clicked suggestion.
        if ((!origin && from.trim()) || (!destination && to.trim())) {
            try {
                const [originResult, destinationResult] = await Promise.all([
                    origin ? Promise.resolve(null) : axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(from)}&limit=1`),
                    destination ? Promise.resolve(null) : axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(to)}&limit=1`)
                ]);
                if (!origin && originResult?.data?.[0]) {
                    origin = { lat: Number(originResult.data[0].lat), lon: Number(originResult.data[0].lon) };
                    setSelectedOrigin(origin);
                }
                if (!destination && destinationResult?.data?.[0]) {
                    destination = { lat: Number(destinationResult.data[0].lat), lon: Number(destinationResult.data[0].lon) };
                    setSelectedDestination(destination);
                }
            } catch (error) {
                console.error("Could not resolve typed trip locations:", error);
            }
        }

        if (!origin || !destination) {
            alert("Please select both locations");
            return;
        }

        const selectedVehicle = vehicles.find((item) => item.id === vehicle);
        if (!selectedVehicle) {
            alert("Please add and select a vehicle before searching chargers.");
            return;
        }

        const batteryValue = Number(batteryPercentage);
        if (!batteryValue || batteryValue < 1 || batteryValue > 100) {
            alert("Please enter your current battery percentage.");
            return;
        }

        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?alternatives=true&overview=full&geometries=geojson&steps=true`;
            const res = await axios.get(url);

            if (res.data && res.data.routes && res.data.routes.length > 0) {
                const route = res.data.routes[0];
                const distanceKm = Number((route.distance / 1000).toFixed(1));
                const durationMins = Number((route.duration / 60).toFixed(0));

                // Convert geometries [lon, lat] to [lat, lon]
                const rawCoordinates = route.geometry.coordinates;
                const coordinates = rawCoordinates.map(coord => [coord[1], coord[0]]);

                // Calculate stops
                const range = Number(selectedVehicle.range);

                const availableRange = range * (batteryValue / 100);



                let stops = 0;


                if (distanceKm >availableRange) {


                    stops = Math.ceil((distanceKm - availableRange) / range

                     );


                }
                const stats = {
                    distance: distanceKm,
                    duration: durationMins,
                    stops: stops
                };

                setRouteStats(stats);
                setChargers([]);
                setRecommendedCharger(null);
                setIsSearchingChargers(true);
                setRouteData({
                    origin: origin,
                    destination: destination,
                    geometry: coordinates,
                    steps: route.legs?.flatMap((leg) => leg.steps || []) || []
                });
                setSelectedRouteIndex(0);
                setRouteOptions(res.data.routes.slice(0, 3).map((candidate, index) => {
                    const candidateDistance = Number((candidate.distance / 1000).toFixed(1));
                    const candidateSteps = candidate.legs?.flatMap((leg) => leg.steps || []) || [];
                    return {
                        id: `${candidate.distance}-${candidate.duration}-${index}`,
                        label: index === 0 ? "Recommended" : `Alternative ${index}`,
                        stats: {
                            distance: candidateDistance,
                            duration: Number((candidate.duration / 60).toFixed(0)),
                            stops: candidateDistance > availableRange ? Math.ceil((candidateDistance - availableRange) / range) : 0
                        },
                        routeData: {
                            origin,
                            destination,
                            geometry: candidate.geometry.coordinates.map((coord) => [coord[1], coord[0]]),
                            steps: candidateSteps,
                            roads: [...new Set(candidateSteps.map((step) => step.name).filter(Boolean))].slice(0, 3)
                        }
                    };
                }));

                // Update recent searches
                const searchString = `${from} → ${to}`;
                let searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
                searches = searches.filter(s => s !== searchString);
                searches.unshift(searchString);
                searches = searches.slice(0, 5);
                localStorage.setItem("recentSearches", JSON.stringify(searches));
                setRecentSearches(searches);

                // Fetch chargers along route
                try {
                    const searchRes = await axios.post("http://localhost:5000/api/chargers/route-search", {
                        geometry: coordinates,
                        maxDistanceKm: 5
                    });
                    setChargers(searchRes.data);
                    setRecommendedCharger(
                        stats.stops > 0
                            ? searchRes.data.find((charger) => charger.status === "Available") || null
                            : null
                    );
                } catch (err) {
                    console.error("Error searching chargers:", err);
                    setChargers([]);
                    setRecommendedCharger(null);
                } finally {
                    setIsSearchingChargers(false);
                }
            } else {
                alert("No route found between these locations.");
            }
        } catch (error) {
            console.error("OSRM routing failed:", error);
            alert("Error finding route. Please check input names and try again.");
        }
    };

    const selectRoute = async (index) => {
        const option = routeOptions[index];
        if (!option) return;
        setSelectedRouteIndex(index);
        setRouteData(option.routeData);
        setRouteStats(option.stats);
        setChargers([]);
        setRecommendedCharger(null);
        setIsSearchingChargers(true);
        try {
            const searchRes = await axios.post("http://localhost:5000/api/chargers/route-search", {
                geometry: option.routeData.geometry,
                maxDistanceKm: 5
            });
            setChargers(searchRes.data);
            setRecommendedCharger(
                option.stats.stops > 0
                    ? searchRes.data.find((charger) => charger.status === "Available") || null
                    : null
            );
        } catch (error) {
            console.error("Error searching chargers for alternative route:", error);
            setRecommendedCharger(null);
        } finally {
            setIsSearchingChargers(false);
        }
    };

    const startRide = () => {
        if (!routeData) return;
        const trip = { routeData, stats: routeStats, from, to, chargers, recommendedCharger };
        sessionStorage.setItem("activeTrip", JSON.stringify(trip));
        navigate("/driver/navigate", { state: { trip } });
    };

    // Selecting a recent search
    const handleSelectRecentSearch = async (searchStr) => {
        const parts = searchStr.split(" → ");
        if (parts.length === 2) {
            const originName = parts[0];
            const destName = parts[1];
            setFrom(originName);
            setTo(destName);

            try {
                const originRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(originName)}&limit=1`);
                const destRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destName)}&limit=1`);

                if (originRes.data.length > 0 && destRes.data.length > 0) {
                    const originCoord = {
                        lat: parseFloat(originRes.data[0].lat),
                        lon: parseFloat(originRes.data[0].lon)
                    };
                    const destCoord = {
                        lat: parseFloat(destRes.data[0].lat),
                        lon: parseFloat(destRes.data[0].lon)
                    };
                    setSelectedOrigin(originCoord);
                    setSelectedDestination(destCoord);
                    
                    // Trigger search automatically
                    searchRoute(originCoord, destCoord);
                } else {
                    alert("Could not resolve location coordinates for recent search.");
                }
            } catch (err) {
                console.error("Error resolving recent search coords:", err);
            }
        }
    };

    // Confirm slot booking
    const confirmBooking = async () => {
        if (!bookingDate) {
            alert("Please select a date.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/bookings", {
                chargerId: selectedChargerForBooking._id,
                date: bookingDate,
                time: bookingTime,
                driverId: user?.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(
                res.data.status === "Confirmed"
                    ? "Booking confirmed successfully."
                    : "Booking request sent to the host. You will be charged after the host confirms it."
            );
            setSelectedChargerForBooking(null);
            fetchBookings();
        } catch (error) {
            console.error("Error booking slot:", error);
            alert(error.response?.data?.message || "Failed to book slot. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 p-8">
                {activeTab === "dashboard" && (
                    <>
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-5xl font-bold text-gray-800">
                                    Welcome back, {user?.name} 👋
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    Plan your trip and find EV chargers on the way
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl hover:bg-gray-100 transition duration-150">
                                    🔔
                                </button>

                                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-sm">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>

                        {/* Planner + Map */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <TripPlanner
                                from={from}
                                setFrom={setFrom}
                                to={to}
                                setTo={setTo}
                                suggestions={suggestions}
                                setSuggestions={setSuggestions}
                                selectedOrigin={selectedOrigin}
                                setSelectedOrigin={setSelectedOrigin}
                                selectedDestination={selectedDestination}
                                setSelectedDestination={setSelectedDestination}
                                batteryPercentage={batteryPercentage}
                                setBatteryPercentage={setBatteryPercentage}
                                vehicle={vehicle}
                                setVehicle={setVehicle}
                                vehicles={vehicles}
                                searchRoute={() => searchRoute()}
                                getCurrentLocation={getCurrentLocation}
                            />

                            <RouteOverview
                                routeData={routeData}
                                stats={routeStats}
                                chargers={chargers}
                                recommendedCharger={recommendedCharger}
                                routeOptions={routeOptions}
                                selectedRouteIndex={selectedRouteIndex}
                                onSelectRoute={selectRoute}
                                getCurrentLocation={getCurrentLocation}
                                onBookCharger={(charger) => {
                                    setSelectedChargerForBooking(charger);
                                }}
                                onStartRide={startRide}
                                isSearchingChargers={isSearchingChargers}
                            />
                        </div>

                        {/* Stats Section */}
                        <div className="mt-6">
                            <Stats bookings={bookings} />
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-6">
                            <BottomSection
                                recentSearches={recentSearches}
                                bookings={bookings}
                                chargers={chargers}
                                onSelectRecentSearch={handleSelectRecentSearch}
                            />
                        </div>
                    </>
                )}

                {activeTab === "bookings" && (
	                    <DriverBookings
	                        bookings={bookings}
	                        onCancelBooking={async (bookingId) => {
                            if (confirm("Are you sure you want to cancel this booking?")) {
                                try {
                                    const token = localStorage.getItem("token");
                                    await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
                                        status: "Cancelled"
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    alert("Booking cancelled successfully! Refunding amount to your wallet.");
                                    fetchBookings();
                                } catch (error) {
                                    console.error("Error cancelling booking:", error);
                                    alert(error.response?.data?.message || "Failed to cancel booking.");
	                                }
	                            }
	                        }}
                            onReviewBooking={async (bookingId, rating, feedback) => {
                                try {
                                    const token = localStorage.getItem("token");
                                    await axios.post(`http://localhost:5000/api/bookings/${bookingId}/review`, {
                                        rating,
                                        feedback
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    alert("Review submitted successfully.");
                                    fetchBookings();
                                } catch (error) {
                                    console.error("Error submitting review:", error);
                                    alert(error.response?.data?.message || "Failed to submit review.");
                                }
                            }}
	                    />
                )}

                {activeTab === "vehicles" && <VehiclesList />}

                {activeTab === "profile" && <ProfileView user={user} />}

                {activeTab === "settings" && <SettingsView />}
            </div>

            {/* Booking Modal */}
            {selectedChargerForBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100 mx-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            ⚡ Book Slot
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Book a charging slot at <span className="font-semibold text-green-600">{selectedChargerForBooking.name}</span>
                        </p>
                        
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Power Output</label>
                                <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 font-semibold flex items-center justify-between">
                                    <span>{selectedChargerForBooking.power} kW</span>
                                    <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">{selectedChargerForBooking.type}</span>
                                </div>
                            </div>
	                            <div>
	                                <label className="block text-sm font-medium text-gray-500 mb-1">Pricing</label>
	                                <div className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700 font-semibold">
	                                    ₹{selectedChargerForBooking.price}/kWh
	                                </div>
	                            </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                                        <p className="text-xs font-medium text-gray-400">Rating</p>
                                        <p className="font-bold text-gray-800">{selectedChargerForBooking.rating || 0}/5</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                                        <p className="text-xs font-medium text-gray-400">Route Score</p>
                                        <p className="font-bold text-gray-800">{selectedChargerForBooking.rankingScore || "New"}</p>
                                    </div>
                                </div>
	                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Select Date</label>
                                <input
                                    type="date"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Select Time Slot</label>
                                <select
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option>08:00 AM - 09:00 AM</option>
                                    <option>09:00 AM - 10:00 AM</option>
                                    <option>10:00 AM - 11:00 AM</option>
                                    <option>11:00 AM - 12:00 PM</option>
                                    <option>12:00 PM - 01:00 PM</option>
                                    <option>01:05 PM - 02:00 PM</option>
                                    <option>02:00 PM - 03:00 PM</option>
                                    <option>03:00 PM - 04:00 PM</option>
                                    <option>04:00 PM - 05:00 PM</option>
                                    <option>05:00 PM - 06:00 PM</option>
                                    <option>06:00 PM - 07:00 PM</option>
                                    <option>07:00 PM - 08:00 PM</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setSelectedChargerForBooking(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-md shadow-green-600/20"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriverDashboard;
