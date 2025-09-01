import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t, setLang } from "../i18n";
import { useEffect, useState } from "react";

// Define the props for the component
interface HeaderProps {
  title: string;
}

type Lang = "ar" | "en";

const InnerHeader: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  // Initialize state directly from localStorage to prevent multiple re-renders
  // The initializer function ensures this only runs once.
  const [language, setLanguage] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "ar";
  });

  // This useEffect will run only once when the component mounts
  // to ensure the i18n library is set to the correct language.
  useEffect(() => {
    setLang(language);
  }, [language]); // Depend on language state to update i18n

  const goToPrevPage = () => {
    // go back to the previous page in history
    navigate(-1);
  };

  const isEnglish = language === "en";

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={goToPrevPage}
            className="p-2 rounded-full text-gray-400 hover:text-yellow-500"
          >
            {/* Conditional rendering using a ternary operator */}
            {isEnglish ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-yellow-500">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default InnerHeader;
