import React, { useEffect, useState } from "react";
import axios from "axios";

// Components
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import CurrencyRow from "../components/CurrencyRow";
import CustomModal from "../components/CustomModal";

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

const UserCurrencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const userData = localStorage.getItem("userData");

  useEffect(() => {
    const provider_id = JSON.parse(userData??"{}").provider_id;
    const fetchCurrenciesAndRates = async () => {
      try {
        const { data: currencyData } = await axios.get<Currency[]>(
          `http://localhost:8080/api/v1/activeCurrencies/${provider_id}`
        );

        const baseCurr = currencyData.find((c) => c.base_currency) || null;
        setBaseCurrency(baseCurr);

        const targets = baseCurr
          ? currencyData.filter((c) => c.id !== baseCurr.id)
          : [];

        setCurrencies(targets);

        // inside fetchCurrenciesAndRates
        if (baseCurr) {
          setRates(
            targets.map((currency) => ({
              id: 0, // placeholder or remove from interface
              baseCurrency: baseCurr.code,
              targetCurrency: currency.code,
              buy_rate: currency.buy_rate ?? 0,
              sell_rate: currency.sell_rate ?? 0,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
      }
    };

    fetchCurrenciesAndRates();
  }, []);

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

  const submitRates = async () => {
    // remove rates that have no sell_rate
    const filteredRates = rates.filter((rate) => rate.sell_rate > 0);

    if (!filteredRates.length || !baseCurrency) return;

    const dataToSend = filteredRates.map((rate) => ({
      base_currency_code: rate.baseCurrency,
      target_currency_code: rate.targetCurrency,
      buy_rate: rate.buy_rate,
      sell_rate: rate.sell_rate,
      rate_date: today,
    }));

    console.log("Data to send:", dataToSend);
    const provider_id = JSON.parse(userData??"{}").provider_id;
    try {
      await axios.post(`http://localhost:8080/api/v1/setRates/${provider_id}`, dataToSend);
      console.log("Rates submitted successfully");
      // show success message on custom modal
      setModalMessage("Rates submitted successfully");
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting rates:", error);
      setModalMessage("Error submitting rates. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header title="Today's Exchange Rates" />

      <main className="flex-1 overflow-auto p-4">
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
                baseCurrency={baseCurrency || undefined}
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg"
          >
            Confirm Rates
          </button>
        </div>
      </main>

      <Navigation pageName="userCurrencies" />
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UserCurrencies;
