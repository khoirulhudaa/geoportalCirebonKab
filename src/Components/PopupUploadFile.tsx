import React from 'react'
import { FaFileExcel } from 'react-icons/fa'
import { popUpProps } from '../Models/componentInterface'

const PopupUploadFile: React.FC<popUpProps> = ({
    onChange,
}) => {

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <form className='w-[37%] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
            <div className='relative w-full h-[400px] border border-slate-700 rounded-[20px] flex flex-col justify-center items-center text-center'>
                <div className='absolute overflow-hidden rounded-[20px] active:scale-[0.98] w-full flex-col h-full bg-white cursor-pointer hover:brightness-[94%] flex justify-center items-center'>
                    <div className='absolute text-center flex flex-col items-center'>
                        <FaFileExcel className='text-[30px]' />
                        <p className='mt-8'>Tambahkan file excel</p>
                    </div>
                    <input accept=".xlsx, .xls" type="file" name='excel' onChange={(e: any) => onChange(e)} className='w-full bg-white cursor-pointer opacity-0 z-40 h-[30%]' />
                </div>
            </div>
        </form>
    </div>
  )
}

export default PopupUploadFile
