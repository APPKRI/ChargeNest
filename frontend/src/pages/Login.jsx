import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "driver") navigate("/driver/dashboard");
      else navigate("/host/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Background decor */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white font-bold text-lg">⚡</div>
          <span className="text-2xl font-black text-white">ChargeNest</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">
            Welcome back, <br />EV pioneer. 🌱
          </h2>
          <p className="text-green-100 text-lg leading-relaxed">
            Log in to access your dashboard, manage bookings, and continue your green journey.
          </p>

          {/* Floating charger card */}
          <div className="animate-float bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm">⚡</div>
              <div>
                <p className="text-white text-xs font-bold">Live charger data</p>
                <p className="text-green-200 text-[10px]">Shown after login</p>
              </div>
            </div>
            <div className="flex gap-3 text-[10px] text-green-100 font-semibold">
              <span className="bg-white/10 px-2 py-1 rounded-lg">Power</span>
              <span className="bg-white/10 px-2 py-1 rounded-lg">Price</span>
              <span className="bg-white/10 px-2 py-1 rounded-lg">Connector</span>
            </div>
          </div>
        </div>

        <p className="relative text-green-200 text-xs">© 2025 ChargeNest. All rights reserved.</p>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50/50 p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">⚡</div>
            <span className="text-xl font-black text-gray-900">Charge<span className="gradient-text">Nest</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Sign in</h1>
            <p className="text-gray-500 mt-1 text-sm">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition placeholder:text-gray-300 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔑</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition placeholder:text-gray-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign In →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 font-bold hover:text-green-700 transition">
              Create one free →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
