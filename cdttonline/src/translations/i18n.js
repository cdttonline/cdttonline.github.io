import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import navBarEn from './translations/en/navbar_en.json'
import navBarFr from './translations/fr/navbar_fr.json'
import aboutEn from './translations/en/about_en.json'
import aboutFr from './translations/fr/about_fr.json'
import researchPlatformEn from './translations/en/research_platform_en.json'
import researchPlatformFr from './translations/fr/research_platform_fr.json'
import contactEn from './translations/en/contact_en.json'
import contactFr from './translations/fr/contact_fr.json'
import internalCalibFr from './translations/fr/internal_calibrations_fr.json'
import internalCalibEn from './translations/en/internal_calibrations_en.json'
import globalEn from './translations/en/global_en.json'
import globalFr from './translations/fr/global_fr.json'
import onlineTestEn from './translations/en/online_test_en.json'
import onlineTestFr from './translations/fr/online_test_fr.json'
import userTestResultsEn from './translations/en/user_test_results_en.json'
import userTestResultsFr from './translations/fr/user_test_results_fr.json'
import usersAccessEn from './translations/en/users_access_en.json'
import usersAccessFr from './translations/fr/users_access_fr.json'
import userProfileEn from './translations/en/user_profile_en.json'
import userProfileFr from './translations/fr/user_profile_fr.json'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                navbar: navBarEn,
                about: aboutEn,
                research_platform: researchPlatformEn,
                contact: contactEn,
                internal_calib: internalCalibEn,
                global: globalEn,
                online_test: onlineTestEn,
                user_test_results: userTestResultsEn,
                user_access: usersAccessEn,
                user_profile: userProfileEn
            },
            fr: {
                navbar: navBarFr,
                about: aboutFr,
                research_platform: researchPlatformFr,
                contact: contactFr,
                internal_calib: internalCalibFr,
                global: globalFr,
                online_test: onlineTestFr,
                user_test_results: userTestResultsFr,
                user_access: usersAccessFr,
                user_profile: userProfileFr
            },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;