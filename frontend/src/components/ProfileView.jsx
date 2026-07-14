import { useNavigate } from "react-router-dom";

function ProfileView({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] max-w-4xl mx-auto flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">My Profile 👤</h2>
        <p className="text-gray-500 text-sm mb-8">Manage your account information and preferences</p>

        {/* User Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-8">
          <div className="bg-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-md">
            {user?.name?.charAt(0)}
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-2xl font-black text-gray-800">{user?.name}</h3>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{user?.role} Account</p>
            <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-150 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Account ID</h4>
            <p className="text-sm font-semibold text-gray-700 mt-1 break-all">{user?.id || "Not available"}</p>
          </div>

          <div className="border border-gray-150 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Wallet Balance</h4>
            <p className="text-sm font-semibold text-gray-700 mt-1">₹{Number(user?.balance || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200/60 pt-8 mt-8 flex justify-end gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 font-bold px-6 py-3 rounded-xl text-sm transition cursor-pointer"
        >
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}

export default ProfileView;
