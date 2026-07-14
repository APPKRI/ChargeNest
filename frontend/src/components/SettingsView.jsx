import { useState } from "react";

function SettingsView() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old: "", new: "" });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert("Password updated successfully (Mock)!");
    setPasswordForm({ old: "", new: "" });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Settings ⚙</h2>
        <p className="text-gray-500 text-sm mb-6">Manage system settings and notification triggers</p>
      </div>

      {/* Notifications */}
      <div className="border border-gray-150 rounded-2xl p-6 space-y-4">
        <h3 className="font-extrabold text-gray-850 text-lg mb-2">Notifications</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-700 text-sm">Email Booking Status</h4>
            <p className="text-xs text-gray-400">Receive emails when bookings are confirmed or cancelled.</p>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={() => setEmailAlerts(!emailAlerts)}
            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <h4 className="font-bold text-gray-700 text-sm">SMS Reminders</h4>
            <p className="text-xs text-gray-400">Receive SMS notifications 30 minutes before booking starts.</p>
          </div>
          <input
            type="checkbox"
            checked={smsAlerts}
            onChange={() => setSmsAlerts(!smsAlerts)}
            className="w-5 h-5 accent-green-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Password Management */}
      <div className="border border-gray-150 rounded-2xl p-6">
        <h3 className="font-extrabold text-gray-855 text-lg mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordForm.old}
              onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-green-600/10"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* App Info */}
      <div className="text-center pt-8 border-t border-gray-100 text-xs text-gray-400">
        ChargeNest Dashboard v1.1.0 • Running on Vite & Node-Express
      </div>
    </div>
  );
}

export default SettingsView;
