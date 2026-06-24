import Sidebar from "../components/Sidebar";
import TripPlanner from "../components/TripPlanner";
import RouteOverview from "../components/RouteOverview";
import Stats from "../components/Stats";
import BottomSection from "../components/BottomSection";

function DriverDashboard(){

const user = JSON.parse(localStorage.getItem("user"));

return(

<div className="min-h-screen bg-gray-50 flex">

<Sidebar/>

<div className="flex-1 p-8">


<h1 className="text-4xl font-bold">

Welcome back, {user?.name} 👋

</h1>


<p className="text-gray-500 mt-2">

Plan your trip and find EV chargers on the way

</p>



<div className="grid grid-cols-2 gap-6 mt-8">

<TripPlanner/>

<RouteOverview/>

</div>



<div className="mt-6">

<Stats/>

</div>



<div className="mt-6">

<BottomSection/>

</div>


</div>


</div>

)

}


export default DriverDashboard;