import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
  "welcome": "Welcome",
  "signin": "Sign In",
  "signup": "Sign Up",
  "forgot_password": "Forgot Password",
  "logout": "Logout",
  "profile": "Profile",
  "dashboard": "Dashboard",
  "data_history": "Data History",
  "language": "Language",
  "dark_mode": "Dark Mode",
  "light_mode": "Light Mode",
  "sign_in_to_view": "You need to sign in to view this page."
},
  },
  tr: {
    translation: {
  "welcome": "Hoşgeldiniz",
  "signin": "Giriş Yap",
  "signup": "Kayıt Ol",
  "forgot_password": "Şifremi Unuttum",
  "logout": "Çıkış Yap",
  "profile": "Profil",
  "dashboard": "Kontrol Paneli",
  "data_history": "Veri Geçmişi",
  "language": "Dil",
  "dark_mode": "Karanlık Mod",
  "light_mode": "Aydınlık Mod",
  "sign_in_to_view": "Bu sayfayı görüntülemek için giriş yapmalısınız."
},
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Varsayılan dil
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
