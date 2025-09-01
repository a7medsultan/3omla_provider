import { useLocation } from "react-router-dom";
import { t, setLang } from "../i18n";
import InnerHeader from "../components/InnerHeader";
import { useEffect, useState } from "react";

type Lang = "ar" | "en";
// Define the same interface for type consistency
interface ExchangeData {
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
}

export default function RequestExchange() {
  const location = useLocation();
  const [language, setLanguage] = useState<Lang>();
  // Type-safe way to access the state
  const exData = location.state as ExchangeData;

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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <InnerHeader title="BeEx" />

      {/* Content area */}
      <main className="flex-1 overflow-auto p-4">
        {/* Recent transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500">
              {t("request_exchange")}
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
}
