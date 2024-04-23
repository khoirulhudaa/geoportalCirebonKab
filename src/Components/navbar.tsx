import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Diskominfo } from '../assets';

interface NavbarProps {
  handleClear: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleClear }) => {

  const [sidebar, setSideber] = useState<boolean>(false)

  return (
    <div className='w-screen h-[60px] bg-white z-[999999999999999999999999] relative flex items-center justify-between md:shadow-lg md:shadow-blue-100 px-8 justify-between'>
      <div>
        <img onClick={() => handleClear()} src={Diskominfo} alt="logo-diskominfo" className='w-[35%] relative left-[-14px] md:left-6' />
      </div>
      <div onClick={() => setSideber(!sidebar)} className='w-[54px] px-1 h-[40px] rounded-[8px] cursor-pointer border border-slate-300 active:scale-[0.98] hover:brightness-[90%] md:hidden flex flex-col items-center justify-center'>
        <div className='w-[80%] h-[3px] bg-slate-400 rounded-full'></div>
        <div className='w-[80%] h-[3px] my-2 bg-slate-400 rounded-full'></div>
        <div className='w-[80%] h-[3px] bg-slate-400 rounded-full'></div>
      </div>
      <div className={`md:hidden flex bg-white z-[999999] flex-col fixed ${sidebar ? 'left-0' : 'left-[-100%]'} top-0 duration-300 ease-in w-[90vw] border-r-[2px] border-dashed border-r-blue-500 min-h-screen p-6 overflow-y-auto`}>
        <div onClick={() => setSideber(!sidebar)} className='absolute top-6 right-6 shadow-md  flex items-center justify-center w-[40px] h-[40px] bg-red-500 text-white rounded-[10px] cursor-pointer hover:brightnes-[90%] active:scale-[0.9]'>
          <FaTimes />
        </div>
        <ul className='mt-12'>
            <a href="#home" onClick={() => handleClear()}>
              <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Beranda</li>
            </a>
            <a href="#daftar" onClick={() => handleClear()}>
              <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Daftar geospasial</li>
            </a>
            <a href="#API" onClick={() => handleClear()}>
              <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>API Geopasial</li>
            </a>
            <a href="https://opendata.cirebonkab.go.id/" target='__blank' onClick={() => handleClear()}>
              <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Open Data</li>
            </a>
            <a href="#masukan" onClick={() => handleClear()}>
              <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Masukan & Saran</li>
            </a>
          </ul>
      </div>
      <div className='w-[80%] md:flex hidden'>
        <ul className='flex items-center ml-auto justify-end'>
            <a href="#home" onClick={() => handleClear()}>
              <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Beranda</li>
            </a>
            <a href="#daftar" onClick={() => handleClear()}>
              <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Daftar geospasial</li>
            </a>
            <a href="#API" onClick={() => handleClear()}>
              <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>API Geopasial</li>
            </a>
            <a href="https://opendata.cirebonkab.go.id/" target='__blank' onClick={() => handleClear()}>
              <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Open Data Kab. Cirebon</li>
            </a>
            <a href="#masukan" onClick={() => handleClear()}>
              <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Masukan & Saran</li>
            </a>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
