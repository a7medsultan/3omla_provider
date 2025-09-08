import { Repeat, User, ArrowRightLeft, Coins, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { t } from '../i18n';

interface NavProps {
  pageName: string;
}

const Navigation: React.FC<NavProps> = ({ pageName }) => {
  return (
    <nav className="bg-gray-800 border-t border-gray-700 flex justify-around p-2">
      <button
        className={`p-2 rounded-lg flex flex-col items-center ${
          pageName === "home" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <Link to="/">
          <ArrowRightLeft size={20} />
        </Link>
        <Link to="/">
          <span className="text-xs mt-1">{t("exchange")}</span>
        </Link>
      </button>
      <button
        className={`p-2 rounded-lg flex flex-col items-center ${
          pageName === "adminCurrencies" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <Link to="/adminCurrencies">
          <Coins size={20} />
        </Link>
        <Link to="/adminCurrencies">
          <span className="text-xs mt-1">{t("exchange_rates")}</span>
        </Link>
      </button>
      <button
        className={`p-2 rounded-lg flex flex-col items-center ${
          pageName === "adminHistory" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <Link to="/adminHistory">
          <Repeat size={20} />
        </Link>
        <Link to="/adminHistory">
          <span className="text-xs mt-1">{t("history")}</span>
        </Link>
      </button>
      <button
        className={`p-2 rounded-lg flex flex-col items-center ${
          pageName === "reports" ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <Link to="/reports">
          <BarChart2 size={20} />
        </Link>
        <Link to="/reports">
          <span className="text-xs mt-1">{t("reports")}</span>
        </Link>
      </button>
    </nav>
  );
};

export default Navigation;
