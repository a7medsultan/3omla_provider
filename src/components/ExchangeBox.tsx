import {
  ArrowRight,
  Calendar,
  Hash,
  MoreVertical,
  TrendingUp,
  Eye,
  Copy,
  Download,
  Share,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { t, setLang } from "../i18n";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

type Lang = "ar" | "en";

// Define the props for the component
interface CurrenciesProps {
  index: number;
  refNo: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  whatsapp: string;
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
  guest_name,
  guest_email,
  guest_phone,
  whatsapp,
  fromCurrency,
  toCurrency,
  baseAmount,
  targetAmount,
  exRate,
  exDate,
  exStatus: exStatusProp,
  onPress,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [language, setLanguage] = useState<Lang>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [exchangeRequests, setExchangeRequests] = useState<any[]>([]);
  const [exStatus, setExStatus] = useState(exStatusProp);
  const navigate = useNavigate();
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  }, [language]);

  // Menu items based on exchange status and common actions
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: Eye,
        label: t("viewDetails") || "View Details",
        action: () => {
          // Add your view details logic here
          const myState = {
            index: index,
            refNo: refNo,
            guest_name: guest_name,
            guest_email: guest_email,
            guest_phone: guest_phone,
            whatsapp: whatsapp,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            baseAmount: baseAmount,
            targetAmount: targetAmount,
            exRate: exRate,
            exDate: exDate,
            exStatus: exStatus,
          };
          navigate("/requestDetails", { state: myState });
        },
        success: false,
        danger: false,
      },
      {
        icon: Copy,
        label: t("copyReference") || "Copy Reference",
        action: () => {
          navigator.clipboard.writeText(refNo);
          console.log("Reference copied:", refNo);
          // You could show a toast notification here
        },
        success: false,
        danger: false,
      },
      {
        icon: Download,
        label: t("downloadReceipt") || "Download Receipt",
        action: () => {
          console.log("Download receipt for", refNo);
          // Add your download logic here
        },
        success: false,
        danger: false,
      },
      {
        icon: Share,
        label: t("shareTransaction") || "Share",
        action: () => {
          console.log("Share transaction", refNo);
          // Add your share logic here
        },
        success: false,
        danger: false,
      },
    ];

    // Add status-specific items
    if (
      exStatus.toLowerCase() === "pending" ||
      exStatus.toLowerCase() === "processing"
    ) {
      baseItems.push({
        icon: CheckCheck,
        label: t("mark_completed") || "Mark Completed",
        action: () => {
          console.log("Mark completed transaction", refNo);
          // Add mark completed logic here
          updateStatus("completed");
        },
        success: true,
        danger: false,
      });

      baseItems.push({
        icon: Trash2,
        label: t("cancelTransaction") || "Cancel",
        action: () => {
          console.log("Cancel transaction", refNo);
          // Add cancel logic here
          updateStatus("cancelled");
        },
        success: false,
        danger: true,
      });
    }

    if (
      exStatus.toLowerCase() === "cancelled" ||
      exStatus.toLowerCase() === "rejected"
    ) {
      baseItems.push({
        icon: AlertCircle,
        label: t("reportIssue") || "Report Issue",
        action: () => {
          console.log("Report issue for", refNo);
          // Add report issue logic here
        },
        success: false,
        danger: true,
      });
    }

    return baseItems;
  };

  const updateStatus = (newStatus: string) => {
    setLoading(true);
    // Example API call to update status
    axios
      .post(`http://localhost:8080/api/v1/updateRequestStatus`, {
        reference_number: refNo,
        status: newStatus,
      })
      .then((response) => {
        // Optionally refresh data or give user feedback
        fetchExchangeRequests(true); // Force refresh
        // update the state of exStatus if needed
        setExStatus(newStatus);
      })
      .catch((error) => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchExchangeRequests = (forceRefresh = false) => {
    setLoading(true);

    if (!forceRefresh) {
      const cached = localStorage.getItem("exchangeRequests");
      if (cached) {
        setExchangeRequests(JSON.parse(cached));
        setLoading(false); // ✅ stop loader if cache is used
        return;
      }
    }

    axios
      .get(`http://localhost:8080/api/v1/recentRequests/1/0`)
      .then((response) => {
        setExchangeRequests(response.data);
        localStorage.setItem("exchangeRequests", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // ✅ stop loader after API call finishes
      });
  };

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
    return rate.toFixed(6);
  };

  // Format date from datetime string ie 2025-09-03 01:35:23 for mobile
  const formatDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-");

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

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
          text: t("completed"),
        };
      case "pending":
      case "processing":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-400",
          text: t(status as "pending" | "processing"),
        };
      case "cancelled":
      case "rejected":
        return {
          color: "text-red-400",
          bg: "bg-red-400",
          text: t(status as "cancelled" | "rejected"),
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onPress
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
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

          {/* More Vertical Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="p-1 rounded-full hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-slate-500 ml-1"
              aria-label="More options"
            >
              <MoreVertical size={14} className="text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                className={`absolute ${
                  language === "ar" ? "left-0" : "right-0"
                } mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50`}
              >
                <div className="py-1">
                  {getMenuItems().map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMenuItemClick(item.action)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-slate-700 transition-colors duration-150 ${
                          item.danger
                            ? "text-red-400 hover:bg-red-900/20"
                            : item.success
                            ? "text-green-400 hover:bg-green-900/20"
                            : "text-slate-300"
                        } ${
                          language === "ar"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
            <div className="text-xs text-slate-400 mt-0.5">{t("from")}</div>
          </div>

          {/* Exchange Arrow */}
          <div className="bg-amber-500 p-2 rounded-lg shadow-sm">
            {language === "ar" ? (
              <ArrowRight
                size={16}
                className="text-white transform rotate-180"
              />
            ) : (
              <ArrowRight size={16} className="text-white" />
            )}
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {formatCurrency(targetAmount, toCurrency)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{t("to")}</div>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
          <div className="flex items-center space-x-1.5">
            <TrendingUp size={12} className="text-amber-500" />
            <span className="text-xs text-slate-300">
              1{fromCurrency}={formatRate(exRate)}
              {toCurrency}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Calendar size={12} className="text-slate-500" />
            <span className="text-xs text-slate-400">{formatDate(exDate)}</span>
          </div>
        </div>
      </div>
      {loading ? <Loader /> : null}
    </div>
    
  );
};

export default ExchangeBox;
