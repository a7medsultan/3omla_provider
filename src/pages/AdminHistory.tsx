import {
  ArrowRight,
  TrendingUp,
  Calendar,
  Hash,
  MoreVertical,
} from "lucide-react";
import React, { useState } from "react";
import ExchangeBox from "../components/ExchangeBox";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

// Mobile App Demo
const adminHistory = () => {
  const [selectedTab, setSelectedTab] = useState("recent");

  const sampleData = [
    {
      id: 9,
      reference_number: "REF-F77A9F5F70BDA840",
      request_type: "online",
      guest_name: "محمود الهادي",
      guest_email: "test@email.com",
      guest_phone: "213243424",
      whatsapp: "12442344353",
      guest_identification: "",
      provider_id: 1,
      base_currency: "AED",
      target_currency: "SDG",
      base_amount: 500,
      exchange_rate: 925,
      service_fee: 0,
      target_amount: 462500,
      status: "pending",
      payment_method: "cash",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-04T03:12:10+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 8,
      reference_number: "REF-64B36BB93E519D61",
      request_type: "online",
      guest_name: "Vivien Francis",
      guest_email: "bysizidyju@mailinator.com",
      guest_phone: "+1 (994) 605-9797",
      whatsapp: "+1 (522) 453-9465",
      guest_identification: "Rerum deserunt ut ve",
      provider_id: 1,
      base_currency: "AED",
      target_currency: "SDG",
      base_amount: 350,
      exchange_rate: 920,
      service_fee: 0,
      target_amount: 322000,
      status: "completed",
      payment_method: "cash",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T02:38:57+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 7,
      reference_number: "REF-C9850C1682A3F29D",
      request_type: "online",
      guest_name: " آدم عمر",
      guest_email: "adam@email.com",
      guest_phone: "971458965214",
      whatsapp: "971478563254",
      guest_identification: "",
      provider_id: 1,
      base_currency: "AED",
      target_currency: "SDG",
      base_amount: 2500,
      exchange_rate: 920,
      service_fee: 0,
      target_amount: 2300000,
      status: "pending",
      payment_method: "credit_card",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T02:35:11+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 6,
      reference_number: "REF-74DF460646814F1B",
      request_type: "online",
      guest_name: "عيسى عبدالرحيم بله",
      guest_email: "essa@email.com",
      guest_phone: "971587896545",
      whatsapp: "971563258745",
      guest_identification: "",
      provider_id: 1,
      base_currency: "AED",
      target_currency: "SDG",
      base_amount: 2500,
      exchange_rate: 920,
      service_fee: 0,
      target_amount: 2300000,
      status: "cancelled",
      payment_method: "bank_transfer",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T02:32:42+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 5,
      reference_number: "REF-F8F8958DDCB4FA27",
      request_type: "online",
      guest_name: "محمد عبدالمنعم",
      guest_email: "email@email.com",
      guest_phone: "971785455585",
      whatsapp: "971555880457",
      guest_identification: "",
      provider_id: 1,
      base_currency: "AED",
      target_currency: "SDG",
      base_amount: 2500,
      exchange_rate: 920,
      service_fee: 0,
      target_amount: 2300000,
      status: "pending",
      payment_method: "bank_transfer",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T02:11:17+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 4,
      reference_number: "REF-AB17D4AA9D0977C6",
      request_type: "online",
      guest_name: "Ahmed Idris",
      guest_email: "ahmedsultan.7@gmail.com",
      guest_phone: "0990090006",
      whatsapp: "09903090006",
      guest_identification: "12312323434",
      provider_id: 1,
      base_currency: "SDG",
      target_currency: "USD",
      base_amount: 5000000,
      exchange_rate: 0.000358,
      service_fee: 0,
      target_amount: 1788.91,
      status: "pending",
      payment_method: "cash",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T02:07:15+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 3,
      reference_number: "REF-45105A176005A640",
      request_type: "online",
      guest_name: "Ahmed Idris",
      guest_email: "ahmedsultan.7@gmail.com",
      guest_phone: "0990090006",
      whatsapp: "0990090006",
      guest_identification: "12312323434",
      provider_id: 1,
      base_currency: "SDG",
      target_currency: "USD",
      base_amount: 5000000,
      exchange_rate: 0.000358,
      service_fee: 0,
      target_amount: 1788.91,
      status: "cancelled",
      payment_method: "cash",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T01:40:06+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
    {
      id: 2,
      reference_number: "REF-2448A46B0B2373C2",
      request_type: "online",
      guest_name: "Ahmed Idris",
      guest_email: "ahmedsultan.7@gmail.com",
      guest_phone: "0990090006",
      whatsapp: "0990090006",
      guest_identification: "12312323434",
      provider_id: 1,
      base_currency: "SDG",
      target_currency: "USD",
      base_amount: 5000000,
      exchange_rate: 0.000358,
      service_fee: 0,
      target_amount: 1788.91,
      status: "pending",
      payment_method: "cash",
      receipt_number: "",
      notes: "",
      created_at: "2025-09-03T01:35:23+04:00",
      updated_at: "0001-01-01T00:00:00Z",
    },
  ];

  const handleCurrencyPress = (refNo: string) => {
    console.log(`Currency transaction pressed: ${refNo}`);
    // In a real Capacitor app, you might navigate to a detail page
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title="BeEx" />
      <main className="flex-1 overflow-auto p-4">
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
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Currency List */}
        <div className="py-4">
          {sampleData
            .filter((item) => {
              if (selectedTab === "pending") return item.status === "pending";
              if (selectedTab === "completed")
                return item.status === "completed";
              return true; // recent shows all
            })
            .map(
              (data) => (
                console.log(data),
                (
                  <ExchangeBox
                    index={data.id}
                    refNo={data.reference_number}
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
                )
              )
            )}

          {sampleData.filter((item) => {
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
    </div>
  );
};

export default adminHistory;
