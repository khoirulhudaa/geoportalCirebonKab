import React, { useState } from 'react'
import { popUpProps } from '../Models/componentInterface'
import { useSubdistrictFormik } from '../Validations/subdistrictValidation'
import InputField from './InputField'
import ErrorMessage from './errorMessage'

const PopupSubdistrict: React.FC<popUpProps> = ({
    handleAlert,
    close
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponse = () => {
        handleAlert('Berhasil tambah kecamatan')
        subdistrictFormik.resetForm()
    }

    const subdistrictFormik = useSubdistrictFormik({
        onError: handleErrorMessage,
        onResponse: handleResponse
    })

  return (
    <div className='w-screen h-screen fixed left-0 top-0 flex justify-center items-center z-[999999] bg-slate-700 bg-opacity-[0.7]'>
        <form onSubmit={subdistrictFormik.handleSubmit} className='w-[37%] h-max rounded-[20px] bg-white p-7 border border-slate-300'>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <div className='mb-5'>
                <InputField 
                    label='Nama kecamatan'
                    name='name_subdistrict'
                    id='name_subdistrict'
                    placeholder='Kedawung'
                    value={subdistrictFormik.values.name_subdistrict}
                    onChange={subdistrictFormik.handleChange}
                    onBlur={subdistrictFormik.handleBlur}
                    onError={subdistrictFormik.errors.name_subdistrict}
                    onTouched={subdistrictFormik.touched.name_subdistrict}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Latitude'
                    name='lat'
                    id='lat'
                    placeholder='-632322.3233238'
                    value={subdistrictFormik.values.lat}
                    onChange={subdistrictFormik.handleChange}
                    onBlur={subdistrictFormik.handleBlur}
                    onError={subdistrictFormik.errors.lat}
                    onTouched={subdistrictFormik.touched.lat}
                />
            </div>
            <div className='mb-5'>
                <InputField 
                    label='Longitude'
                    name='long'
                    id='long'
                    placeholder='108732327.3728'
                    value={subdistrictFormik.values.long}
                    onChange={subdistrictFormik.handleChange}
                    onBlur={subdistrictFormik.handleBlur}
                    onError={subdistrictFormik.errors.long}
                    onTouched={subdistrictFormik.touched.long}
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

export default PopupSubdistrict
