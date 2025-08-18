import { useEffect, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import Header from "../components/Header";
import CurrencyAmount from "../components/CurrencyAmount";
import CurrencyPair from "../components/CurrencyPair";
import Navigation from "../components/Navigation";
import { t } from '../i18n';

export default function CurrencyExchangeApp() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState("1,000.00");
  const [toAmount, setToAmount] = useState("920.46");

  console.log("asd" + import.meta.env.VITE_API_URL);

  useEffect(() => {
    // Simulate an API call or a check against stored user data
  }, []);
  // Sample popular currency pairs
  const popularPairs = [
    { from: "USD", to: "EUR", rate: "0.92", change: "+0.3%" },
    { from: "EUR", to: "GBP", rate: "0.85", change: "-0.1%" },
    { from: "USD", to: "JPY", rate: "154.32", change: "+0.5%" },
    { from: "GBP", to: "USD", rate: "1.25", change: "+0.2%" },
  ];

  const swapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title="3omla" />

      {/* Content area */}
      <main className="flex-1 overflow-auto p-4">
        {/* Currency converter card */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6 shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-yellow-500">
            {t("currency_converter")}
          </h2>

          {/* From currency */}
          <CurrencyAmount
            label={t("from")}
            currency={fromCurrency}
            amount={fromAmount}
            onCurrencyChange={setFromCurrency}
            onAmountChange={setFromAmount}
          />

          {/* Swap button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={swapCurrencies}
              className="bg-yellow-500 p-3 rounded-full shadow-lg"
            >
              <ArrowDownUp size={18} className="text-gray-900" />
            </button>
          </div>

          {/* To currency */}
          <CurrencyAmount
            label={t("to")}
            currency={toCurrency}
            amount={toAmount}
            onCurrencyChange={setToCurrency}
            onAmountChange={setToAmount}
          />

          {/* Rate info */}
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-400">
              {t("rate")}: 1 {fromCurrency} ={" "}
              {fromCurrency === "USD" && toCurrency === "EUR"
                ? "0.9205"
                : "1.0867"}{" "}
              {toCurrency}
            </span>
            <span className="text-yellow-500">Updated just now</span>
          </div>

          {/* Exchange button */}
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg">
            {t("request_exchange")}
          </button>
        </div>

        {/* Popular currency pairs */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500">
              {t("popular_currency_pairs")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {popularPairs.map((pair, index) => (
              <CurrencyPair
                index={index}
                pairFrom={pair.from}
                pairTo={pair.to}
                pairRate={pair.rate}
                pairChange={pair.change}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="home" />
    </div>
  );
}
