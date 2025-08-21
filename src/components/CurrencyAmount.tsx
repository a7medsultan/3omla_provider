import React from "react";
import { t } from "../i18n";

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
  id: string;
  selectedCurrency: Currency;
  activeCurrencies: Currency[];
  amount: string;
  onCurrencyChange: (currency: Currency) => void;
  onAmountChange: (value: string) => void;
}

const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  label,
  id,
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
        itemID={`id-${id}`}
        value={amount}
        readOnly={id === "to-currency"}
        onChange={(e) => onAmountChange(e.target.value)}
        className="w-full bg-transparent text-xl font-bold outline-none"
      />
    </div>
  );
};

export default CurrencyAmount;