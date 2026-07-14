import { useState, useEffect } from "react";

const EV_MODELS = [
  { id: "tata-tiago-ev-lr", name: "Tata Tiago EV LR", range: 293, battery: "24 kWh", connectorType: "CCS2" },
  { id: "tata-tigor-ev", name: "Tata Tigor EV", range: 315, battery: "26 kWh", connectorType: "CCS2" },
  { id: "tata-punch-ev-lr", name: "Tata Punch EV Long Range", range: 468, battery: "40 kWh", connectorType: "CCS2" },
  { id: "tata-nexon-ev-45", name: "Tata Nexon EV 45", range: 489, battery: "45 kWh", connectorType: "CCS2" },
  { id: "tata-curvv-ev-55", name: "Tata Curvv EV 55", range: 502, battery: "55 kWh", connectorType: "CCS2" },
  { id: "mg-comet-ev", name: "MG Comet EV", range: 230, battery: "17.3 kWh", connectorType: "Type 2 AC" },
  { id: "mg-zs-ev", name: "MG ZS EV", range: 461, battery: "50.3 kWh", connectorType: "CCS2" },
  { id: "hyundai-creta-electric-lr", name: "Hyundai CRETA Electric Long Range", range: 473, battery: "51.4 kWh", connectorType: "CCS2" },
  { id: "byd-atto-3", name: "BYD Atto 3", range: 521, battery: "60.48 kWh", connectorType: "CCS2" },
  { id: "byd-seal", name: "BYD Seal", range: 650, battery: "82.56 kWh", connectorType: "CCS2" },
  { id: "kia-ev6", name: "Kia EV6", range: 708, battery: "77.4 kWh", connectorType: "CCS2" }
];

function VehiclesList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const storageKey = `vehicles_${user?.id || "guest"}`;

  const [vehicles, setVehicles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");

  const isLegacySampleVehicles = (items) => {
    if (!Array.isArray(items) || items.length !== 2) return false;
    return items.some((item) => item.name === "Tata Punch EV" && Number(item.range) === 300) &&
      items.some((item) => item.name === "Nexon EV Max" && Number(item.range) === 450);
  };

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const parsedVehicles = saved ? JSON.parse(saved) : [];
    if (isLegacySampleVehicles(parsedVehicles)) {
      localStorage.setItem(storageKey, JSON.stringify([]));
      setVehicles([]);
      return;
    }
    setVehicles(parsedVehicles);
  }, [storageKey]);

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const model = EV_MODELS.find((item) => item.id === selectedModel);
    if (!model) {
      alert("Please select an EV model.");
      return;
    }
    if (vehicles.some((item) => item.modelId === model.id)) {
      alert("This vehicle is already in your list.");
      return;
    }
    const newVehicle = {
      id: Date.now().toString(),
      modelId: model.id,
      name: model.name,
      range: model.range,
      battery: model.battery,
      connectorType: model.connectorType
    };
    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Clear form
    setSelectedModel("");
    setShowAddForm(false);
  };

  const handleDeleteVehicle = (id) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">My Vehicles 🚗</h2>
          <p className="text-gray-500 text-sm mt-1">Choose your EV model to use its claimed range, battery, and connector details.</p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-sm shadow-green-600/10"
          >
            + Add Vehicle
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-bold text-gray-850 mb-4">Add New EV</h3>
          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Select EV model</label>
              <select
                required
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Choose your vehicle</option>
                {EV_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} — {model.range} km, {model.battery}, {model.connectorType}
                  </option>
                ))}
              </select>
            </div>
            {selectedModel && (() => {
              const model = EV_MODELS.find((item) => item.id === selectedModel);
              return <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-white border border-gray-200 p-3"><p className="text-xs text-gray-400">Range</p><p className="font-bold text-gray-800">{model.range} km</p></div>
                <div className="rounded-xl bg-white border border-gray-200 p-3"><p className="text-xs text-gray-400">Battery</p><p className="font-bold text-gray-800">{model.battery}</p></div>
                <div className="rounded-xl bg-white border border-gray-200 p-3"><p className="text-xs text-gray-400">Connector</p><p className="font-bold text-gray-800">{model.connectorType}</p></div>
              </div>;
            })()}
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-250 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-green-600/10"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🚗</span>
          <h3 className="text-lg font-bold text-gray-800">No vehicles registered</h3>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            Add your EV models to calculate charging stops accurately.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-gray-50 border border-gray-100 hover:border-gray-200 p-6 rounded-3xl flex flex-col justify-between h-48 transition"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-gray-800 text-lg">{v.name}</h4>
                  <span className="text-[10px] px-2.5 py-1 bg-green-100 text-green-700 font-bold rounded-full">
                    {v.connectorType}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-800">{v.range}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase">km claimed range</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{v.battery || "Battery information unavailable"}</p>
              </div>

              <div className="border-t border-gray-200/60 pt-3 flex justify-end">
                <button
                  onClick={() => handleDeleteVehicle(v.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer transition"
                >
                  Remove Vehicle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehiclesList;
