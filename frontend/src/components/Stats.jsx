function Stats({ bookings = [] }) {
    const completedBookings = bookings.filter((booking) => booking.status === "Completed");
    const activeBookings = bookings.filter((booking) => ["Pending", "Confirmed"].includes(booking.status));
    const energyCharged = completedBookings.reduce(
        (sum, booking) => sum + Number(booking.energyKwh || 0),
        0
    );
    const co2Saved = (energyCharged * 0.4).toFixed(1); // 0.4 kg CO2 saved per kWh

    const stats = [
        {
            title: "Completed Trips",
            value: completedBookings.length.toString(),
            subtitle: "From finished bookings",
            icon: "🛣️"
        },
        {
            title: "Active Bookings",
            value: activeBookings.length.toString(),
            subtitle: "Pending or confirmed",
            icon: "📅"
        },
        {
            title: "Energy Charged",
            value: `${energyCharged} kWh`,
            subtitle: "Completed sessions",
            icon: "⚡"
        },
        {
            title: "CO₂ Saved",
            value: `${co2Saved} kg`,
            subtitle: "Environmental Impact",
            icon: "🌱"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            {item.title}
                        </p>
                        <div className="text-2xl bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100">
                            {item.icon}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-3xl font-extrabold text-gray-800">
                            {item.value}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                            {item.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Stats;
