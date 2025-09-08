import React, { useEffect, useState } from "react";
import logo from "../assets/beexchange-transparent.png";
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import axios from "axios";
import { Globe } from "lucide-react"; // Import globe icon for language toggle
// imporrt the api url from env
const API_URL = import.meta.env.VITE_API_URL;
import { t, setLang } from "../i18n";
type Lang = "ar" | "en";

export default function CurrencyExchangeApp() {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [language, setLanguage] = useState<Lang>();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const verifyProviderUrl = `${API_URL}/providerVerification/1`; // Replace with your actual API endpoint

  const navigate = useNavigate();

  // Language toggle function
  const toggleLanguage = () => {
    const newLang: Lang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

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
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      navigate("/");
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // varify that the email is a user's email
      const requestData = {
        email: email,
      };
      const data = await axios
        .post(verifyProviderUrl, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error verifying user:", error);
          setModalMessage("Error verifying user. Please try again.");
          setShowModal(true);
          return;
        });

      if (!data) {
        setModalMessage(t("error_verifying_user"));
        setShowModal(true);
        return;
      }
      // save data to local storage
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Generate a random 4-digit OTP
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setOtp(["", "", "", ""]); // Reset OTP input fields

      // show otp in the otpHint div
      const otpHint = document.getElementById("otpHint");
      if (otpHint) {
        otpHint.textContent = `pst, OTP: ${newOtp} `;
      }
      setOtpSent(true);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    // Handle verification logic here
    if (enteredOtp === generatedOtp) {
      setModalMessage(t("otp_verified"));
      setTimeout(() => {
        setShowModal(false); // Close modal
        navigate("/"); // Navigate to the home page
      }, 2000);
    } else {
      console.error("Invalid OTP. Please try again.");
      setModalMessage(t("invalid_otp"));
      setShowModal(true);

      // Optionally reset OTP input fields
      setOtp(["", "", "", ""]);
    }
  };

  const resendOtp = async () => {
    // Generate a new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtp(["", "", "", ""]); // Reset OTP input fields

    // show otp in the otpHint div
    const otpHint = document.getElementById("otpHint");
    if (otpHint) {
      otpHint.textContent = `pst, OTP: ${newOtp} `;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
      {/* Language Toggle Button - Top Right */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-yellow-500 px-4 py-2 rounded-full transition-colors border border-gray-700"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">
          {language === "ar" ? t("arabic") : t("english")}
        </span>
      </button>

      <div className="flex flex-col items-center">
        {/* Logo */}
        <img
          src={logo} // <-- change this path to your logo
          alt="Logo"
          className="h-20 mb-6"
        />

        <form
          onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
          className="p-8 rounded-2xl shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center text-yellow-500 mb-6">
            {otpSent ? t("enter_otp") : t("signin")}
          </h2>

          {!otpSent ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={`${t("email")} ${t("example")}: you@example.com`}
                className="w-full p-4 rounded-full border border-gray-700 bg-gray-700 text-gray-100 text-sm mb-6 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-4 rounded-full transition-colors"
              >
                {t("send_otp")}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-center mb-8">
                {t("otp_sent")} <span className="text-yellow-500">{email}</span>
              </p>

              <div className="flex justify-between mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 text-center text-xl rounded-lg border border-gray-700 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
              >
                {t("verify")}
              </button>

              <div className="text-center mt-6 text-sm text-gray-400">
                {t("didnt_receive_code")}?{" "}
                <button
                  type="button"
                  onClick={() => resendOtp()}
                  className="text-yellow-500 font-medium hover:underline"
                >
                  {t("resend_otp")}
                </button>
              </div>
            </>
          )}
        </form>
        <div id="otpHint"></div>
      </div>
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
