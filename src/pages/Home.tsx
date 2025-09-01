import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  Compass,
  ArrowRightLeft,
  HandCoins,
  BarChart2,
} from "lucide-react";
import Navigation from "../components/Navigation";

import { t, setLang } from "../i18n";
import Header from "../components/Header";
type Lang = "ar" | "en";
// --- CurrencyAmount component ---
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

interface CurrencyAmountProps {
  label: string;
  selectedCurrency: Currency;
  activeCurrencies: Currency[];
  amount: string;
  onCurrencyChange: (currency: Currency) => void;
  onAmountChange: (value: string) => void;
}

const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  label,
  selectedCurrency,
  activeCurrencies,
  amount,
  onCurrencyChange,
  onAmountChange,
}) => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const currency = activeCurrencies.find((cur) => cur.code === selectedCode);
    if (currency) {
      onCurrencyChange(currency);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-3">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <select
          value={selectedCurrency.code}
          onChange={handleCurrencyChange}
          className="bg-transparent text-yellow-500 font-medium text-sm outline-none cursor-pointer"
        >
          {activeCurrencies.length > 0 ? (
            activeCurrencies.map((cur) => (
              <option key={cur.id} value={cur.code}>
                {cur.flag_emoji} {cur.code}
              </option>
            ))
          ) : (
            <option disabled>{t("no_currencies_available")}</option>
          )}
        </select>
      </div>
      <input
        type="text"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="w-full bg-transparent text-xl font-bold outline-none"
      />
      <div className="text-sm text-gray-400 mt-2">
        {t("decimal_places")}: {selectedCurrency.decimal_places}
      </div>
    </div>
  );
};

// --- CurrencyPair component ---
interface CurrencyPairProps {
  pairFrom: string;
  pairTo: string;
  pairRate: string;
  pairChange: string;
}

const CurrencyPair: React.FC<CurrencyPairProps> = ({
  pairFrom,
  pairTo,
  pairRate,
  pairChange,
}) => {
  const changeColor = pairChange.startsWith("+")
    ? "text-green-400"
    : "text-red-400";
  return (
    <div className="bg-gray-700 p-4 rounded-xl shadow-md border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold">
          {pairFrom}/{pairTo}
        </span>
        <span className="text-lg font-semibold">{pairRate}</span>
      </div>
      <span className={`text-sm ${changeColor}`}>{pairChange}</span>
    </div>
  );
};

