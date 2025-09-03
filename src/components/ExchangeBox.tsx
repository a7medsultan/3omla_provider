import {
  ArrowRight,
  Calendar,
  Hash,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// Define the props for the component
interface CurrenciesProps {
  index: number;
  refNo: string;
  fromCurrency: string;
  toCurrency: string;
  baseAmount: number;
  targetAmount: number;
  exRate: number;
  exDate: string;
  exStatus: string;
  onPress?: () => void;
}

const ExchangeBox: React.FC<CurrenciesProps> = ({
  index,
  refNo,
  fromCurrency,
  toCurrency,
  baseAmount,
  targetAmount,
  exRate,
  exDate,
  exStatus,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  console.log("Formatting date:", exDate);

  // Format currency amounts for mobile (shorter format)
  const formatCurrency = (amount: number, currency: string) => {
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency} ${(amount / 1000).toFixed(1)}K`;
    }
    return `${currency} ${amount.toFixed(2)}`;
  };

  // Format exchange rate
  const formatRate = (rate: number) => {
    return rate.toFixed(4);
  };

  // Format date from datetime string ie 2025-09-03 01:35:23 for mobile
  const formatDate = (dateStr: string) => {
    console.log("Formatting date:", dateStr);
    // Parse the date string manually for YYYY-MM-DD HH:MM:SS format
    const [datePart, timePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-");

    // Create date object with proper values (month is 0-indexed)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get status color and dot
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return {
          color: "text-green-400",
          bg: "bg-green-400",
          text: "Complete",
        };
      case "pending":
      case "processing":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-400",
          text: "Pending",
        };
      case "cancelled":
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-400",
          text: "Cancelled",
        };
      default:
        return {
          color: "text-blue-400",
          bg: "bg-blue-400",
          text: status,
        };
    }
  };

  const statusStyle = getStatusStyle(exStatus);

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (onPress) {
      onPress();
    }
  };

  return (
    <div
      className={`
        bg-slate-800 rounded-xl mb-3 border border-slate-700/50
        active:bg-slate-700 active:scale-[0.98] transition-all duration-150 ease-out
        ${isPressed ? "bg-slate-700 scale-[0.98]" : ""}
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <Hash size={12} className="text-slate-500" />
          <span className="text-xs text-slate-400 font-mono">
            {refNo.replace("REF-", "")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusStyle.bg}`} />
          <span className={`text-xs font-medium ${statusStyle.color}`}>
            {statusStyle.text}
          </span>
          <MoreVertical size={14} className="text-slate-500 ml-1" />
        </div>
      </div>

      {/* Main Exchange Display */}
      <div className="px-4 pb-3">
        {/* From Currency */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold text-white">
              {formatCurrency(baseAmount, fromCurrency)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">You send</div>
          </div>

          {/* Exchange Arrow */}
          <div className="bg-amber-500 p-2 rounded-lg shadow-sm">
            <ArrowRight size={16} className="text-white" />
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {formatCurrency(targetAmount, toCurrency)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Recipient gets</div>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
          <div className="flex items-center space-x-1.5">
            <TrendingUp size={12} className="text-amber-500" />
            <span className="text-xs text-slate-300">
              1 {fromCurrency} = {formatRate(exRate)} {toCurrency}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Calendar size={12} className="text-slate-500" />
            <span className="text-xs text-slate-400">{formatDate(exDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeBox;
