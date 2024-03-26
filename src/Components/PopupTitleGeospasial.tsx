import React, { useState } from 'react'
import { popUpProps } from '../Models/componentInterface'
import { useTitleFormik } from '../Validations/titleValidation'
import InputField from './InputField'
import ErrorMessage from './errorMessage'

const PopupTitleGeospasial: React.FC<popUpProps> = ({
    handleAlert,
    close,
    dinasID,
    handleStatus
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponse = (response: number) => {
        if(response === 200) {
            handleStatus()
            handleAlert()
        }
    }

    const titleFormik = useTitleFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse,
        dinasID
    })

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700    bg-opacity-[0.7]'>
        <form onSubmit={titleFormik.handleSubmit} className='w-[600px] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <InputField 
                label='Judul data geospasial'
                name='title'
                id='title'
                value={titleFormik.values.title}
                onChange={titleFormik.handleChange}
                onBlur={titleFormik.handleBlur}
                onError={titleFormik.errors.title}
                onTouched={titleFormik.touched.title}
            />
            <div className='w-max flex items-center'>
                <button type='submit' className='w-max mt-5 hover:brightness-[90%] active:scale-[0.99] duration-100 h-max flex items-center px-5 py-3 rounded-full text-[14px] bg-slate-700     text-white'>
                    <p>
                        Tambah judul
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

export default PopupTitleGeospasial
