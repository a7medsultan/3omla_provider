import { useLocation } from "react-router-dom";
import { t, setLang } from "../i18n";
import InnerHeader from "../components/InnerHeader";
import { useEffect, useState } from "react";

type Lang = "ar" | "en";

interface ExchangeData {
  fromCurrency: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
}

export default function RequestExchange() {
  const location = useLocation();
  const [language, setLanguage] = useState<Lang>();
  const exData = location.state as ExchangeData;

  useEffect(() => {
    if (language) {
      setLang(language);
    } else {
      let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
      setLanguage(currentLang);
      setLang(currentLang);
    }
  });

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <InnerHeader title="BeEx" />

      <main className="flex-1 overflow-auto p-4">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-500">
              {t("request_exchange")}
            </h3>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <form className="p-6 space-y-8">
              {/* Customer Information */}
              <div className="border-b border-gray-600 pb-8">
                <h2 className="text-lg font-semibold text-yellow-400 mb-4">
                  {t("customer_information")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t("full_name")}
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
                      {t("from_currency")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="base_currency"
                      name="base_currency"
                      required
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 uppercase placeholder-gray-400"
                      placeholder="USD"
                      pattern="[A-Z]{3}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t("to_currency")} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="target_currency"
                      name="target_currency"
                      required
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 uppercase placeholder-gray-400"
                      placeholder="AED"
                      pattern="[A-Z]{3}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t("amount_to_exchange")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      id="base_amount"
                      name="base_amount"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t("exchange_rate")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      id="exchange_rate"
                      name="exchange_rate"
                      step="0.00000001"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                      placeholder="0.00000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-yellow-400 mb-2">
                      {t("amount_to_receive")}{" "}
                      <span className="text-red-400">*</span>
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
                      <option value="bank_transfer">
                        {t("bank_transfer")}
                      </option>
                      <option value="credit_card">{t("credit_card")}</option>
                      <option value="mobile_wallet">
                        {t("mobile_wallet")}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-600">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
                >
                  {t("submit_exchange_request")}
                </button>
                <button
                  type="reset"
                  className="flex-1 bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-500 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200"
                >
                  {t("reset_form")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
