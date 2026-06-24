import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-green-600"
        >
          ChargeNest
        </Link>


        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-700 hover:text-green-600 transition"
          >
            Home
          </Link>


          <Link
            to="/about"
            className="text-gray-700 hover:text-green-600 transition"
          >
            About
          </Link>


          <Link
            to="/contact"
            className="text-gray-700 hover:text-green-600 transition"
          >
            Contact
          </Link>

        </div>



        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="px-4 py-2 border border-green-600 rounded-lg text-green-600 hover:bg-green-50 transition"
          >
            Login
          </Link>


          <Link
            to="/signup"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;