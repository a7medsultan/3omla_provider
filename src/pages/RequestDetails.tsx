import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InnerHeader from "../components/InnerHeader";
import Navigation from "../components/Navigation";
import { t, setLang } from "../i18n";
import {
  Hash,
  Calendar,
  DollarSign,
  ArrowRightLeft,
  User,
  Mail,
  Phone,
  MessageCircle,
  CreditCard,
  FileText,
  Percent,
} from "lucide-react";

type Lang = "ar" | "en";

interface RequestData {
  index: number;
  refNo: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  whatsapp: string;
  guest_identification: string;
  fromCurrency: string;
  toCurrency: string;
  baseAmount: number;
  targetAmount: number;
  exRate: number;
  exDate: string;
  exStatus: string;
  service_fee: number;
  payment_method: string;
}

const RequestDetails = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Lang>();
  const location = useLocation();
  const requestData = location.state as RequestData;

  // Set language
  useEffect(() => {
    if (language) {
      setLang(language);
    } else {
      let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
      setLanguage(currentLang);
      setLang(currentLang);
    }
  }, [language]);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/signin");
    }
  }, []);

  // Status styling
  const getStatusStyle = (exStatus: string) => {
    switch (exStatus.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <InnerHeader title="BeEx" />
      <main className="flex-1 overflow-auto p-4 space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {t("request_details")}
          </h1>
          <div className="flex items-center text-blue-200">
            <Hash className="w-4 h-4 mr-2" />
            <span className="text-sm font-mono">
              {requestData.refNo.replace("REF-", "")}
            </span>
          </div>
        </div>

        {/* Status */}
        <div
          className={`px-4 py-2 rounded-full border font-semibold text-sm uppercase tracking-wide inline-block ${getStatusStyle(
            requestData.exStatus
          )}`}
        >
          {t(requestData.exStatus as "pending" | "completed" | "cancelled" | "rejected" | "success")}
        </div>

        {/* Guest Information */}
        <div className="bg-gray-800 rounded-2xl shadow-md p-5 space-y-3">
          <h3 className="text-lg font-semibold text-yellow-500 mb-2">
            {t("customer_information")}
          </h3>
          <div className="flex items-center text-gray-300">
            <User className="w-4 h-4 m-2 text-yellow-400" />
            <span>{requestData.guest_name}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 m-2 text-yellow-400" />
            <span>{requestData.guest_email}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 m-2 text-yellow-400" />
            <span dir="ltr">{requestData.guest_phone}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MessageCircle className="w-4 h-4 m-2 text-green-400" />
            <span dir="ltr">{requestData.whatsapp}</span>
          </div>
          {requestData.guest_identification && (
            <div className="flex items-center text-gray-300">
              <FileText className="w-4 h-4 m-2 text-yellow-400" />
              <span>{requestData.guest_identification}</span>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-800 rounded-2xl shadow-md p-5 space-y-5">
          <h3 className="text-lg font-semibold text-yellow-500 mb-2">
            {t("transaction_details")}
          </h3>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">{t("from_currency")}</p>
              <p className="text-lg font-semibold">
                {requestData.baseAmount.toLocaleString()}{" "}
                <span className="text-yellow-500">
                  {requestData.fromCurrency}
                </span>
              </p>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-yellow-400" />
            <div className="text-right">
              <p className="text-sm text-gray-400">{t("to_currency")}</p>
              <p className="text-lg font-semibold">
                {requestData.targetAmount.toLocaleString()}{" "}
                <span className="text-green-400">{requestData.toCurrency}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-700 pt-3">
            <div className="flex items-center text-gray-300">
              <DollarSign className="w-4 h-4 m-2" />
              <span>{t("exchange_rate")}</span>
            </div>
            <span className="font-mono text-yellow-400">
              {requestData.exRate}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-300">
              <Percent className="w-4 h-4 m-2" />
              <span>{t("service_fee")}</span>
            </div>
            <span className="font-mono text-gray-200">
              {requestData.service_fee}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-300">
              <CreditCard className="w-4 h-4 m-2" />
              <span>{t("payment_method")}</span>
            </div>
            <span className="capitalize">{requestData.payment_method}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 m-2" />
              <span>{t("date")}</span>
            </div>
            <span className="font-mono text-gray-200">
              {new Date(requestData.exDate).toLocaleString()}
            </span>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <Navigation pageName="requestDetails" />
    </div>
  );
};

export default RequestDetails;
