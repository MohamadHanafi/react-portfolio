import { ArrowRightIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "../helperes/debounce";

const Navbar = () => {
  type Languages = {
    [key: string]: { nativeName: string };
  };

  const [show, setShow] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;

      if (Math.abs(currentScrollPos - prevScrollPos) < 3) return;
      setShow(
        (prevScrollPos > currentScrollPos &&
          prevScrollPos - currentScrollPos > 70) ||
          currentScrollPos < 10
      );
      setPrevScrollPos(currentScrollPos);
    }, 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, show]);

  const lngs: Languages = {
    en: { nativeName: "En" },
    ar: { nativeName: "Ar" },
  };

  const { t, i18n } = useTranslation();

  return (
    <header
      className={`bg-gray-800 md:sticky top-0 z-10 ${
        show ? "opacity-100" : "opacity-0"
      } transition-all`}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a
          href="#about"
          className="title-font font-medium text-white mb-4 md:mb-0"
        >
          <a href="#about" className="ml-3 text-xl">
            {t("nav.name")}
          </a>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
          <a href="#projects" className="mr-5 hover:text-white">
            {t("nav.pastWork")}
          </a>
          <a href="#skills" className="mr-5 hover:text-white">
            {t("nav.skills")}
          </a>
          <a href="#certificates" className="mr-5 hover:text-white">
            {t("nav.certificates")}
          </a>
          <button className="inline-flex text-white bg-green-500 border-0 px-3 py-1.5 focus:outline-none hover:bg-green-600 rounded font-bold">
            <a href="/MohamadHanafiCV.pdf" download>
              {" "}
              DOWNLOAD MY CV{" "}
            </a>
          </button>
        </nav>
        <div className="my-1">
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              type="submit"
              onClick={(e) => {
                i18n.changeLanguage(lng);
              }}
              className="mx-1 font-bold rounded text-lg border-green-500 border-2 px-2 hover:text-white hover:bg-green-500"
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        <a
          href="#contact"
          className="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
        >
          {t("nav.hireMe")}
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </a>
      </div>
    </header>
  );
};

export default Navbar;
