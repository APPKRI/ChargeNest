function BottomSection({
    recentSearches = [],
    bookings = [],
    chargers = [],
    onSelectRecentSearch
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bookings / Trips */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">
                    My Bookings
                </h2>

                {bookings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <p className="text-gray-500 font-medium">
                            No bookings yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                            Your booked charging slots will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between hover:border-gray-200 transition"
                            >
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">
                                        {booking.chargerId?.name || "EV Charger"}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {booking.date} | {booking.time}
                                    </p>
                                </div>
                                <span className="ml-2 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-bold flex-shrink-0">
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Searches */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">
                    Recent Searches
                </h2>

                {recentSearches.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <p className="text-gray-500 font-medium">
                            No recent searches
                        </p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                            Search a route to see history.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                onClick={() => onSelectRecentSearch(search)}
                                className="w-full text-left bg-gray-50 hover:bg-green-50 hover:text-green-600 rounded-xl p-3 border border-gray-100 text-sm font-semibold text-gray-700 transition duration-150 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="text-xs">🔍</span> {search}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Chargers Along Route */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">
                    Chargers Along Route
                </h2>

                {chargers.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <p className="text-gray-500 font-medium">
                            No chargers loaded
                        </p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                            Plan a route to find chargers within 5 km.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
                        {chargers.map((charger) => (
                            <div
                                key={charger._id}
                                className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between hover:border-gray-200 transition"
                            >
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">
                                        {charger.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {charger.power} kW • ₹{charger.price}/kWh
                                    </p>
                                </div>
                                <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-semibold flex-shrink-0">
                                    {charger.type}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BottomSection;