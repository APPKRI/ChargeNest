import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
            Our Mission is to <span className="text-green-600">Empower EV Drivers</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            ChargeNest was founded to eliminate range anxiety and build a community-driven 
            network of home and private electric vehicle charging stations.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <span className="text-4xl bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">🌱</span>
            <h3 className="text-xl font-bold text-gray-800">Eco-Friendly</h3>
            <p className="text-gray-500 mt-3 text-sm">
              We facilitate green travel by optimizing charging routing and promoting carbon emission reduction.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <span className="text-4xl bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">🤝</span>
            <h3 className="text-xl font-bold text-gray-800">Community Powered</h3>
            <p className="text-gray-500 mt-3 text-sm">
              Hosts share their private chargers, helping other drivers while earning passive income.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <span className="text-4xl bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">⚡</span>
            <h3 className="text-xl font-bold text-gray-800">Seamless Integration</h3>
            <p className="text-gray-500 mt-3 text-sm">
              Our route-aware charger finder locates stations directly along your path without detours.
            </p>
          </div>
        </div>

        {/* Company Detail Section */}
        <div className="mt-20 bg-white rounded-3xl shadow-sm p-12 border border-gray-100 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Why ChargeNest Matters</h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              As EV adoption accelerates, public charging infrastructure often falls short. ChargeNest fills this gap by leveraging private residential chargers. By matching driver routes with available chargers, we create a network that is both dense and affordable.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-gray-700 font-medium">Earn passive income with zero effort</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-gray-700 font-medium">Plan complex multi-city road trips worry-free</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-gray-700 font-medium">Clean, secure, and user-rated locations</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png" 
              alt="Electric grid concept" 
              className="w-80 opacity-90"
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ChargeNest. All rights reserved.
      </footer>
    </div>
  );
}

export default About;
