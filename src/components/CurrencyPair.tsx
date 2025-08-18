
interface HeaderProps {
  index: number;
  pairFrom: string;
  pairTo: string;
  pairRate: string;
  pairChange: string;
}

const CurrencyPair: React.FC<HeaderProps> = ({
  index,
  pairFrom,
  pairTo,
  pairRate,
  pairChange,
}) => {
  return (
    <div
      key={index}
      className="bg-gray-800 rounded-lg p-3 border border-gray-700"
    >
      <div className="flex justify-between mb-1">
        <span className="font-medium">
          {pairFrom}/{pairTo}
        </span>
        <span
          className={
            pairChange.startsWith("+") ? "text-green-500" : "text-red-500"
          }
        >
          {pairChange}
        </span>
      </div>
      <div className="text-lg font-bold text-yellow-500">{pairRate}</div>
    </div>
  );
};

export default CurrencyPair;
