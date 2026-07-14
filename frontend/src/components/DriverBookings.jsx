import { useState } from "react";

function DriverBookings({ bookings, onCancelBooking, onReviewBooking }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewDrafts, setReviewDrafts] = useState({});

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">My Bookings 📅</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and track your EV charging reservations</p>
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
              ? "You haven't booked any charging slots yet. Start planning a route to find chargers!"
              : `You have no bookings matching the status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const charger = booking.chargerId;
            const cost = booking.totalAmount ?? 0;
            const energyKwh = booking.energyKwh ?? 0;
            const price = booking.price ?? charger?.price;
            const draft = reviewDrafts[booking._id] || { rating: 5, feedback: "" };
            return (
              <div
                key={booking._id}
                className="bg-gray-50 border border-gray-100 hover:border-gray-200 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-center gap-6 transition"
              >
                {/* Details */}
                <div className="space-y-2">
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
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-sm text-gray-500">
                    <div>
                      <span className="font-medium text-gray-400">Date:</span> {booking.date}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Time:</span> {booking.time}
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Power:</span> {charger?.power || 60} kW
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Port Type:</span> {charger?.type || "CCS2"}
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 border-gray-200/60 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Estimated Cost</p>
                    <p className="text-2xl font-black text-gray-800 mt-0.5">₹{cost}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {price !== undefined ? `₹${price}/kWh × ${energyKwh} kWh` : `${energyKwh} kWh`}
                    </p>
                  </div>

	                  {(booking.status === "Pending" || booking.status === "Confirmed") && (
	                    <button
	                      onClick={() => onCancelBooking(booking._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Cancel Booking
	                    </button>
	                  )}
	                </div>
                {booking.status === "Completed" && !booking.review?.rating && (
                  <div className="md:col-span-2 w-full border-t border-gray-200/60 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-3">
                      <select
                        value={draft.rating}
                        onChange={(e) => setReviewDrafts({
                          ...reviewDrafts,
                          [booking._id]: { ...draft, rating: Number(e.target.value) }
                        })}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>{rating} stars</option>
                        ))}
                      </select>
                      <input
                        value={draft.feedback}
                        onChange={(e) => setReviewDrafts({
                          ...reviewDrafts,
                          [booking._id]: { ...draft, feedback: e.target.value }
                        })}
                        placeholder="Share your charging experience"
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => onReviewBooking(booking._id, draft.rating, draft.feedback)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}
                {booking.review?.rating && (
                  <div className="md:col-span-2 w-full border-t border-gray-200/60 pt-4 text-sm text-gray-500">
                    Your review: <span className="font-bold text-gray-800">{booking.review.rating}/5</span>
                    {booking.review.feedback ? ` - ${booking.review.feedback}` : ""}
                  </div>
                )}
	              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DriverBookings;
