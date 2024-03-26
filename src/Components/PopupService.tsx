import React, { useState } from 'react'
import InputField from './InputField'
import { useDinasFormik } from '../Validations/dinasValidation'
import ErrorMessage from './errorMessage'
import { popUpProps } from '../Models/componentInterface'

const PopupService: React.FC<popUpProps> = ({
    handleAlert,
    close
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponse = () => {
        handleAlert()
    }

    const dinasFormik = useDinasFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse
    })

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <form onSubmit={dinasFormik.handleSubmit} className='w-[500px] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <div className='mb-5'>
                <InputField 
                    label='Nama dinas'
                    name='name_dinas'
                    id='dinas'
                    value={dinasFormik.values.name_dinas}
                    onChange={dinasFormik.handleChange}
                    onBlur={dinasFormik.handleBlur}
                    onError={dinasFormik.errors.name_dinas}
                    onTouched={dinasFormik.touched.name_dinas}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Singkatan'
                    name='abbreviation'
                    id='dinas'
                    value={dinasFormik.values.abbreviation}
                    onChange={dinasFormik.handleChange}
                    onBlur={dinasFormik.handleBlur}
                    onError={dinasFormik.errors.abbreviation}
                    onTouched={dinasFormik.touched.abbreviation}
                />
            </div>
            <div className='w-max flex items-center'>
                <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700 text-white'>
                    <p>
                        Tambah sekarang
                    </p>
                </button>
                <button onClick={close} className='w-max ml-4 mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-white border border-black text-black'>
                    <p>
                        Batalkan
                    </p>
                </button>
            </div>
        </form>
    </div>
  )
}

export default PopupService
