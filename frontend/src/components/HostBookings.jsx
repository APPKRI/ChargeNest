import { useState } from "react";

function HostBookings({ bookings, onUpdateStatus }) {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Incoming Bookings 📅</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor bookings and manage charging sessions on your chargers</p>
        </div>

        {/* Filter status */}
        <div className="flex gap-2">
          {["all", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status.toLowerCase())}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                (status === "all" && filterStatus === "all") ||
                filterStatus === status.toLowerCase()
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-550 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📅</span>
          <h3 className="text-lg font-bold text-gray-800">No bookings found</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            {filterStatus === "all"
              ? "No driver has booked your chargers yet. Keep your chargers available!"
              : `No bookings found matching status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const charger = booking.chargerId;
            const driver = booking.driverId;
            const cost = booking.totalAmount ?? 0;
            const energyKwh = booking.energyKwh ?? 0;
            const price = booking.price ?? charger?.price;
            return (
              <div
                key={booking._id}
                className="bg-gray-50 border border-gray-100 hover:border-gray-200 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition"
              >
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-gray-850 text-lg">
                      {charger?.name || "EV Charger"}
                    </h4>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        booking.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : booking.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-sm text-gray-500">
                    <div>
                      <span className="font-medium text-gray-400">Driver:</span>{" "}
                      <span className="font-semibold text-gray-700">{driver?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-450 block">{driver?.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Date/Time:</span>{" "}
                      <span className="text-gray-700 font-medium">{booking.date}</span>
                      <span className="text-xs text-gray-450 block">{booking.time}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Specs:</span>{" "}
                      <span className="text-gray-750 font-semibold">{charger?.power || 60} kW</span>
                      <span className="text-xs text-gray-450 block">{charger?.type || "CCS2"} port</span>
                    </div>
                  </div>
                </div>

                {/* Earnings & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 border-gray-200/60 pt-4 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Estimated Revenue</p>
                    <p className="text-2xl font-black text-gray-800 mt-0.5">₹{cost}</p>
                    <p className="text-[10px] text-gray-450 mt-0.5">
                      {price !== undefined ? `₹${price}/kWh × ${energyKwh} kWh` : `${energyKwh} kWh`}
                    </p>
                  </div>

                  {booking.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(booking._id, "Confirmed")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onUpdateStatus(booking._id, "Cancelled")}
                        className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "Confirmed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(booking._id, "Completed")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-green-600/10"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => onUpdateStatus(booking._id, "Cancelled")}
                        className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HostBookings;
