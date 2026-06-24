function Features() {
  return (

    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Why Choose ChargeNest?
        </h2>

        <p className="text-center text-gray-600 mt-4">
          Making EV charging simple, affordable and accessible.
        </p>


        <div className="grid md:grid-cols-3 gap-8 mt-16">


          {/* Card 1 */}

          <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition">

            <div className="text-5xl mb-4">
              📍
            </div>

            <h3 className="text-2xl font-semibold">
              Route Aware Search
            </h3>

            <p className="text-gray-600 mt-3">

              Find charging stations that lie
              directly along your journey.

            </p>

          </div>



          {/* Card 2 */}

          <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition">

            <div className="text-5xl mb-4">
              📅
            </div>

            <h3 className="text-2xl font-semibold">
              Instant Booking
            </h3>

            <p className="text-gray-600 mt-3">

              Reserve your charging slot
              in just a few clicks.

            </p>

          </div>



          {/* Card 3 */}

          <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition">

            <div className="text-5xl mb-4">
              💳
            </div>

            <h3 className="text-2xl font-semibold">
              Secure Payments
            </h3>

            <p className="text-gray-600 mt-3">

              Pay securely through UPI
              after your charging session.

            </p>

          </div>


        </div>

      </div>

    </section>

  );
}

export default Features;