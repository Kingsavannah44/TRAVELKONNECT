import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.jobs": "Jobs",
      "nav.dashboard": "Dashboard",
      "nav.profile": "Profile",
      "nav.login": "Login",
      "nav.register": "Register",
      "nav.logout": "Logout",
      
      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.submit": "Submit",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.view": "View",
      "common.apply": "Apply",
      "common.search": "Search",
      "common.filter": "Filter",
      
      // Auth
      "auth.login": "Login",
      "auth.register": "Register",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.firstName": "First Name",
      "auth.lastName": "Last Name",
      "auth.phone": "Phone Number",
      "auth.role": "I am a",
      "auth.driver": "Truck Driver",
      "auth.employer": "Employer",
      "auth.loginSuccess": "Login successful!",
      "auth.registerSuccess": "Registration successful!",
      
      // Dashboard
      "dashboard.welcome": "Welcome back",
      "dashboard.stats": "Statistics",
      "dashboard.recentActivity": "Recent Activity",
      "dashboard.quickActions": "Quick Actions",
      
      // Jobs
      "jobs.title": "Job Opportunities",
      "jobs.searchPlaceholder": "Search jobs...",
      "jobs.location": "Location",
      "jobs.salary": "Salary",
      "jobs.experience": "Experience Required",
      "jobs.applyNow": "Apply Now",
      "jobs.viewDetails": "View Details",
      
      // Profile
      "profile.personalInfo": "Personal Information",
      "profile.documents": "Documents",
      "profile.experience": "Experience",
      "profile.updateSuccess": "Profile updated successfully!",
    }
  },
  sw: {
    translation: {
      // Navigation
      "nav.home": "Nyumbani",
      "nav.jobs": "Kazi",
      "nav.dashboard": "Dashibodi",
      "nav.profile": "Wasifu",
      "nav.login": "Ingia",
      "nav.register": "Jisajili",
      "nav.logout": "Toka",
      
      // Common
      "common.loading": "Inapakia...",
      "common.save": "Hifadhi",
      "common.cancel": "Ghairi",
      "common.submit": "Wasilisha",
      "common.edit": "Hariri",
      "common.delete": "Futa",
      "common.view": "Ona",
      "common.apply": "Omba",
      "common.search": "Tafuta",
      "common.filter": "Chuja",
      
      // Auth
      "auth.login": "Ingia",
      "auth.register": "Jisajili",
      "auth.email": "Barua pepe",
      "auth.password": "Nywila",
      "auth.confirmPassword": "Thibitisha Nywila",
      "auth.firstName": "Jina la Kwanza",
      "auth.lastName": "Jina la Mwisho",
      "auth.phone": "Nambari ya Simu",
      "auth.role": "Mimi ni",
      "auth.driver": "Dereva wa Lori",
      "auth.employer": "Mwajiri",
      "auth.loginSuccess": "Umeingia kwa mafanikio!",
      "auth.registerSuccess": "Usajili umefanikiwa!",
      
      // Dashboard
      "dashboard.welcome": "Karibu tena",
      "dashboard.stats": "Takwimu",
      "dashboard.recentActivity": "Shughuli za Hivi Karibuni",
      "dashboard.quickActions": "Vitendo vya Haraka",
      
      // Jobs
      "jobs.title": "Fursa za Kazi",
      "jobs.searchPlaceholder": "Tafuta kazi...",
      "jobs.location": "Mahali",
      "jobs.salary": "Mshahara",
      "jobs.experience": "Uzoefu Unahitajika",
      "jobs.applyNow": "Omba Sasa",
      "jobs.viewDetails": "Ona Maelezo",
      
      // Profile
      "profile.personalInfo": "Taarifa za Kibinafsi",
      "profile.documents": "Hati",
      "profile.experience": "Uzoefu",
      "profile.updateSuccess": "Wasifu umesasishwa kwa mafanikio!",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;