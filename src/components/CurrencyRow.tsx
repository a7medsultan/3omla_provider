import React, { useState, useEffect } from "react";

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

interface CurrenciesProps {
  currency: Currency;
  baseCurrency?: Currency;
  todayRate: number | null;
  rate: Rate | null;
  onRateChange: (
    updatedRate: Partial<Rate> & { targetCurrency: string }
  ) => void;
}

const CurrencyRow: React.FC<CurrenciesProps> = ({
  currency,
  rate,
  onRateChange,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 flex items-center">
      <div className="bg-gray-700 p-3 rounded-full mr-3">
        {currency.flag_emoji}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{currency.name}</span>
          <span className="font-bold">
            Sell{" "}
            <input
              type="number"
              value={rate?.sell_rate ?? ""}
              className="w-16 bg-gray-700 border border-gray-600 rounded-md p-1 text-sm"
              onChange={(e) =>
                onRateChange({
                  targetCurrency: currency.code,
                  sell_rate: parseFloat(e.target.value) || 0,
                })
              }
            />{" "}
            SDG
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-400">1 {currency.code}</span>
          <span className="font-bold">
            Buy{" "}
            <input
              type="number"
              value={rate?.buy_rate ?? ""}
              className="w-16 bg-gray-700 border border-gray-600 rounded-md p-1 text-sm"
              onChange={(e) =>
                onRateChange({
                  targetCurrency: currency.code,
                  buy_rate: parseFloat(e.target.value) || 0,
                })
              }
            />{" "}
            SDG
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRow;
