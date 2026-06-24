function Sidebar(){

return(

<div className="w-64 bg-white min-h-screen border-r">


<h1 className="text-3xl font-bold text-green-600 p-6">

⚡ ChargeNest

</h1>



<div className="space-y-2 px-4">


<button className="w-full bg-green-50 text-green-600 rounded-xl p-3 text-left">

Dashboard

</button>


<button className="w-full rounded-xl p-3 text-left">

Search Route

</button>


<button className="w-full rounded-xl p-3 text-left">

Bookings

</button>


<button className="w-full rounded-xl p-3 text-left">

Vehicles

</button>


<button className="w-full rounded-xl p-3 text-left">

Wallet

</button>


<button className="w-full rounded-xl p-3 text-left">

Profile

</button>


<button className="w-full rounded-xl p-3 text-left">

Settings

</button>


</div>


</div>

)

}

export default Sidebar;