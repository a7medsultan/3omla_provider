import React from "react";

// Define a type for the currency prop
interface Currency {
  id: number;
  countryFlag: string;
  name: string;
  abbr: string;
  symbol: string;
  active: boolean;
  target: boolean;
}

interface Rate {
  id?: number;
  fromCurrency: number;
  toCurrency: number;
  rate: number;
  rate_date?: string;
}

// Define the props for the component
interface CurrenciesProps {
  currency: Currency;
  index: number;
  targetCurrency?: Currency;
  todayRate: Rate | null;
}

const CurrencyBox: React.FC<CurrenciesProps> = ({
  currency,
  index,
  targetCurrency,
  todayRate,
}) => {
  return (
    <div
      key={index}
      className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 flex items-center"
    >
      <div className="bg-gray-700 p-3 rounded-full mr-3">
        {currency.countryFlag}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{currency.name}</span>
          <span className="font-bold">{todayRate?.rate.toLocaleString() ?? "not set"}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-400">1 {currency.abbr}</span>
          <span className="text-sm text-yellow-500">{targetCurrency?.abbr}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyBox;