// --- Main App Component ---
export default function CurrencyExchangeApp() {
  const [fromCurrency, setFromCurrency] = useState<Currency | undefined>();
  const [toCurrency, setToCurrency] = useState<Currency | undefined>();
  const [fromAmount, setFromAmount] = useState<string>("1");
  const [toAmount, setToAmount] = useState<string | undefined>();
  const [activeCurrencies, setActiveCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Currency | undefined>();
  const [activeTab, setActiveTab] = useState("latest");
  const [language, setLanguage] = useState<Lang>();
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/signin");
    }

    // Fetches currency data from local storage, with fallback to hardcoded data
    const cachedData = localStorage.getItem("currenciesData");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const currencies: Currency[] = parsedData.currencies;
      const base: Currency = parsedData.baseCurrency;

      setActiveCurrencies(currencies);
      setBaseCurrency(base);
    }
  }, []);

  useEffect(() => {
    // Set default currencies after data is loaded
    if (
      activeCurrencies.length > 0 &&
      !fromCurrency &&
      !toCurrency &&
      baseCurrency
    ) {
      setFromCurrency(activeCurrencies[0]);
      setToCurrency(baseCurrency);
    }
  }, [activeCurrencies, baseCurrency]);

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

  /**
   * Calculates the conversion rate based on whether the base currency is
   * the 'from' or 'to' currency. The rates are relative to the base.
   * 1 of any active currency = X of base currency.
   * @param from The currency to convert from.
   * @param to The currency to convert to.
   * @returns The calculated exchange rate.
   */
  const calculateRate = (
    from: Currency | undefined,
    to: Currency | undefined
  ) => {
    if (!from || !to) {
      return 0;
    }
    if (from.code === to.code) {
      return 1;
    }

    // Case 1: Converting FROM an active currency TO the base currency
    // The rate is the active currency's sell rate (since we are "selling" it)
    if (to.base_currency) {
      return from.sell_rate || 0;
    }

    // Case 2: Converting FROM the base currency TO an active currency
    // The rate is based on the active currency's buy rate (since we are "buying" it)
    if (from.base_currency) {
      return 1 / (to.buy_rate || 1);
    }

    return 0;
  };

  /**
   * Main effect hook to perform currency conversion.
   * It triggers whenever any of the relevant states change.
   */
  useEffect(() => {
    if (fromAmount && fromCurrency && toCurrency) {
      const rate = calculateRate(fromCurrency, toCurrency);
      const convertedValue = parseFloat(fromAmount) * rate;
      const fixedValue = convertedValue.toFixed(toCurrency.decimal_places);
      setToAmount(fixedValue);
    }
  }, [fromAmount, fromCurrency, toCurrency]);
  const requestExchange = () => {
    console.log(
      `from ${fromCurrency?.code} ${fromAmount} to ${toCurrency?.code} ${toAmount}`
    );
    const myState = {
      fromCurrency: fromCurrency?.code,
      fromAmount: fromAmount,
      toCurrency: toCurrency?.code,
      toAmount: toAmount,
    };

    // Use the navigate function to go to a new route and pass the state
    navigate("/requestExchange", { state: myState });
  };
  /**
   * Swaps the 'from' and 'to' currencies. The base currency is always
   * kept as one side of the exchange.
   */
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount || "");
    setToAmount(fromAmount || "");
  };

  // Dynamically set the available currencies for the selectors
  const fromCurrencyList = fromCurrency?.base_currency
    ? [fromCurrency]
    : activeCurrencies;
  const toCurrencyList = toCurrency?.base_currency
    ? [toCurrency]
    : activeCurrencies;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header title="BeEx" />

      <main className="flex-1 overflow-auto p-4">
        {activeCurrencies.length === 0 || !baseCurrency ? (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            <p className="text-center">{t("please_set_active_currencies")}</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-5 mb-6 shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-yellow-500">
              {t("currency_converter")}
            </h2>

            <CurrencyAmount
              label={t("from")}
              selectedCurrency={fromCurrency || fromCurrencyList[0]}
              activeCurrencies={fromCurrencyList}
              amount={fromAmount || ""}
              onCurrencyChange={setFromCurrency}
              onAmountChange={(value) => {
                setFromAmount(value);
              }}
            />

            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={swapCurrencies}
                className="bg-yellow-500 p-3 rounded-full shadow-lg"
              >
                <ArrowDownUp size={18} className="text-gray-900" />
              </button>
            </div>

            <CurrencyAmount
              label={t("to")}
              selectedCurrency={toCurrency || toCurrencyList[0]}
              activeCurrencies={toCurrencyList}
              amount={toAmount || ""}
              onCurrencyChange={setToCurrency}
              onAmountChange={() => {}}
            />

            <div className="flex justify-between text-sm mb-4">
              <span className="small-text text-gray-400">
                {t("rate")}: 1 {fromCurrency?.code} ={" "}
                {calculateRate(fromCurrency, toCurrency).toFixed(4)}{" "}
                {toCurrency?.code}
              </span>
              <span className="small-text text-yellow-500">
                {t("updated_just_now")}
              </span>
            </div>

            <button
              onClick={requestExchange}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-full"
            >
              {t("request_exchange")}
            </button>
          </div>
        )}

        <div className="mb-6">
          {/* Segmented buttons - full width */}
          <div className="mb-6 flex rounded-full overflow-hidden border border-gray-700 w-full max-w-md">
            <button
              onClick={() => setActiveTab("latest")}
              className={`flex-1 py-2 px-4 transition-colors duration-200 ${
                activeTab === "latest"
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-800 text-gray-100 hover:bg-gray-700"
              }`}
            >
              {t("latest_requests")}
            </button>
            <button
              onClick={() => setActiveTab("biggest")}
              className={`flex-1 py-2 px-4 transition-colors duration-200 ${
                activeTab === "biggest"
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-800 text-gray-100 hover:bg-gray-700"
              }`}
            >
              {t("biggest_requests")}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "latest" && (
            <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg space-y-6">
              soon .. latest requests
            </div>
          )}

          {activeTab === "biggest" && (
            <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg space-y-6">
              soon .. biggest requests
            </div>
          )}
        </div>
      </main>

      <Navigation pageName="home" />
    </div>
  );
}
