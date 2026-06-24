function Hero() {
  return (
    <section className="bg-green-50 min-h-[85vh] flex items-center">

      <div className="max-w-7xl mx-auto px-6 w-full">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">

              Charge your EV
              <span className="text-green-600"> anywhere</span>,
              anytime.

            </h1>

            <p className="mt-6 text-lg text-gray-600">

              Find trusted home charging stations
              along your journey and charge
              without range anxiety.

            </p>


            <div className="mt-8 flex gap-4">

              <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Find Chargers
              </button>


              <button
                className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-100"
              >
                Become a Host
              </button>

            </div>

          </div>


          {/* Right Side */}

          <div className="flex justify-center">

            <img
              src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png"
              alt="EV"
              className="w-96"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;