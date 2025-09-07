import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setLang } from "../i18n";
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
