import { useLocation, useNavigate } from "react-router-dom";
import { t, setLang } from "../i18n";
import InnerHeader from "../components/InnerHeader";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import Loader from "../components/Loader";
import logo from "../../src/assets/beexchange-transparent.png";
// imporrt the api url from env
const API_URL = import.meta.env.VITE_API_URL;
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  CreditCard,
  TriangleAlert,
  User,
} from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  type FormDataKeys = keyof typeof formData;

  // Add this new state variable at the top with your other useState calls
  const [formData, setFormData] = useState<{
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    whatsapp: string;
    guest_identification: string;
    payment_method: string;
  }>({
    guest_name: "",
    guest_email: "",
    guest_phone: "",
    whatsapp: "",
    guest_identification: "",
    payment_method: "",
  });
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
  }, [language]);

  const validateField = (fieldId: string, value: string): string => {
    const requiredFields: FormDataKeys[] = [
      "guest_name",
      "guest_phone",
      "whatsapp",
      "payment_method",
    ];

    if (requiredFields.includes(fieldId as FormDataKeys) && !value.trim()) {
      return t("field_required");
    }

    if (fieldId === "guest_email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return t("invalid_email");
    }

    if (
      (fieldId === "guest_phone" || fieldId === "whatsapp") &&
      value &&
      !/^\+?[\d\s-()]+$/.test(value)
    ) {
      return t("invalid_phone");
    }

    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    // Update the formData state
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Validate the field and set errors
    const error = validateField(id, value);
    setFormErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields: FormDataKeys[] = [
      "guest_name",
      "guest_phone",
      "whatsapp",
      "payment_method",
    ];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate all required fields using the formData state
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);

    if (isValid) {
      const requestData = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email || "",
        guest_phone: formData.guest_phone,
        whatsapp: formData.whatsapp,
        guest_identification: formData.guest_identification || "",
        payment_method: formData.payment_method || "",
        base_currency: exData?.fromCurrency || "",
        target_currency: exData?.toCurrency || "",
        base_amount: parseFloat(exData?.fromAmount?.toString() || "0"),
        target_amount: parseFloat(exData?.toAmount?.toString() || "0"),
        exchange_rate: parseFloat(exData?.rate?.toString() || "0"),
        provider_id: userData ? userData.provider_id : null,
      };

      try {
        await axios.post(
          `${API_URL}/requestExchange/${
            userData ? userData.provider_id : null
          }`,
          requestData
        );
        setModalMessage(t("exchange_request_success"));
        setShowModal(true);

        setFormData({
          guest_name: "",
          guest_email: "",
          guest_phone: "",
          whatsapp: "",
          guest_identification: "",
          payment_method: "",
        });

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
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: t("customer_information"),
      icon: <User size={20} />,
    },
    {
      id: 2,
      title: t("exchange_information"),
      icon: <ArrowRightLeft size={20} />,
    },
    {
      id: 3,
      title: t("payment_information"),
      icon: <CreditCard size={20} />,
    },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <InnerHeader title="BeEx" />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg">
            {/* logo */}
            <img src={logo} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">
            {t("request_exchange")}
          </h1>
          <p className="text-gray-400 text-lg">
            {t("fill_details_to_process_exchange")}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-500 text-gray-900"
                      : "border-gray-600 bg-gray-800 text-gray-400"
                  }`}
                >
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      currentStep >= step.id
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? "bg-yellow-500" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-4">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-gray-900 font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-semibold text-yellow-400">
                    {t("customer_information")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("full_name")} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="guest_name"
                        name="guest_name"
                        value={formData.guest_name}
                        onChange={handleInputChange}
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        } py-3 border rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
                          placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 
                          focus:border-yellow-500 hover:bg-gray-700/70 ${
                            formErrors.guest_name
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-600"
                          }`}
                        placeholder={t("enter_full_name")}
                      />
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    {formErrors.guest_name && (
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-1">
                          <TriangleAlert />
                        </span>{" "}
                        {formErrors.guest_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("email_address")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="guest_email"
                        name="guest_email"
                        onChange={handleInputChange}
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        } py-3 border rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
                          placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 
                          focus:border-yellow-500 hover:bg-gray-700/70 ${
                            formErrors.guest_email
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-600"
                          }`}
                        placeholder={t("enter_email")}
                      />
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    {formErrors.guest_email && (
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-1">
                          <TriangleAlert />
                        </span>{" "}
                        {formErrors.guest_email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("phone_number")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="guest_phone"
                        name="guest_phone"
                        onChange={handleInputChange}
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        } py-3 border rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
                          placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 
                          focus:border-yellow-500 hover:bg-gray-700/70 ${
                            formErrors.guest_phone
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-600"
                          }`}
                      />
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16ZM72,64H184V192H72Zm8-32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    {formErrors.guest_phone && (
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-1">
                          <TriangleAlert />
                        </span>{" "}
                        {formErrors.guest_phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("whatsapp_number")}{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        onChange={handleInputChange}
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        } py-3 border rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
                          placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 
                          focus:border-yellow-500 hover:bg-gray-700/70 ${
                            formErrors.whatsapp
                              ? "border-red-500 focus:ring-red-500/50"
                              : "border-gray-600"
                          }`}
                      />
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    {formErrors.whatsapp && (
                      <p className="text-red-400 text-sm flex items-center">
                        <span className="mr-1">
                          <TriangleAlert />
                        </span>{" "}
                        {formErrors.whatsapp}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("identification_number")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="guest_identification"
                        name="guest_identification"
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        }  py-3 border border-gray-600 rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
                          placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 
                          focus:border-yellow-500 hover:bg-gray-700/70`}
                        placeholder={t("enter_id")}
                      />
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M200,112a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h40A8,8,0,0,1,200,112Zm-8,24H152a8,8,0,0,0,0,16h40a8,8,0,0,0,0-16Zm40-80V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Zm-80.26-34a8,8,0,1,1-15.5,4c-2.63-10.26-13.06-18-24.25-18s-21.61,7.74-24.25,18a8,8,0,1,1-15.5-4,39.84,39.84,0,0,1,17.19-23.34,32,32,0,1,1,45.12,0A39.76,39.76,0,0,1,135.75,166ZM96,136a16,16,0,1,0-16-16A16,16,0,0,0,96,136Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center">
                      {t("id_help_text")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Exchange Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-gray-900 font-bold">2</span>
                  </div>
                  <h2 className="text-xl font-semibold text-yellow-400">
                    {t("exchange_information")}
                  </h2>
                </div>

                {/* Exchange Rate Display Card */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-400 mb-1">
                        {t("from_currency")}
                      </p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {exData?.fromCurrency || "USD"}
                      </p>
                      <p className="text-lg text-gray-300">
                        {exData?.fromAmount || "0.00"}
                      </p>
                    </div>
                    <div className="mx-6 flex flex-col items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mb-2">
                        <span className="text-gray-900 font-bold">⇄</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Rate: {exData?.rate.toFixed(6) || "0.000000"}
                      </p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-400 mb-1">
                        {t("to_currency")}
                      </p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {exData?.toCurrency || "AED"}
                      </p>
                      <p className="text-lg text-gray-300">
                        {exData?.toAmount || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("from_currency")}
                    </label>
                    <input
                      type="text"
                      id="base_currency"
                      name="base_currency"
                      readOnly
                      className={`w-full ${
                        language === "ar" ? "pr-10" : "pl-10"
                      } py-3 border border-gray-600 rounded-xl bg-gray-600/50 text-gray-300 
                        uppercase cursor-not-allowed`}
                      value={exData?.fromCurrency || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("to_currency")}
                    </label>
                    <input
                      type="text"
                      id="target_currency"
                      name="target_currency"
                      readOnly
                      className={`w-full ${
                        language === "ar" ? "pr-10" : "pl-10"
                      } py-3 border border-gray-600 rounded-xl bg-gray-600/50 text-gray-300 
                        uppercase cursor-not-allowed`}
                      value={exData?.toCurrency || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("amount_to_exchange")}
                    </label>
                    <input
                      type="number"
                      id="base_amount"
                      name="base_amount"
                      readOnly
                      className={`w-full ${
                        language === "ar" ? "pr-10" : "pl-10"
                      } py-3 border border-gray-600 rounded-xl bg-gray-600/50 text-gray-300 cursor-not-allowed`}
                      value={exData?.fromAmount || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("exchange_rate")}
                    </label>
                    <input
                      type="number"
                      id="exchange_rate"
                      name="exchange_rate"
                      readOnly
                      className={`w-full ${
                        language === "ar" ? "pr-10" : "pl-10"
                      } py-3 border border-gray-600 rounded-xl bg-gray-600/50 text-gray-300 cursor-not-allowed`}
                      value={exData?.rate.toFixed(6) || ""}
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("amount_to_receive")}
                    </label>
                    <input
                      type="number"
                      id="target_amount"
                      name="target_amount"
                      readOnly
                      className={`w-full ${
                        language === "ar" ? "pr-10" : "pl-10"
                      } py-3 border border-gray-600 rounded-xl bg-gradient-to-r from-gray-600/50 to-gray-600/30 
                        text-yellow-300 cursor-not-allowed font-semibold`}
                      value={exData?.toAmount || ""}
                    />
                    <p className="text-sm text-gray-400 flex items-center">
                      {t("calculated_automatically")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-gray-900 font-bold">3</span>
                  </div>
                  <h2 className="text-xl font-semibold text-yellow-400">
                    {t("payment_information")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      {t("payment_method")}
                    </label>
                    <div className="relative">
                      <select
                        id="payment_method"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleInputChange}
                        className={`w-full ${
                          language === "ar" ? "pr-10" : "pl-10"
                        } py-3 border border-gray-600 rounded-xl bg-gray-700/50 backdrop-blur-sm text-gray-100 
    transition-all duration-300 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 
    hover:bg-gray-700/70 cursor-pointer`}
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
                      <div
                        className={`absolute inset-y-0 ${
                          language === "ar" ? "right-3" : "left-3"
                        } flex items-center `}
                      >
                        <span className="text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6 mt-8">
                  <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                    {t("request_summary")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-400">{t("exchange")}:</span>{" "}
                        <span className="text-white font-semibold">
                          {exData?.fromCurrency} → {exData?.toCurrency}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">{t("amount")}:</span>{" "}
                        <span className="text-white font-semibold">
                          {exData?.fromAmount} → {exData?.toAmount}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-400">{t("rate")}:</span>{" "}
                        <span className="text-white font-semibold">
                          {exData?.rate.toFixed(6)}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">{t("status")}:</span>{" "}
                        <span className="text-yellow-400 font-semibold">
                          {t("pending_approval")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-700/50 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
                  currentStep === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                <span className="mr-2">
                  {language === "ar" ? <ArrowRight /> : <ArrowLeft />}
                </span>{" "}
                {t("previous")}
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-semibold 
                    rounded-full hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform 
                    hover:-translate-y-0.5 hover:shadow-lg flex items-center"
                >
                  {t("next")}{" "}
                  <span className="ml-2">
                    {language === "ar" ? <ArrowLeft /> : <ArrowRight />}
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={submitHandler}
                  disabled={loading}
                  className="px-8 py-3 mx-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold 
                    rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform 
                    hover:-translate-y-0.5 hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("processing")}...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✓</span>{" "}
                      {t("submit_exchange_request")}
                    </>
                  )}
                </button>
              )}
            </div>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
