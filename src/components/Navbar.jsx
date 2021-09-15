import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const lngs = {
    en: { nativeName: 'En' },
    ar: { nativeName: 'Ar' },
  };

  const { t, i18n } = useTranslation();

  return (
    <header className='bg-gray-800 md:sticky top-0 z-10'>
      <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
        <a
          href='#about'
          className='title-font font-medium text-white mb-4 md:mb-0'
        >
          <a href='#about' className='ml-3 text-xl'>
            {t('nav.name')}
          </a>
        </a>
        <nav className='md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center'>
          <a href='#projects' className='mr-5 hover:text-white'>
            {t('nav.pastWork')}
          </a>
          <a href='#skills' className='mr-5 hover:text-white'>
            {t('nav.skills')}
          </a>
          <a href='#certificates' className='mr-5 hover:text-white'>
            {t('nav.certificates')}
          </a>
        </nav>
        <div>
          {Object.keys(lngs).map((lng) => (
            <button
              key={lng}
              type='submit'
              onClick={(e) => {
                i18n.changeLanguage(lng);
              }}
              className='mx-1 font-bold rounded text-lg border-green-500 border-2 px-2 hover:text-white hover:bg-green-500'
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
        <a
          href='#contact'
          className='inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0'
        >
          {t('nav.hireMe')}
          <ArrowRightIcon className='w-4 h-4 ml-1' />
        </a>
      </div>
    </header>
  );
};

export default Navbar;
