
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { t } from '../i18n';

export default function CurrencyExchangeApp() {

  useEffect(() => {
    // Simulate an API call or a check against stored user data
    

    // You might also need to set up listeners for events that could change the admin status
    // (e.g., a WebSocket message, a change in authentication context).
    // For example:
    // const unsubscribe = authService.onRoleChange((newRole) => {
    //   setIsAdmin(newRole === 'admin');
    // });
    // return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

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
              {t("admin_profile")}
            </h3>
          </div>

          
        </div>
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="AdminProfile" />
    </div>
  );
}
