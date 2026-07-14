import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HostBookings from "../components/HostBookings";
import WalletView from "../components/WalletView";
import ProfileView from "../components/ProfileView";
import SettingsView from "../components/SettingsView";

function HostDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect if not logged in or not host
    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.role !== "host") {
            navigate("/driver/dashboard");
        }
    }, [user, navigate]);

    const [activeTab, setActiveTab] = useState("dashboard");
    const [chargers, setChargers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [resolvedLat, setResolvedLat] = useState(null);
    const [resolvedLon, setResolvedLon] = useState(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const locationDebounceRef = useState(null);
    const [power, setPower] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("CCS2");
    const [status, setStatus] = useState("Available");

    const fetchHostData = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("token");
            
            // Fetch all chargers
            const chargersRes = await axios.get("http://localhost:5000/api/chargers");
            // Filter chargers owned by this host
            const hostChargers = chargersRes.data.filter(c => c.hostId === user.id);
            setChargers(hostChargers);

            // Fetch bookings for this host
            const bookingsRes = await axios.get(`http://localhost:5000/api/bookings?hostId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookingsRes.data);

            const analyticsRes = await axios.get(`http://localhost:5000/api/bookings/analytics?hostId=${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Error fetching host data:", error);
        }
    };

    useEffect(() => {
        if (user && user.role === "host") {
            fetchHostData();
        }
    }, []);

    // Location autocomplete handler
    const handleLocationSearch = (value) => {
        setAddress(value);
        setResolvedLat(null);
        setResolvedLon(null);

        if (locationDebounceRef[0]) clearTimeout(locationDebounceRef[0]);

        if (value.trim().length < 3) {
            setLocationSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        locationDebounceRef[0] = setTimeout(async () => {
            try {
                setLocationLoading(true);
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=6&addressdetails=1`,
                    { headers: { "Accept-Language": "en" } }
                );
                setLocationSuggestions(res.data);
                setShowSuggestions(true);
            } catch {
                setLocationSuggestions([]);
            } finally {
                setLocationLoading(false);
            }
        }, 400);
    };

    const handleSelectLocation = (suggestion) => {
        setAddress(suggestion.display_name);
        setResolvedLat(parseFloat(suggestion.lat));
        setResolvedLon(parseFloat(suggestion.lon));
        setLocationSuggestions([]);
        setShowSuggestions(false);
    };

    // Handle adding charger
    const handleAddCharger = async (e) => {
        e.preventDefault();
        if (!name || !address || !power || !price) {
            alert("All fields are required.");
            return;
        }

        if (!resolvedLat || !resolvedLon) {
            alert("Please select a location from the suggestions dropdown.");
            return;
        }

        try {
            setLoading(true);

            const lat = resolvedLat;
            const lon = resolvedLon;

            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/chargers", {
                name,
                latitude: lat,
                longitude: lon,
                power: Number(power),
                price: Number(price),
                type,
                status,
                hostId: user.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Charger added successfully! 🎉");
            
            // Clear form
            setName("");
            setAddress("");
            setResolvedLat(null);
            setResolvedLon(null);
            setLocationSuggestions([]);
            setPower("");
            setPrice("");
            setType("CCS2");
            setStatus("Available");
            // Refresh
            fetchHostData();
        } catch (err) {
            console.error("Error adding charger:", err);
            alert(err.response?.data?.message || "Failed to add charger. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCharger = async (chargerId) => {
        if (confirm("Are you sure you want to delete this charger? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/chargers/${chargerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Charger deleted successfully! 🎉");
                fetchHostData();
            } catch (error) {
                console.error("Error deleting charger:", error);
                alert(error.response?.data?.message || "Failed to delete charger.");
            }
        }
    };

    const handleUpdateChargerStatus = async (chargerId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/chargers/${chargerId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Charger status updated successfully! ⚡");
            fetchHostData();
        } catch (error) {
            console.error("Error updating charger status:", error);
            alert("Failed to update status.");
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        if (confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) {
            try {
                const token = localStorage.getItem("token");
                await axios.put(`http://localhost:5000/api/bookings/${bookingId}`, {
                    status: newStatus
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert(`Booking marked as ${newStatus} successfully!`);
                fetchHostData();
            } catch (error) {
                console.error("Error updating booking status:", error);
                alert("Failed to update booking status.");
            }
        }
    };

    // Calculate host metrics
    const totalBookings = analytics?.totalBookings ?? bookings.length;
    const completedBookings = bookings.filter((booking) => booking.status === "Completed").length;
    const totalEarnings = analytics?.totalEarnings ?? 0;
    const energyShared = analytics?.energyShared ?? 0;
    const averageRating = analytics?.averageRating ?? 0;
    const maxMonthlyRevenue = Math.max(...(analytics?.monthlyRevenue || []).map((item) => item.amount), 1);
    const maxPeakCount = Math.max(...(analytics?.peakHours || []).map((item) => item.count), 1);

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
                                    Host Dashboard 💼
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    Manage your chargers, monitor bookings, and view earnings.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg shadow-sm">
                                    {user?.name?.charAt(0)}
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Chargers</p>
                                    <div className="text-2xl mt-1">🔌</div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{chargers.length}</h2>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Energy Shared</p>
                                    <div className="text-2xl mt-1">⚡</div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{energyShared} kWh</h2>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Bookings</p>
                                    <div className="text-2xl mt-1">📅</div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{totalBookings}</h2>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Earnings</p>
                                    <div className="text-2xl mt-1">💰</div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mt-2">₹{totalEarnings}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Rating</p>
                                <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{averageRating}/5</h2>
                                <p className="text-xs text-gray-400 mt-1">{completedBookings} completed sessions</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Monthly Revenue</p>
                                <div className="mt-4 space-y-3">
                                    {(analytics?.monthlyRevenue || []).slice(-4).map((item) => (
                                        <div key={item.month} className="grid grid-cols-[80px_1fr_70px] items-center gap-3 text-xs">
                                            <span className="font-semibold text-gray-500">{item.month}</span>
                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className="h-full bg-green-600 rounded-full"
                                                    style={{ width: `${Math.max((item.amount / maxMonthlyRevenue) * 100, 8)}%` }}
                                                />
                                            </div>
                                            <span className="text-right font-bold text-gray-700">₹{item.amount}</span>
                                        </div>
                                    ))}
                                    {(analytics?.monthlyRevenue || []).length === 0 && (
                                        <p className="text-sm text-gray-400">No completed sessions yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Peak Charging Hours</p>
                                <div className="mt-4 space-y-3">
                                    {(analytics?.peakHours || []).slice(0, 4).map((item) => (
                                        <div key={item.slot} className="grid grid-cols-[1fr_40px] items-center gap-3 text-xs">
                                            <div>
                                                <div className="flex justify-between text-gray-500 font-semibold mb-1">
                                                    <span>{item.slot}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        style={{ width: `${Math.max((item.count / maxPeakCount) * 100, 8)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-right font-bold text-gray-700">{item.count}</span>
                                        </div>
                                    ))}
                                    {(analytics?.peakHours || []).length === 0 && (
                                        <p className="text-sm text-gray-400">No booking pattern yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form + Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                            {/* Add Charger Form */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between lg:col-span-1">
                                <form onSubmit={handleAddCharger} className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Charger</h2>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Charger Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="GreenVolt Hub"
                                            className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="text-sm font-medium text-gray-500">Address / Location</label>
                                        <div className="relative mt-1">
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => handleLocationSearch(e.target.value)}
                                                onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                                                placeholder="Search location… e.g. Sector 62, Noida"
                                                className={`w-full border rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 transition ${
                                                    resolvedLat ? "border-green-400" : "border-gray-200"
                                                }`}
                                                required
                                                autoComplete="off"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                                                {locationLoading ? (
                                                    <svg className="animate-spin h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                ) : resolvedLat ? "✅" : "📍"}
                                            </span>
                                        </div>

                                        {/* Suggestions dropdown */}
                                        {showSuggestions && locationSuggestions.length > 0 && (
                                            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                                                {locationSuggestions.map((s, i) => (
                                                    <li
                                                        key={i}
                                                        onMouseDown={() => handleSelectLocation(s)}
                                                        className="px-4 py-2.5 text-xs text-gray-700 cursor-pointer hover:bg-green-50 hover:text-green-700 flex items-start gap-2 border-b border-gray-50 last:border-0 transition"
                                                    >
                                                        <span className="mt-0.5 shrink-0">📍</span>
                                                        <span className="leading-snug">{s.display_name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* Resolved coordinate badge */}
                                        {resolvedLat && (
                                            <p className="text-[10px] text-green-600 font-semibold mt-1 px-1">
                                                📌 {resolvedLat.toFixed(5)}, {resolvedLon.toFixed(5)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Power (kW)</label>
                                            <input
                                                type="number"
                                                value={power}
                                                onChange={(e) => setPower(e.target.value)}
                                                placeholder="120"
                                                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Price (₹/kWh)</label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="18"
                                                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Port Type</label>
                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 text-gray-700 font-medium"
                                            >
                                                <option value="CCS2">CCS2</option>
                                                <option value="CHAdeMO">CHAdeMO</option>
                                                <option value="Type 2 AC">Type 2 AC</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status</label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50 text-gray-700 font-medium"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Booked">Booked</option>
                                                <option value="Occupied">Occupied</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Not Available">Not Available</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition duration-200 shadow-md shadow-green-600/10 cursor-pointer disabled:bg-gray-300"
                                    >
                                        {loading ? "Adding..." : "Add Charger"}
                                    </button>
                                </form>
                            </div>

                            {/* Chargers & Bookings Lists */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Chargers list */}
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">My Chargers</h2>
                                    {chargers.length === 0 ? (
                                        <p className="text-gray-500">You haven't added any chargers yet.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
                                            {chargers.map((c) => (
                                                <div key={c._id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:border-gray-200 transition">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-base">{c.name}</h3>
                                                            <p className="text-xs text-gray-400 mt-1">Coordinates: {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</p>
                                                        </div>
                                                        <select
                                                            value={c.status}
                                                            onChange={(e) => handleUpdateChargerStatus(c._id, e.target.value)}
                                                            className={`text-xs px-2 py-0.5 rounded font-bold border border-gray-200 focus:outline-none cursor-pointer ${
                                                                c.status === "Available" ? "bg-green-150 text-green-700 border-green-200" :
                                                                c.status === "Occupied" ? "bg-yellow-150 text-yellow-700 border-yellow-250" :
                                                                "bg-red-150 text-red-700 border-red-200"
                                                            }`}
                                                        >
                                                            <option value="Available">Available</option>
                                                            <option value="Booked">Booked</option>
                                                            <option value="Occupied">Occupied</option>
                                                            <option value="Maintenance">Maintenance</option>
                                                            <option value="Not Available">Not Available</option>
                                                        </select>
                                                    </div>
                                                    <div className="mt-4 flex justify-between items-center text-xs text-gray-600 font-semibold border-t border-gray-100 pt-3">
                                                        <span>⚡ {c.power} kW</span>
                                                        <span>₹{c.price}/kWh</span>
                                                        <span className="bg-gray-200 px-2 py-1 rounded text-[10px]">{c.type}</span>
                                                    </div>
                                                    <div className="mt-3 flex justify-end">
                                                        <button
                                                            onClick={() => handleDeleteCharger(c._id)}
                                                            className="text-[10px] text-red-500 hover:text-red-700 font-bold transition cursor-pointer"
                                                        >
                                                            Delete Charger
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Charger bookings */}
                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bookings for My Chargers</h2>
                                    {bookings.length === 0 ? (
                                        <p className="text-gray-500">No bookings made on your chargers yet.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {bookings.map((booking) => (
                                                <div key={booking._id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm">{booking.chargerId?.name || "Deleted Charger"}</h4>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Driver: <span className="font-medium text-gray-600">{booking.driverId?.name || "Unknown"}</span> ({booking.driverId?.email})
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{booking.date} | {booking.time}</p>
                                                    </div>
                                                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "bookings" && (
                    <HostBookings
                        bookings={bookings}
                        onUpdateStatus={handleUpdateBookingStatus}
                    />
                )}

                {activeTab === "wallet" && (
                    <WalletView
                        user={user}
                        onRechargeSuccess={() => {}}
                    />
                )}

                {activeTab === "profile" && <ProfileView user={user} />}

                {activeTab === "settings" && <SettingsView />}
            </div>
        </div>
    );
}

export default HostDashboard;
