import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DriverDashboard from "./pages/DriverDashboard";
import RideNavigation from "./pages/RideNavigation";
import HostDashboard from "./pages/HostDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />
<Route
path="/driver/dashboard"
element={
<ProtectedRoute>
<DriverDashboard />
</ProtectedRoute>
}
/>

<Route
path="/driver/navigate"
element={
<ProtectedRoute>
<RideNavigation />
</ProtectedRoute>
}
/>


<Route
path="/host/dashboard"
element={
<ProtectedRoute>
<HostDashboard />
</ProtectedRoute>
}
/>

      </Routes>

    </BrowserRouter>

  );

}

export default App;
