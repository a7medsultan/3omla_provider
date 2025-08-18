import React, { useState } from "react";

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
  targetCurrency: Currency;
  todayRate: Rate | null;
}

// Update handleChange to accept currency and targetCurrency as well
async function handleChange(
  newRate: number,
  currency: Currency,
  targetCurrency: Currency,
  todayRate: Rate | null
) {
  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  // Check if the rate for today and the currency pair exists
  

  // Insert into Supabase if no existing rate
  
}

const Currencies: React.FC<CurrenciesProps> = ({
  currency,
  index,
  targetCurrency,
  todayRate,
}) => {
  const [rate, setRate] = useState<number | undefined>(todayRate?.rate);

  return (
    <tr key={index}>
      <td>{`${currency.countryFlag} ${currency.abbr}`}</td>
      <td>{currency.name}</td>
      <td>
        <input
          onChange={(event) => {
            const newRate = parseFloat(event.target.value);
            setRate(newRate); // Update rate in state
          }}
          onBlur={() => {
            if (rate !== undefined) {
              handleChange(rate, currency, targetCurrency, todayRate); // Handle the rate change on blur
            }
          }}
          placeholder="ex 3.67"
          value={rate !== undefined ? rate : ""} // Prevent undefined value issues
        />
      </td>
    </tr>
  );
};

export default Currencies;
