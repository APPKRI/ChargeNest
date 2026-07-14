import MiniMap from "./MiniMap";

function RouteOverview({
    routeData,
    stats,
    chargers,
    recommendedCharger,
    routeOptions = [],
    selectedRouteIndex,
    onSelectRoute,
    getCurrentLocation,
    onBookCharger,
    onStartRide,
    isSearchingChargers
}) {
    const hours = Math.floor((stats?.duration || 0) / 60);
    const minutes = Math.round((stats?.duration || 0) % 60);
    const availableChargers = chargers?.filter((charger) => charger.status === "Available") || [];
    const chargingRequired = (stats?.stops || 0) > 0;
    const noAvailableCharging = chargingRequired && !isSearchingChargers && availableChargers.length === 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Route Overview
                </h2>

                <MiniMap
                    routeData={routeData}
                    chargers={chargers}
                    recommendedCharger={recommendedCharger}
                    getCurrentLocation={getCurrentLocation}
                    onBookCharger={onBookCharger}
                />

                <div className="grid grid-cols-3 gap-4 mt-5">
                    {/* Distance */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Distance
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 mt-1">
                            {stats?.distance || 0} km
                        </h3>
                    </div>

                    {/* ETA */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            ETA
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 mt-1">
                            {hours > 0
                                ? `${hours}h ${minutes}m`
                                : `${minutes} min`}
                        </h3>
                    </div>

                    {/* Stops */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Est. Stops
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 mt-1">
                            {stats?.stops || 0}
                        </h3>
                    </div>
                </div>

                {routeOptions.length > 1 && (
                    <div className="mt-5 space-y-2" role="radiogroup" aria-label="Route options">
                        {routeOptions.map((option, index) => (
                            <button
                                key={option.id}
                                type="button"
                                role="radio"
                                aria-checked={selectedRouteIndex === index}
                                onClick={() => onSelectRoute(index)}
                                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${selectedRouteIndex === index ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                            >
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-bold text-gray-800">{option.label}</span>
                                    <span className="font-semibold text-gray-700">{option.stats.distance} km · {Math.floor(option.stats.duration / 60) ? `${Math.floor(option.stats.duration / 60)}h ` : ""}{Math.round(option.stats.duration % 60)}m</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 truncate">{option.routeData.roads?.join(" · ") || "Driving route"} · {option.stats.stops} charge stop{option.stats.stops === 1 ? "" : "s"}</p>
                            </button>
                        ))}
                    </div>
                )}

                {chargingRequired && isSearchingChargers && (
                    <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
                        Checking available chargers along your route…
                    </div>
                )}

                {noAvailableCharging && (
                    <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                        <p className="font-bold">Charging stop required, but no available charger was found on this route.</p>
                        <p className="mt-1">Charge your EV before leaving, choose a different destination, or try again later.</p>
                    </div>
                )}

                {chargingRequired && recommendedCharger && (
                    <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                        <p className="font-bold">Recommended charging stop: {recommendedCharger.name}</p>
                        <p className="mt-1">{recommendedCharger.power} kW · {recommendedCharger.distanceFromRoute} km from this route. Navigation will go here first.</p>
                    </div>
                )}

                {routeData && (
                    <button
                        type="button"
                        onClick={onStartRide}
                        disabled={noAvailableCharging || isSearchingChargers}
                        className="mt-5 w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <span>🧭</span> {noAvailableCharging ? "Charging stop needed" : "Start ride"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default RouteOverview;
