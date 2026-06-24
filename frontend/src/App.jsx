import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DriverDashboard from "./pages/DriverDashboard";
import HostDashboard from "./pages/HostDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
<Route
path="/driver/dashboard"
element={
<ProtectedRoute>
<DriverDashboard />
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