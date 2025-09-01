import React, { useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { t } from '../i18n';
export default function CurrencyExchangeApp() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate an API call or a check against stored user data
    const checkAdminStatus = () => {
      // Replace this with your actual admin check logic
      const userRole = localStorage.getItem("userRole"); // Example
      if (userRole !== "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    // You might also need to set up listeners for events that could change the admin status
    // (e.g., a WebSocket message, a change in authentication context).
    // For example:
    // const unsubscribe = authService.onRoleChange((newRole) => {
    //   setIsAdmin(newRole === 'admin');
    // });
    // return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Sample recent transactions
  const recentTransactions = [
    { id: 1, from: "USD", to: "EUR", amount: "1,500.00", date: "Today" },
    { id: 2, from: "GBP", to: "USD", amount: "650.00", date: "Yesterday" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title="BeEx" />

      {/* Content area */}
      <main className="flex-1 overflow-auto p-4">
        {/* Recent transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500">
              {t("recent_transactions")}
            </h3>
            <button className="text-yellow-500 text-sm">{t("view_all")}</button>
          </div>

          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 flex items-center"
            >
              <div className="bg-gray-700 p-3 rounded-full mr-3">
                <Repeat size={18} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {transaction.from} → {transaction.to}
                  </span>
                  <span className="font-bold">{transaction.amount}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-400">
                    {transaction.date}
                  </span>
                  <span className="text-sm text-yellow-500">{t("completed")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="adminHistory" />
    </div>
  );
}
