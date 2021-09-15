import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          nav: {
            name: `Mohamad Hanafi`,
            pastWork: `Past Work`,
            skills: `Skills`,
            certificates: `Certificates`,
            hireMe: `Hire Me`,
          },
          about: {
            greeting1: `Hi, I'm Mohamad.`,
            greeting2: `I love to build amazing apps.`,
            summary: `I'm an aspired full-stack (MERN) web developer. I work as a freelancer & I'm based in Turkey.`,
            workWithMe: `Work With Me`,
            seeMyPastWork: `See My Past Work `,
          },
          projects: {
            header: "Apps I've Built",
            paragraph:
              'Check out some of the projects that I have built during my journey as a web developer. These apps were made using ReactJS, ExpressJS, and other technologies.',
          },
          skills: {
            header: `Skills & Technologies`,
            paragraph: `"Life is all about learning", which is why I always try to learn and
            improve my skills. Here are some of the main skills that I use in my
            work.`,
          },
          certificates: {
            header: `Certificates`,
            paragraph: `Learning can never stop. Here are some of the courses I had.`,
          },
          contact: {
            header: `Hire Me`,
            paragraph: `Interested in working together? We should queue up a chat. I’ll offer you a coffee.`,
            label: {
              name: 'Name',
              email: 'Email',
              message: 'Message',
              submit: 'Submit',
            },
          },
        },
      },
      ar: {
        translation: {
          nav: {
            name: `محمد حنفي`,
            pastWork: `الاعمال السابقة`,
            skills: `المهارات`,
            certificates: `الشهادات`,
            hireMe: `اعمل معي`,
          },
          about: {
            greeting1: `!مرحبا, انا محمد`,
            greeting2: `انا هنا لبناء افضل التطبيقات لك`,
            summary: `انا مبرمج واجهات امامية و نطم خلفية لتطبيقات الانترنت. اعمل كعامل مستقل، و اقيم في تركيا.`,
            workWithMe: `اعمل معي`,
            seeMyPastWork: `تفقد اعمالي السابقة`,
          },
          projects: {
            header: 'تطبيقات قمت بتطويرها',
            paragraph:
              'تفقد بعض من التطبيقات اللتي قمت ببنائها خلال رحلتي كمطور. تم بناء هذه التطبيقات باسنخدام تكنولوجيا هي الاحدث في هذا المجال',
          },
          skills: {
            header: `المهارات & التكنولوجيا`,
            paragraph: `طريق التعلم لا ينتهي، لذلك احاول دائما التحسين من مهاراتي. هذه بعض من المهارات الاساسية التي استخدمها في عملي`,
          },
          certificates: {
            header: `الشهادات`,
            paragraph: `التعليم عملية مستمرة. هذه بعض الشهادات التي حصلت عليها`,
          },
          contact: {
            header: `اعمل معي`,
            paragraph: `مهتم بالعمل معي، لنحصل على محادثة، سأشتري انا قنجان القهوة `,
            label: {
              name: 'الإسم',
              email: 'البريد الالكتروني',
              message: 'الرسالة',
              submit: 'أرسل',
            },
          },
        },
      },
    },
  });

export default i18n;
