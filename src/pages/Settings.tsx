import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { t, setLang } from "../i18n";

interface Currency {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
  decimal_places: number;
  symbol: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  base_currency: boolean;
  buy_rate?: number;
  sell_rate?: number;
}
type Lang = "ar" | "en";

export default function CurrencyExchangeApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<Lang>();
  const [activeTab, setActiveTab] = useState("currencies");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [providerCurrencies, setProviderCurrencies] = useState<Currency[]>([]);

  const userData = localStorage.getItem("userData");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const { data: currencyData } = await axios.get<Currency[]>(
          "http://localhost:8080/api/v1/listCurrencies"
        );
        setCurrencies(currencyData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies(); // ✅ Call the function
  }, []);

  useEffect(() => {
    const provider_id = JSON.parse(userData ?? "{}").provider_id;
    const fetchProviderCurrencies = async () => {
      try {
        const { data: providerData } = await axios.get<Currency[]>(
          `http://localhost:8080/api/v1/activeCurrencies/${provider_id}`
        );
        setProviderCurrencies(providerData);
      } catch (error) {
        console.error("Error fetching provider currencies:", error);
      }
    };

    fetchProviderCurrencies(); // ✅ Call the function
  }, []);

  const activateCurrency = async (code: string, isActive: boolean) => {
    //console.log(`Activating currency ${currencyId} to ${isActive}`);
    const providerCurrency = providerCurrencies.find(
      (curr) => curr.code === code
    );

    if (!providerCurrency) {
      console.error(
        `Currency with code ${code} not found in provider currencies.`
      );
      return;
    }
    const provider_id = JSON.parse(userData ?? "{}").provider_id;
    try {
      await axios.post(
        `http://localhost:8080/api/v1/activateCurrency/${provider_id}`,
        {
          currency_id: providerCurrency.id,
          is_active: isActive,
        }
      );
      setProviderCurrencies((prev) =>
        prev.map((curr) =>
          curr.code === code ? { ...curr, is_active: isActive } : curr
        )
      );
    } catch (error) {
      console.error("Error activating currency:", error);
    }
  };

  const switchLanguage = () => {
    const newLang: Lang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    setLang(newLang); // ✅ update i18n
  };

  // set the language based on the current language
  useEffect(() => {
    console.log(language);
    if (language) {
      setLang(language);
    } else {
      // default is ar
      let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
      setLanguage(currentLang);
      setLang(currentLang);
    }
  });

  console.log(language);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title={t("settings")} />

      {/* Content area */}
      <main className="flex-1 overflow-auto p-4">
        {/* Segmented buttons - full width */}
        <div className="mb-6 flex rounded-lg overflow-hidden border border-gray-700 w-full max-w-md">
          <button
            onClick={() => setActiveTab("currencies")}
            className={`flex-1 py-2 px-4 transition-colors duration-200 ${
              activeTab === "currencies"
                ? "bg-yellow-500 text-gray-900"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700"
            }`}
          >
            {t("active_currencies")}
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-2 px-4 transition-colors duration-200 ${
              activeTab === "admin"
                ? "bg-yellow-500 text-gray-900"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700"
            }`}
          >
            {t("admin_settings")}
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "currencies" && (
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg space-y-6">
            {currencies.map((currency) => {
              const isActive = providerCurrencies.some(
                (curr) => curr.code === currency.code && curr.is_active
              );

              return (
                <div
                  key={currency.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-200">
                    {currency.flag_emoji} {currency.code}
                  </span>
                  <Switch
                    checked={isActive}
                    onChange={() => {
                      // Toggle in providerCurrencies
                      setProviderCurrencies((prev) =>
                        prev.map((curr) =>
                          curr.id === currency.id
                            ? { ...curr, is_active: !curr.is_active }
                            : curr
                        )
                      );

                      // activate or deactivate the currency
                      activateCurrency(currency.code, !isActive);
                      // If the currency isn't in providerCurrencies, add it
                      if (!isActive) {
                        setProviderCurrencies((prev) => [
                          ...prev,
                          { ...currency, is_active: true },
                        ]);
                      }
                    }}
                    className={`${
                      isActive ? "bg-yellow-500" : "bg-gray-600"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        isActive
                          ? "translate-x-6 rtl:-translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "admin" && (
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-200">{t("english")}</span>
              <Switch
                checked={language === "en"} // ✅ boolean instead of string
                onChange={switchLanguage}
                className={`${
                  language === "en" ? "bg-yellow-500" : "bg-gray-600"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${
              language === "en"
                ? "translate-x-6 rtl:-translate-x-6"
                : "translate-x-1"
            }
          `}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-200">{t("dark_mode")}</span>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                className={`${
                  darkMode ? "bg-yellow-500" : "bg-gray-600"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    darkMode ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-200">{t("notifications")}</span>
              <Switch
                checked={notifications}
                onChange={setNotifications}
                className={`${
                  notifications ? "bg-yellow-500" : "bg-gray-600"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    notifications ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="settings" />
    </div>
  );
}