import { useState } from "react";
import Navbar from "../components/Navbar";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const rawBody = await response.text();
      let data = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        data = { message: "The server returned an invalid response." };
      }
      if (!response.ok) throw new Error(data.message);

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Unable to reach the server. Please start the backend and try again."
          : requestError.message || "Could not send your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
          
          {/* Info Side */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
                Get in <span className="text-green-600">touch</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Have questions about registering your charging station? Or need help with a booking? 
                Send us a message and our support team will get back to you shortly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-2xl bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">👤</span>
                <div>
                  <h4 className="font-bold text-gray-800">Contact person</h4>
                  <p className="text-gray-500 text-sm">Krish Yadav</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-2xl bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">📞</span>
                <div>
                  <h4 className="font-bold text-gray-800">Phone</h4>
                  <a href="tel:8724013198" className="text-gray-500 text-sm hover:text-green-600">8724013198</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-850 mb-6">Send Message</h3>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-semibold">
                Thank you! Your message has been sent successfully. We'll reply soon. ⚡
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50/50"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-md shadow-green-600/10 cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ChargeNest. All rights reserved.
      </footer>
    </div>
  );
}

export default Contact;
