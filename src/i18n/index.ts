/**
 * i18n Configuration for LifeOS
 * Supports all 22 scheduled languages of India + English
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import te from "./locales/te.json";
import mr from "./locales/mr.json";
import ta from "./locales/ta.json";
import gu from "./locales/gu.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";
import pa from "./locales/pa.json";
import or from "./locales/or.json";
import as from "./locales/as.json";
import ur from "./locales/ur.json";
import mai from "./locales/mai.json";
import sa from "./locales/sa.json";
import ks from "./locales/ks.json";
import ne from "./locales/ne.json";
import sd from "./locales/sd.json";
import kok from "./locales/kok.json";
import doi from "./locales/doi.json";
import mni from "./locales/mni.json";
import sat from "./locales/sat.json";
import bo from "./locales/bo.json";

// Language Configuration - All Official Indian Languages
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region?: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  // Default
  { code: "en", name: "English", nativeName: "English", script: "Latin" },

  // Scheduled Languages of India (22)
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    region: "North India",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    region: "West Bengal, Tripura",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    region: "Andhra Pradesh, Telangana",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    region: "Maharashtra",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    region: "Tamil Nadu",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    script: "Gujarati",
    region: "Gujarat",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    script: "Kannada",
    region: "Karnataka",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    script: "Malayalam",
    region: "Kerala",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    region: "Punjab",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    script: "Odia",
    region: "Odisha",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Assamese",
    region: "Assam",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    script: "Perso-Arabic",
    region: "Jammu & Kashmir, UP",
  },
  {
    code: "mai",
    name: "Maithili",
    nativeName: "मैथिली",
    script: "Devanagari",
    region: "Bihar",
  },
  {
    code: "sa",
    name: "Sanskrit",
    nativeName: "संस्कृतम्",
    script: "Devanagari",
    region: "Classical",
  },
  {
    code: "ks",
    name: "Kashmiri",
    nativeName: "कॉशुर",
    script: "Perso-Arabic",
    region: "J&K",
  },
  {
    code: "ne",
    name: "Nepali",
    nativeName: "नेपाली",
    script: "Devanagari",
    region: "Sikkim, WB",
  },
  {
    code: "sd",
    name: "Sindhi",
    nativeName: "سنڌي",
    script: "Perso-Arabic",
    region: "Gujarat, Maharashtra",
  },
  {
    code: "kok",
    name: "Konkani",
    nativeName: "कोंकणी",
    script: "Devanagari",
    region: "Goa",
  },
  {
    code: "doi",
    name: "Dogri",
    nativeName: "डोगरी",
    script: "Devanagari",
    region: "J&K",
  },
  {
    code: "mni",
    name: "Manipuri",
    nativeName: "মৈতৈলোন্",
    script: "Meitei",
    region: "Manipur",
  },
  {
    code: "sat",
    name: "Santali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    script: "Ol Chiki",
    region: "Jharkhand",
  },
  {
    code: "bo",
    name: "Bodo",
    nativeName: "बड़ो",
    script: "Devanagari",
    region: "Assam",
  },
];

// Resources with translations
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  te: { translation: te },
  mr: { translation: mr },
  ta: { translation: ta },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: as },
  ur: { translation: ur },
  mai: { translation: mai },
  sa: { translation: sa },
  ks: { translation: ks },
  ne: { translation: ne },
  sd: { translation: sd },
  kok: { translation: kok },
  doi: { translation: doi },
  mni: { translation: mni },
  sat: { translation: sat },
  bo: { translation: bo },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "translation",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "lifeos_language",
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;

// Helper to get language by code
export const getLanguageByCode = (code: string): LanguageOption | undefined => {
  return INDIAN_LANGUAGES.find((lang) => lang.code === code);
};

// Helper to get current language
export const getCurrentLanguage = (): LanguageOption => {
  const current = i18n.language || "en";
  return getLanguageByCode(current) || INDIAN_LANGUAGES[0];
};

// Helper to change language
export const changeLanguage = (code: string): Promise<void> => {
  return i18n.changeLanguage(code).then(() => {
    // Store in localStorage
    localStorage.setItem("lifeos_language", code);
    // Update HTML dir attribute for RTL languages
    document.documentElement.dir = ["ur", "ks", "sd"].includes(code)
      ? "rtl"
      : "ltr";
    document.documentElement.lang = code;
  });
};
