import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { MdMyLocation } from "react-icons/md";

// Custom Icons
const originIcon = new L.DivIcon({
  html: `
    <div class="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md text-xs">
      A
    </div>
  `,
  className: "custom-origin-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destinationIcon = new L.DivIcon({
  html: `
    <div class="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-md text-xs">
      B
    </div>
  `,
  className: "custom-destination-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const chargerStatusClasses = {
  Available: "bg-green-500 text-white",
  Booked: "bg-yellow-400 text-black",
  Occupied: "bg-yellow-400 text-black",
  Maintenance: "bg-red-500 text-white",
  "Not Available": "bg-red-500 text-white",
};

function getChargerIcon(status, isRecommended) {
  if (isRecommended) {
    return new L.DivIcon({
      html: '<div class="bg-orange-500 text-white w-11 h-11 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-xl text-lg animate-pulse">⚡</div>',
      className: "recommended-charger-icon",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }

  return new L.DivIcon({
    html: `
      <div class="${chargerStatusClasses[status] || chargerStatusClasses.Available} w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-lg text-sm">
        ⚡
      </div>
    `,
    className: "custom-charger-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Auto-fit map to route bounds
function ChangeView({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 12,
      });
    }
  }, [bounds, map]);

  return null;
}

function MiniMap({
  routeData,
  chargers,
  recommendedCharger,
  getCurrentLocation,
  onBookCharger,
}) {
  const chargerRoutePoint = recommendedCharger?.nearestRoutePoint || (
    recommendedCharger && routeData?.geometry?.length
      ? routeData.geometry[Math.round((recommendedCharger.routeProgress || 0) / 100 * (routeData.geometry.length - 1))]
      : null
  );

  return (
    <div className="relative">
      <button
        onClick={getCurrentLocation}
        className="absolute top-3 right-3 z-[1000] bg-white shadow-lg rounded-full w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition duration-150 border border-gray-100 cursor-pointer"
        title="Locate me"
      >
        <MdMyLocation size={22} className="text-gray-600" />
      </button>

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "16px",
          border: "1px solid #f3f4f6",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto fit route */}
        {routeData?.geometry && (
          <ChangeView bounds={routeData.geometry} />
        )}

        {chargerRoutePoint && (
          <Polyline
            positions={[chargerRoutePoint, [recommendedCharger.latitude, recommendedCharger.longitude]]}
            color="#f97316"
            weight={4}
            dashArray="8 10"
          />
        )}

        {/* Origin */}
        {routeData?.origin && (
          <Marker
            position={[
              routeData.origin.lat,
              routeData.origin.lon,
            ]}
            icon={originIcon}
          >
            <Popup>
              <div className="font-semibold text-gray-700 text-sm">
                Origin
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination */}
        {routeData?.destination && (
          <Marker
            position={[
              routeData.destination.lat,
              routeData.destination.lon,
            ]}
            icon={destinationIcon}
          >
            <Popup>
              <div className="font-semibold text-gray-700 text-sm">
                Destination
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route */}
        {routeData?.geometry && (
          <Polyline
            positions={routeData.geometry}
            color="#16a34a"
            weight={5}
            opacity={0.8}
          />
        )}

        {/* Chargers */}
        {chargers?.map((charger) => (
          <Marker
            key={charger._id}
            position={[
              charger.latitude,
              charger.longitude,
            ]}
            icon={getChargerIcon(charger.status, charger._id === recommendedCharger?._id)}
          >
            <Popup>
              <div className="p-2 min-w-[160px]">
                <h4 className="font-bold text-gray-800 text-sm">
                  {charger.name}
                </h4>

                {charger._id === recommendedCharger?._id && (
                  <p className="mt-1 text-xs font-bold text-orange-600">Recommended charging stop</p>
                )}

                <div className="space-y-1 mt-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-400">
                      Power:
                    </span>{" "}
                    {charger.power} kW
                  </div>

                  <div>
                    <span className="font-medium text-gray-400">
                      Price:
                    </span>{" "}
                    ₹{charger.price}/kWh
                  </div>

                  <div>
                    <span className="font-medium text-gray-400">
                      Type:
                    </span>{" "}
                    {charger.type}
                  </div>

                  {charger.distanceFromRoute !== undefined && (
                    <div>
                      <span className="font-medium text-gray-400">
                        Distance:
                      </span>{" "}
                      {charger.distanceFromRoute} km
                    </div>
                  )}

                  {charger.routeProgress !== undefined && (
                    <div>
                      <span className="font-medium text-gray-400">Along trip:</span>{" "}
                      {charger.routeProgress}%
                    </div>
                  )}

                  {charger.rankingScore !== undefined && (
                    <div>
                      <span className="font-medium text-gray-400">
                        Route Score:
                      </span>{" "}
                      {charger.rankingScore}
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-gray-400">
                      Rating:
                    </span>{" "}
                    {charger.rating || 0}/5 ({charger.reviewCount || 0})
                  </div>

                  <div>
                    <span className="font-medium text-gray-400">
                      Status:
                    </span>{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold ${
                        charger.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : charger.status === "Booked" || charger.status === "Occupied"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {charger.status}
                    </span>
                  </div>
                </div>

                <button
                  disabled={charger.status !== "Available"}
                  onClick={() => {
                    if (onBookCharger) {
                      onBookCharger(charger);
                    }
                  }}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 rounded text-xs transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Book Slot
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MiniMap;
