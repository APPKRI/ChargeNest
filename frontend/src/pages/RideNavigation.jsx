import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { MdArrowBack, MdDirections, MdOpenInNew, MdMyLocation } from "react-icons/md";

const destinationIcon = new L.DivIcon({
  html: '<div class="bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-lg">⌖</div>',
  className: "ride-destination-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const locationIcon = new L.DivIcon({
  html: '<div class="w-5 h-5 rounded-full bg-blue-600 border-[3px] border-white shadow-lg"></div>',
  className: "ride-location-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const recommendedChargerIcon = new L.DivIcon({
  html: '<div class="bg-orange-500 text-white w-11 h-11 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-xl text-lg animate-pulse">⚡</div>',
  className: "ride-recommended-charger-icon",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function FitRoute({ geometry }) {
  const map = useMap();
  useEffect(() => {
    if (geometry?.length) map.fitBounds(geometry, { padding: [60, 60], maxZoom: 15 });
  }, [geometry, map]);
  return null;
}

function formatDistance(meters = 0) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

function formatDuration(minutes = 0) {
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours} hr ${Math.round(minutes % 60)} min` : `${Math.round(minutes)} min`;
}

function RideNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [liveLocation, setLiveLocation] = useState(null);
  const [following, setFollowing] = useState(false);
  const trip = location.state?.trip || JSON.parse(sessionStorage.getItem("activeTrip") || "null");

  useEffect(() => {
    if (!trip) navigate("/driver/dashboard", { replace: true });
  }, [navigate, trip]);

  useEffect(() => {
    if (!following || !navigator.geolocation) return undefined;
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => setLiveLocation([coords.latitude, coords.longitude]),
      () => setFollowing(false),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [following]);

  const googleMapsUrl = useMemo(() => {
    if (!trip) return "";
    const { origin, destination } = trip.routeData;
    const waypoint = trip.recommendedCharger
      ? `&waypoints=${trip.recommendedCharger.latitude},${trip.recommendedCharger.longitude}`
      : "";
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lon}&destination=${destination.lat},${destination.lon}${waypoint}&travelmode=driving`;
  }, [trip]);

  if (!trip) return null;

  const { routeData, stats, from, to, recommendedCharger } = trip;
  const nextStep = routeData.steps?.[0];
  const mapGeometry = recommendedCharger
    ? [...(routeData.geometry || []), [recommendedCharger.latitude, recommendedCharger.longitude]]
    : routeData.geometry;
  const chargerRoutePoint = recommendedCharger?.nearestRoutePoint || (
    recommendedCharger && routeData.geometry?.length
      ? routeData.geometry[Math.round((recommendedCharger.routeProgress || 0) / 100 * (routeData.geometry.length - 1))]
      : null
  );

  return (
    <main className="h-screen bg-slate-950 text-white overflow-hidden relative">
      <MapContainer center={routeData.geometry?.[0] || [22.9734, 78.6569]} zoom={13} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRoute geometry={mapGeometry} />
        <Polyline positions={routeData.geometry || []} color="#2563eb" weight={7} opacity={0.9} />
        {chargerRoutePoint && <Polyline positions={[chargerRoutePoint, [recommendedCharger.latitude, recommendedCharger.longitude]]} color="#f97316" weight={4} dashArray="8 10" />}
        {routeData.destination && <Marker position={[routeData.destination.lat, routeData.destination.lon]} icon={destinationIcon} />}
        {recommendedCharger && <Marker position={[recommendedCharger.latitude, recommendedCharger.longitude]} icon={recommendedChargerIcon} />}
        {liveLocation && <Marker position={liveLocation} icon={locationIcon} />}
      </MapContainer>

      <section className="absolute z-[1000] top-0 left-0 right-0 p-4 sm:p-6 pointer-events-none">
        <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded-2xl shadow-2xl p-4 sm:p-5 pointer-events-auto">
          <div className="flex items-start gap-3">
            <button onClick={() => navigate("/driver/dashboard")} className="mt-1 p-2 rounded-full hover:bg-gray-100" aria-label="Exit navigation"><MdArrowBack size={22} /></button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Navigation started</p>
              <h1 className="font-bold text-lg mt-1 truncate">{recommendedCharger ? `Head to ${recommendedCharger.name}` : nextStep?.name ? `Continue on ${nextStep.name}` : `Head to ${to}`}</h1>
              <p className="text-sm text-gray-500 mt-1">{from} <span className="mx-1">→</span> {to}</p>
            </div>
            <MdDirections className="text-blue-600 shrink-0" size={32} />
          </div>
          <div className="flex gap-5 mt-4 pt-3 border-t border-gray-100 text-sm">
            <span><b className="text-lg">{stats.distance} km</b> total</span>
            <span><b className="text-lg">{formatDuration(stats.duration)}</b> remaining</span>
            <span><b className="text-lg">{stats.stops}</b> charge stops</span>
          </div>
        </div>
      </section>

      <section className="absolute z-[1000] bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 pointer-events-auto">
          <button
            onClick={() => setFollowing((value) => !value)}
            className={`flex-1 rounded-xl px-4 py-3.5 font-semibold shadow-xl flex justify-center items-center gap-2 ${following ? "bg-blue-600 text-white" : "bg-white text-gray-900"}`}
          >
            <MdMyLocation size={20} /> {following ? "Following your location" : "Use my live location"}
          </button>
          <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3.5 font-semibold shadow-xl flex justify-center items-center gap-2">
            Open Google Maps <MdOpenInNew size={18} />
          </a>
        </div>
        {routeData.steps?.length > 0 && (
          <div className="max-w-2xl mx-auto mt-3 bg-slate-900/95 backdrop-blur rounded-xl px-4 py-3 pointer-events-auto text-sm">
            <span className="text-slate-400">Next:</span> {nextStep?.maneuver?.type === "arrive" ? "Arrive at destination" : `Drive ${formatDistance(nextStep?.distance)}${nextStep?.name ? ` on ${nextStep.name}` : ""}`}
          </div>
        )}
      </section>
    </main>
  );
}

export default RideNavigation;
