import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını içe aktarma
import translationEN from './locales/en/translation.json';
import translationTR from './locales/tr/translation.json';

// Kaynaklar
const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  }
};

i18n
  // Dil dedektörünü kullan - otomatik olarak kullanıcının tarayıcı diline göre dil seçer
  .use(LanguageDetector)
  // i18next'i react ile entegre et
  .use(initReactI18next)
  // i18next'i başlat
  .init({
    resources,
    fallbackLng: 'en', // Varsayılan dil
    debug: true, // Geliştirme aşamasında hata ayıklama için
    interpolation: {
      escapeValue: false // React varsayılan olarak XSS önlemesi yaptığı için buna gerek yok
    }
  });

export default i18n;
