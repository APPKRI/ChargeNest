import { useState, useEffect } from "react";
import axios from "axios";

function WalletView({ user, onRechargeSuccess }) {
  const [balance, setBalance] = useState(user?.balance || 0);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchUpdatedProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/auth/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(res.data.balance);
      
      // Update local storage so other components can access the fresh balance
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      storedUser.balance = res.data.balance;
      localStorage.setItem("user", JSON.stringify(storedUser));
      
      if (onRechargeSuccess) {
        onRechargeSuccess(res.data.balance);
      }
    } catch (err) {
      console.error("Error fetching profile balance:", err);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/bookings?${user.role === "driver" ? "driverId" : "hostId"}=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map bookings to transaction history items
      const txs = res.data
        .filter(b => user.role === "driver"
          ? b.status === "Confirmed" || b.status === "Completed"
          : b.status === "Completed"
        )
        .map(b => ({
          id: b._id,
          description: user.role === "driver" 
            ? `Charging session - ${b.chargerId?.name || "EV Charger"}`
            : `Booking payout - ${b.chargerId?.name || "EV Charger"}`,
          date: b.date,
          time: b.time,
          amount: b.totalAmount || 0,
          type: user.role === "driver" ? "debit" : "credit",
          status: b.status
        }));
      setHistory(txs);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchUpdatedProfile();
    fetchTransactionHistory();
  }, []);

  const handleRecharge = async (e) => {
    e.preventDefault();
    const amount = Number(rechargeAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/auth/wallet/recharge", {
        userId: user.id,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`₹${amount} added successfully to your wallet! ⚡`);
      setRechargeAmount("");
      fetchUpdatedProfile();
      fetchTransactionHistory();
    } catch (err) {
      console.error("Recharge failed:", err);
      alert("Failed to add money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[60vh] grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Balance Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <p className="text-sm font-semibold tracking-wider text-green-100 uppercase">Total Balance</p>
          <h3 className="text-5xl font-black mt-3">₹{balance.toFixed(2)}</h3>
          
          <div className="mt-8 flex justify-between items-center text-xs text-green-150">
            <span>nestPay Wallet</span>
            <span>Active Status</span>
          </div>
        </div>

        {user.role === "driver" && (
          <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6">
            <h4 className="font-bold text-gray-800 text-base mb-3">Recharge Wallet</h4>
            <form onSubmit={handleRecharge} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  placeholder="Enter amount"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full border border-gray-250 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white font-semibold text-gray-800"
                  min="100"
                />
              </div>

              <div className="flex gap-2">
                {[500, 1000, 2000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRechargeAmount(preset.toString())}
                    className="flex-1 bg-white hover:bg-gray-100 border border-gray-200 py-2 rounded-xl text-xs font-semibold text-gray-650 cursor-pointer"
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition cursor-pointer disabled:bg-gray-300 shadow-sm shadow-green-600/10"
              >
                {loading ? "Processing..." : "Add Money"}
              </button>
            </form>
          </div>
        )}

        {user.role === "host" && (
          <div className="bg-gray-50 border border-gray-150 rounded-3xl p-6">
            <h4 className="font-bold text-gray-800 text-base mb-1">Earning Info</h4>
            <p className="text-gray-500 text-xs mb-4">Payouts are settled directly to your connected bank account.</p>
            <button
              onClick={() => alert("Payout mechanism triggered. Funds will arrive in 2-3 business days.")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition cursor-pointer shadow-sm shadow-green-600/10"
            >
              Withdraw Earnings
            </button>
          </div>
        )}
      </div>

      {/* History */}
      <div className="lg:col-span-2 flex flex-col">
        <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Recent Transactions</h3>
        {history.length === 0 ? (
          <div className="flex-grow border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🧾</span>
            <h4 className="font-bold text-gray-700 text-sm">No transaction records</h4>
            <p className="text-gray-400 text-xs mt-1">Confirmed and completed charging bookings will trigger transaction details here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 flex-grow">
            {history.map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between gap-4"
              >
                <div>
                  <h5 className="font-bold text-gray-800 text-sm">{tx.description}</h5>
                  <p className="text-xs text-gray-400 mt-1">
                    {tx.date} | {tx.time} • <span className="font-semibold">{tx.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-base ${
                      tx.type === "credit" ? "text-green-600" : "text-gray-700"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletView;
