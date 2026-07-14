import { useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdCalendarMonth,
    MdDirectionsCar,
    MdAccountCircle,
    MdSettings,
    MdLogout
} from "react-icons/md";

function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role || "driver";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
        { id: "bookings", label: "Bookings", icon: <MdCalendarMonth size={22} /> },
        ...(role === "driver" ? [{ id: "vehicles", label: "Vehicles", icon: <MdDirectionsCar size={22} /> }] : []),
        { id: "profile", label: "Profile", icon: <MdAccountCircle size={22} /> },
        { id: "settings", label: "Settings", icon: <MdSettings size={22} /> }
    ];

    return (
        <div className="w-60 bg-white min-h-screen border-r flex flex-col justify-between select-none">
            {/* Top Area */}
            <div>
                {/* Logo */}
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-green-600 flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
                        ⚡ ChargeNest
                    </h1>
                </div>

                {/* Navigation */}
                <div className="px-4 space-y-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full rounded-xl p-3 text-left transition duration-150 flex items-center gap-3 cursor-pointer ${
                                    isActive
                                        ? "bg-green-50 text-green-600 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Area */}
            <div className="p-4 space-y-4">
                <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-xl p-3 text-red-650 hover:bg-red-50 hover:text-red-700 transition duration-150 flex items-center gap-3 cursor-pointer font-medium"
                >
                    <MdLogout size={22} />
                    Logout
                </button>

                <div className="bg-green-50 rounded-2xl p-5">
                    <h3 className="text-green-600 font-semibold flex items-center gap-1">
                        ⚡ Go Green
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                        Every charge makes a difference
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
