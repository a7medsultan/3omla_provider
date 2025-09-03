import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { t, setLang } from "../i18n";
type Lang = "ar" | "en";

export default function CurrencyExchangeApp() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Lang>();

  // set the language based on the current language
  useEffect(() => {
    if (language) {
      setLang(language);
    } else {
      // default is ar
      let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
      setLanguage(currentLang);
      setLang(currentLang);
    }
  });
  
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/signin");
    }
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
              {t("reports")}
            </h3>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="reports" />
    </div>
  );
}
