import ar from "./ar.json";
import en from "./en.json";

// Define type of translations
type TranslationKeys = keyof typeof ar; // assumes ar.json and en.json have the same keys
type Lang = "ar" | "en";

// Bundle translations
const translations: Record<Lang, Record<TranslationKeys, string>> = { ar, en };

// Default language
let currentLang: Lang = (localStorage.getItem("lang") as Lang) || "ar";
localStorage.setItem("lang", currentLang);

// Change language
export function setLang(lang: Lang): void {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    if(currentLang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }
}

// Translation function
export function t(key: TranslationKeys): string {
  return translations[currentLang][key] || key;
}
