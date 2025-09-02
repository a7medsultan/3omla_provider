import { useLocation, useNavigate } from "react-router-dom";
import { t, setLang } from "../i18n";
import InnerHeader from "../components/InnerHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import Loader from "../components/Loader";

type Lang = "ar" | "en";

interface ExchangeData {
  fromCurrency: string;
  fromFlag?: string;
  fromAmount: number;
  toCurrency: string;
  toFlag?: string;
  toAmount: number;
  rate: number;
}

export default function RequestExchange() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState<Lang>();
  const exData = location.state as ExchangeData;
  const navigate = useNavigate();

  useEffect(() => {
    if (language) {
      setLang(language);
    } else {
      let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
      setLanguage(currentLang);
      setLang(currentLang);
    }
  }, [language]); // ✅ add dependency array

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = ["guest_name", "guest_phone", "whatsapp"];
    let isValid = true;

    requiredFields.forEach((field) => {
      const element = document.getElementById(field) as HTMLInputElement | null;
      if (element) {
        if (!element.value.trim()) {
          element.classList.remove("border-gray-600");
          element.classList.add("border-red-500");
          isValid = false;
        } else {
          element.classList.remove("border-red-500");
          element.classList.add("border-gray-600");
        }
      }
    });

    if (isValid) {
      const fullName = document.getElementById(
        "guest_name"
      ) as HTMLInputElement;
      const email = document.getElementById("guest_email") as HTMLInputElement;
      const phone = document.getElementById("guest_phone") as HTMLInputElement;
      const whatsapp = document.getElementById("whatsapp") as HTMLInputElement;
      const idNumber = document.getElementById(
        "guest_identification"
      ) as HTMLInputElement;
      const paymentMethod = document.getElementById(
        "payment_method"
      ) as HTMLSelectElement;
      const baseCurrency = document.getElementById(
        "base_currency"
      ) as HTMLInputElement;
      const targetCurrency = document.getElementById(
        "target_currency"
      ) as HTMLInputElement;
      const baseAmount = document.getElementById(
        "base_amount"
      ) as HTMLInputElement;
      const targetAmount = document.getElementById(
        "target_amount"
      ) as HTMLInputElement;
      const exchangeRate = document.getElementById(
        "exchange_rate"
      ) as HTMLInputElement;

      const requestData = {
        guest_name: fullName.value,
        guest_email: email.value,
        guest_phone: phone.value,
        whatsapp: whatsapp.value,
        guest_identification: idNumber.value,
        payment_method: paymentMethod.value,
        base_currency: baseCurrency.value,
        target_currency: targetCurrency.value,
        base_amount: parseFloat(baseAmount.value),
        target_amount: parseFloat(targetAmount.value),
        exchange_rate: parseFloat(exchangeRate.value),
        provider_id: userData ? userData.provider_id : null,
      };

      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/requestExchange/${
            userData ? userData.provider_id : null
          }`,
          requestData
        );
        setModalMessage(t("exchange_request_success"));
        setShowModal(true);
        // reset form fields
        (document.getElementById("guest_name") as HTMLInputElement).value = "";
        (document.getElementById("guest_email") as HTMLInputElement).value = "";
        (document.getElementById("guest_phone") as HTMLInputElement).value = "";
        (document.getElementById("whatsapp") as HTMLInputElement).value = "";
        (
          document.getElementById("guest_identification") as HTMLInputElement
        ).value = "";
        (document.getElementById("payment_method") as HTMLSelectElement).value =
          "";

        // navigate back to home after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error submitting exchange request:", error);
        setModalMessage(t("exchange_request_error"));
        setShowModal(true);
      }
      setLoading(false);
    } else {
      setModalMessage(t("fill_required_fields"));
      setShowModal(true);
      setLoading(false); // ✅ make sure loader hides even if invalid
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <InnerHeader title="BeEx" />
      <main className="flex-1 overflow-auto p-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">
              {t("request_exchange")}
            </h3>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4">
          {/* Customer Information */}
          <div className="border-b border-gray-600 pb-8">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              {t("customer_information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("full_name")}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="guest_name"
                  name="guest_name"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder={t("enter_full_name")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("email_address")}
                </label>
                <input
                  type="email"
                  id="guest_email"
                  name="guest_email"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder={t("enter_email")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("phone_number")}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="guest_phone"
                  name="guest_phone"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder={t("enter_phone")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("whatsapp_number")}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder={t("enter_whatsapp")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("identification_number")}
                </label>
                <input
                  type="text"
                  id="guest_identification"
                  name="guest_identification"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder={t("enter_id")}
                />
                <p className="text-sm text-gray-400 mt-1">
                  {t("id_help_text")}
                </p>
              </div>
            </div>
          </div>

          {/* Exchange Information */}
          <div className="border-b border-gray-600 pb-8">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              {t("exchange_information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("from_currency")}
                </label>
                <input
                  type="text"
                  id="base_currency"
                  name="base_currency"
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 uppercase placeholder-gray-400"
                  placeholder="USD"
                  pattern="[A-Z]{3}"
                  value={exData?.fromCurrency || ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("to_currency")}
                </label>
                <input
                  type="text"
                  id="target_currency"
                  name="target_currency"
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 uppercase placeholder-gray-400"
                  placeholder="AED"
                  pattern="[A-Z]{3}"
                  value={exData?.toCurrency || ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("amount_to_exchange")}{" "}
                </label>
                <input
                  type="number"
                  id="base_amount"
                  name="base_amount"
                  step="0.01"
                  min="0"
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="0.00"
                  value={exData?.fromAmount || ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("exchange_rate")}
                </label>
                <input
                  type="number"
                  id="exchange_rate"
                  name="exchange_rate"
                  step="0.00000001"
                  min="0"
                  required
                  readOnly
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="0.00000000"
                  value={exData?.rate.toFixed(6) || ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("amount_to_receive")}{" "}
                </label>
                <input
                  type="number"
                  id="target_amount"
                  name="target_amount"
                  step="0.01"
                  min="0"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-600 text-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="0.00"
                  value={exData?.toAmount || ""}
                />
                <p className="text-sm text-gray-400 mt-1">
                  {t("calculated_automatically")}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="pb-8">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              {t("payment_information")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">
                  {t("payment_method")}
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">{t("select_payment_method")}</option>
                  <option value="cash">{t("cash")}</option>
                  <option value="bank_transfer">{t("bank_transfer")}</option>
                  <option value="credit_card">{t("credit_card")}</option>
                  <option value="mobile_wallet">{t("mobile_wallet")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-600">
            <button
              type="submit"
              onClick={submitHandler}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
            >
              {t("submit_exchange_request")}
            </button>
          </div>
        </div>
      </main>

      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      {loading && <Loader />}
    </div>
  );
}
