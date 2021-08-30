import React from 'react';
import { TerminalIcon } from '@heroicons/react/solid';
import { certificates } from '../portfolio/Certificates';

const CertificatesComponent = () => {
  return (
    <section id='certificates'>
      <div className='container px-5 py-10 mx-auto text-center sm:w-5/6 md:w-4/5'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='w-10 inline-block mb-4'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
        </svg>
        <h1 className='sm:text-4xl text-3xl font-medium title-font mb-4 text-white'>
          Certificates
        </h1>
        <p className='lg:w-2/3 mx-auto leading-relaxed text-base mb-12'>
          Learning can never stop. Here are some of the courses I had.
        </p>
        {/* certificates go here */}
        <div className='grid gap-8 md:grid-cols-3 items-center'>
          {certificates.map((certificate) => (
            <div className=' w-full h-full bg-gray-800 m-2 p-0 overflow-hidden rounded-md transform hover:scale-105 transition ease-in-out duration-100 shadow-lg'>
              <a
                target='_blank'
                href={certificate.link}
                key={certificate.image}
                className='sm:w-1/2 w-100 p-0'
                rel='noreferrer'
              >
                <div>
                  <img
                    src={certificate.image}
                    alt='certificate'
                    className='pb-4'
                  />
                  <h1 className='pb-3 px-3 font-bold text-white'>
                    {certificate.title}
                  </h1>
                  <h3 className='px-3 text-sm'>{certificate.description}</h3>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesComponent;
