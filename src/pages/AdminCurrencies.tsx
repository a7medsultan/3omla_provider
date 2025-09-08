import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSwipeable } from "react-swipeable";
// Components
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import CurrencyRow from "../components/CurrencyRow";
import CustomModal from "../components/CustomModal";
import Loader from "../components/Loader";
import { t, setLang } from "../i18n";
// imporrt the api url from env
const API_URL = import.meta.env.VITE_API_URL;
type Lang = "ar" | "en";
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

interface Rate {
  id: number;
  baseCurrency: string;
  targetCurrency: string;
  buy_rate: number;
  sell_rate: number;
}

const AdminCurrencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const userData = localStorage.getItem("userData");
  const provider_id = JSON.parse(userData ?? "{}").provider_id;
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
  // -----------------------------
  // Fetch and Save to localStorage
  // -----------------------------
  const fetchCurrenciesAndRates = async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        // ✅ Try from localStorage first
        const cached = localStorage.getItem("currenciesData");
        if (cached) {
          const parsed = JSON.parse(cached);
          setBaseCurrency(parsed.baseCurrency);
          setCurrencies(parsed.currencies);
          setRates(parsed.rates);
          return; // ✅ Use cache, skip API
        }
      }

      // ✅ If no cache or forceRefresh → fetch from API
      const { data: currencyData } = await axios.get<Currency[]>(
        `${API_URL}/activeCurrencies/${provider_id}`
      );

      const baseCurr = currencyData.find((c) => c.base_currency) || null;
      setBaseCurrency(baseCurr);

      const targets = baseCurr
        ? currencyData.filter((c) => c.id !== baseCurr.id)
        : [];

      setCurrencies(targets);

      let newRates: Rate[] = [];
      if (baseCurr) {
        newRates = targets.map((currency) => ({
          id: 0,
          baseCurrency: baseCurr.code,
          targetCurrency: currency.code,
          buy_rate: currency.buy_rate ?? 0,
          sell_rate: currency.sell_rate ?? 0,
        }));
        setRates(newRates);
      }

      // ✅ Save to localStorage
      localStorage.setItem(
        "currenciesData",
        JSON.stringify({
          baseCurrency: baseCurr,
          currencies: targets,
          rates: newRates,
        })
      );
    } catch (err) {
      console.error("Error fetching currencies:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // First load (use cache if exists)
  // -----------------------------
  useEffect(() => {
    fetchCurrenciesAndRates();
  }, []);

  // -----------------------------
  // Handle Rate Change
  // -----------------------------
  const handleRateChange = (
    updatedRate: Partial<Rate> & { targetCurrency: string }
  ) => {
    setRates((prev) =>
      prev.map((r) =>
        r.targetCurrency === updatedRate.targetCurrency
          ? { ...r, ...updatedRate }
          : r
      )
    );
  };

  // -----------------------------
  // Submit rates
  // -----------------------------
  const submitRates = async () => {
    setLoading(true);
    const filteredRates = rates.filter((rate) => rate.sell_rate > 0);

    if (!filteredRates.length || !baseCurrency) return;

    const dataToSend = filteredRates.map((rate) => ({
      base_currency_code: rate.baseCurrency,
      target_currency_code: rate.targetCurrency,
      buy_rate: rate.buy_rate,
      sell_rate: rate.sell_rate,
      rate_date: today,
    }));

    try {
      await axios.post(`${API_URL}/setRates/${provider_id}`, dataToSend);
      setModalMessage(t("rates_submitted_successfully"));
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting rates:", error);
      setModalMessage(t("error_submitting_rates"));
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Swipe handlers (refresh)
  // -----------------------------

  const handlers = useSwipeable({
    onSwipedDown: () => {
      

      if (isAtTop) {
        console.log("Swiped down → refreshing currencies");
        setLoading(true);
        fetchCurrenciesAndRates(true);
      }
    },
    delta: 50,
  });

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const scrollTop = target.scrollTop || 0;
    const newIsAtTop = scrollTop <= 10;
    
    setIsAtTop(newIsAtTop);
  };

  //------------------------------
  // end swipe handlers
  //------------------------------

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header title={t("today_exchange_rates")} />

      <main
        {...handlers}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-4"
      >
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500"></h3>
            <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          {currencies.map((currency) =>
            currency.is_active ? (
              <CurrencyRow
                key={currency.id}
                currency={currency}
                baseCurrency={baseCurrency?.code || null}
                todayRate={currency.sell_rate || null}
                rate={
                  rates.find((rate) => rate.targetCurrency === currency.code) ||
                  null
                }
                onRateChange={handleRateChange}
              />
            ) : null
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={submitRates}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-full"
          >
            {t("confirm_rates")}
          </button>
        </div>
      </main>

      <Navigation pageName="adminCurrencies" />
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      {loading ? <Loader /> : null}
    </div>
  );
};

export default AdminCurrencies;
