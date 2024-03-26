import React, { useState } from 'react'
import { FaChevronDown, FaTimes } from 'react-icons/fa'
import { Diskominfo } from '../assets'

interface NavbarProps {
  handleClear: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleClear }) => {

  const [activeMenu, setActiveMenu] = useState<boolean>(false)
  const [sidebar, setSideber] = useState<boolean>(false)

  return (
    <div className='w-screen h-[60px] bg-white relative flex items-center justify-between shadow-lg shadow-blue-100 px-8 jsutify-between'>
      <div>
        <img onClick={() => handleClear()} src={Diskominfo} alt="logo-diskominfo" className='w-[35%] relative left-[-14px] md:left-6' />
      </div>
      <div onClick={() => setSideber(!sidebar)} className='w-[54px] px-1 h-[40px] rounded-[8px] cursor-pointer border border-slate-300 active:scale-[0.98] hover:brightness-[90%] flex flex-col items-center justify-center'>
        <div className='w-[80%] h-[3px] bg-slate-400 rounded-full'></div>
        <div className='w-[80%] h-[3px] my-2 bg-slate-400 rounded-full'></div>
        <div className='w-[80%] h-[3px] bg-slate-400 rounded-full'></div>
      </div>
      <div className={`md:hidden flex bg-white z-[999999] flex-col fixed ${sidebar ? 'left-0' : 'left-[-100%]'} top-0 duration-300 ease-in w-screen min-h-screen p-6 overflow-y-auto`}>
        <div onClick={() => setSideber(!sidebar)} className='absolute top-6 right-6 shadow-md  flex items-center justify-center w-[40px] h-[40px] bg-red-500 text-white rounded-[10px] cursor-pointer hover:brightnes-[90%] active:scale-[0.9]'>
          <FaTimes />
        </div>
        <ul className='mt-12'>
            <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Homepage</li>
            <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Daftar geospasial</li>
            <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>API Geopasial</li>
            <li className='mb-10 border-b border-slate-500 pb-5 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Masukan & Saran</li>
          </ul>
      </div>
      <div className='w-[80%] md:flex hidden'>
        <ul className='flex items-center justify-end'>
            <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Homepage</li>
            <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Daftar geospasial</li>
            <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>API Geopasial</li>
            <li className={`relative md:mr-12 border rounded-[8px] px-4 py-2 cursor-pointer text-[15px] flex items-center ${activeMenu ? 'bg-blue-600 border-white' : 'bg-white border-slate-300 font-medium text-slate-500'}`}>
              <p onClick={() => setActiveMenu(!activeMenu)} className={`${activeMenu ? 'text-white' : ''}`}>Menu Lainnya </p>
              <span className={`ml-3 text-[12px] relative top-[0.5px] hover:rotate-[-180deg] duration-200 ${activeMenu ? 'text-white' : ''}`}>
                <FaChevronDown />
              </span>
              <div className={`absolute w-max h-max rounded-[8px] bg-white duration-100 shadow-lg p-2 ${activeMenu ? 'bottom-[-180px] z-[9999] left-[0px] opacity-1 duration-400' : 'bottom-[-160px] opacity-0 left-[0px] z-[-1] duration-400'}`}>
                <p className='p-3 cursor-pointer bg-white rounded-md hover:bg-blue-400 hover:text-white active:scale-[0.99] duration-100'>Open Data</p>
                <p className='p-3 cursor-pointer bg-white rounded-md hover:bg-blue-400 hover:text-white active:scale-[0.99] duration-100'>Satu Data</p>
                <p className='p-3 cursor-pointer bg-white rounded-md hover:bg-blue-400 hover:text-white active:scale-[0.99] duration-100'>Web Diskominfo</p>
              </div>
            </li>
            <li className='md:mr-12 font-medium text-slate-500 hover:text-blue-500 cursor-pointer active:scale-[0.98] text-[15px]'>Masukan & Saran</li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
