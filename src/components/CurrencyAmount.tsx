interface HeaderProps {
  label: string;
  currency: string;
  amount: string;
  onCurrencyChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

const CurrencyAmount: React.FC<HeaderProps> = ({
  label,
  currency,
  amount,
  onCurrencyChange,
  onAmountChange,
}) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-3">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-transparent text-yellow-500 font-medium text-sm outline-none cursor-pointer"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>
      <input
        type="text"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        className="w-full bg-transparent text-xl font-bold outline-none"
      />
    </div>
  );
};

export default CurrencyAmount;
