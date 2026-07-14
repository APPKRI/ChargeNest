import { MdMyLocation } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

function PlaceSuggestions({ suggestions, onSelect }) {
    return (
        <div className="absolute z-[9999] w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-52 overflow-y-auto">
            {suggestions.map((place) => (
                <button
                    key={place.place_id}
                    type="button"
                    className="w-full p-3 hover:bg-green-50 cursor-pointer text-sm text-gray-700 text-left transition duration-150"
                    onClick={() => onSelect(place)}
                >
                    {place.display_name}
                </button>
            ))}
        </div>
    );
}

function TripPlanner({
    from,
    setFrom,
    to,
    setTo,
    suggestions,
    setSuggestions,
    setSelectedOrigin,
    setSelectedDestination,
    batteryPercentage,
    setBatteryPercentage,
    vehicle,
    setVehicle,
    vehicles = [],
    searchRoute,
    getCurrentLocation
}) {
    const [activeField, setActiveField] = useState(null);
    const searchTimer = useRef(null);
    const searchController = useRef(null);

    useEffect(() => () => {
        clearTimeout(searchTimer.current);
        searchController.current?.abort();
    }, []);

    const searchPlaces = (value, field) => {
        if (field === "origin") {
            setFrom(value);
            setSelectedOrigin(null);
        } else {
            setTo(value);
            setSelectedDestination(null);
        }
        setActiveField(field);

        if (value.length < 3) {
            clearTimeout(searchTimer.current);
            searchController.current?.abort();
            setSuggestions([]);
            return;
        }

        clearTimeout(searchTimer.current);
        searchController.current?.abort();
        searchTimer.current = setTimeout(async () => {
            const controller = new AbortController();
            searchController.current = controller;
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`,
                    { signal: controller.signal }
                );
                setSuggestions(await response.json());
            } catch (err) {
                if (err.name !== "AbortError") console.error("Error searching places:", err);
            }
        }, 350);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
            <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Plan Your Trip
                </h2>

                {/* FROM */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-500">
                        From
                    </label>

                    <div className="relative mt-1">
                        <input
                            type="text"
                            value={from}
                            onChange={(e) => searchPlaces(e.target.value, "origin")}
                            placeholder="Enter origin"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                        />

                        <button
                            onClick={getCurrentLocation}
                            className="absolute right-4 top-3.5 text-green-600 hover:text-green-700 transition"
                            title="Use current location"
                        >
                            <MdMyLocation size={20} />
                        </button>

                        {activeField === "origin" && suggestions.length > 0 && (
                            <PlaceSuggestions
                                suggestions={suggestions}
                                onSelect={(place) => {
                                    setFrom(place.display_name);
                                    setSelectedOrigin({ lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
                                    setSuggestions([]);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* TO */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-500">
                        To
                    </label>

                    <div className="relative mt-1">
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => searchPlaces(e.target.value, "destination")}
                            placeholder="Enter destination"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                        />

                        {activeField === "destination" && suggestions.length > 0 && (
                            <PlaceSuggestions
                                suggestions={suggestions}
                                onSelect={(place) => {
                                    setTo(place.display_name);
                                    setSelectedDestination({ lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
                                    setSuggestions([]);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* VEHICLE */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-500">
                        Vehicle
                    </label>

                    <select
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 text-gray-700 font-medium"
                    >
                        <option value="">Select your EV</option>
                        {vehicles.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.range} km range)
                            </option>
                        ))}
                    </select>
                    {vehicles.length === 0 && (
                        <p className="text-xs text-amber-600 mt-2">
                            Add a vehicle from the Vehicles tab to calculate charging stops.
                        </p>
                    )}
                </div>

                {/* BATTERY */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500">
                        Battery Percentage
                    </label>

                    <input
                        type="number"
                        value={batteryPercentage}
                        onChange={(e) => setBatteryPercentage(e.target.value)}
                        placeholder="Enter current battery %"
                        className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 text-gray-700 font-medium"
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            <button
                onClick={searchRoute}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition duration-200 shadow-md shadow-green-600/10 cursor-pointer"
            >
                Search Chargers
            </button>
        </div>
    );
}

export default TripPlanner;
