import axios from "axios";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";
import ExchangeBox from "../components/ExchangeBox";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import { t, setLang } from "../i18n";
import Loader from "../components/Loader";
// imporrt the api url from env
const API_URL = import.meta.env.VITE_API_URL;
type Lang = "ar" | "en";

// Mobile App Demo
const adminHistory = () => {
  const [language, setLanguage] = useState<Lang>();
  const [exchangeRequests, setExchangeRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
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

  const [selectedTab, setSelectedTab] = useState("recent");

  // populate data using axios
  useEffect(() => {
    fetchExchangeRequests();
  }, []);

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
      .get(`${API_URL}/recentRequests/1/0`)
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

  // -----------------------------
  // Swipe handlers (refresh)
  // -----------------------------

  const handlers = useSwipeable({
    onSwipedDown: () => {
      

      if (isAtTop) {
        console.log("Swiped down → refreshing exchange requests");
        setLoading(true);
        fetchExchangeRequests(true);
      }
    },
    delta: 50,
  });

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const scrollTop = target.scrollTop || 0;
    const newIsAtTop = scrollTop <= 10;
    
    setIsAtTop(newIsAtTop);
  };

  //------------------------------
  // end swipe handlers
  //------------------------------

  const handleCurrencyPress = (refNo: string) => {
    // In a real Capacitor app, you might navigate to a detail page
    console.log("Currency pressed:", refNo);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title="BeEx" />
      <main
        {...handlers}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-4"
      >
        {/* Tab Navigation */}
        <div className="flex py-3 justify-center">
          <div className="flex rounded-full overflow-hidden border border-gray-700 w-full max-w-md">
            {["recent", "pending", "completed"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 px-4 transition-colors duration-200 text-sm font-medium capitalize ${
                  selectedTab === tab
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedTab(tab)}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {t(tab as "recent" | "pending" | "completed")}
              </button>
            ))}
          </div>
        </div>

        {/* Currency List */}
        <div className="py-4">
          {exchangeRequests
            .filter((item) => {
              if (selectedTab === "pending") return item.status === "pending";
              if (selectedTab === "completed")
                return item.status === "completed";
              return true; // recent shows all
            })
            .map((data) => (
              <ExchangeBox
                index={data.id}
                refNo={data.reference_number}
                guest_name={data.guest_name}
                guest_email={data.guest_email}
                guest_phone={data.guest_phone}
                whatsapp={data.whatsapp}
                fromCurrency={data.base_currency}
                toCurrency={data.target_currency}
                baseAmount={data.base_amount}
                targetAmount={data.target_amount}
                exRate={data.exchange_rate}
                exDate={data.created_at}
                exStatus={data.status}
                key={data.id}
                {...data}
                onPress={() => handleCurrencyPress(data.reference_number)}
              />
            ))}

          {exchangeRequests.filter((item) => {
            if (selectedTab === "pending") return item.status === "pending";
            if (selectedTab === "completed") return item.status === "completed";
            return true;
          }).length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-500 text-sm">
                No {selectedTab} transactions
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Bottom navigation */}
      <Navigation pageName="adminHistory" />
      {loading ? <Loader /> : null}
    </div>
  );
};

export default adminHistory;
