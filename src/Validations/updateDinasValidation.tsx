import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import { useEffect } from 'react';

export const useUpdateDinasFormik = ({onError, onResponse, data}: {onError?: any, onResponse?: any, data?: any}) => {
    console.log(1)
    const formik = useFormik<any>({
        initialValues: {
            name_dinas: '',
            abbreviation: ''
        },
        validationSchema: Yup.object({
            name_dinas: Yup.string()
            .min(5, 'Minimal 5 karakter')
            .required('Tidak boleh kosong!'),
            abbreviation: Yup.string()
            .min(5, 'Minimal 5 karakter')
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            console.log(2)
            try {
                console.log(3)
                
                console.log('values:', values)
                const dataNew = {
                    name_dinas: values.name_dinas ?? '',
                    abbreviation: values.abbreviation ?? '',
                    dinas_id: data.dinas_id ?? '',
                }   
                console.log('ok' ,dataNew)
                const response = await API.updateDinas(dataNew)
                console.log('res:', response)
                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                    resetForm()
                }
            } catch (error: any) {
                console.log(4)
                onError(error.message)
                resetForm()
            }
        }
    })

    useEffect(() => {
        if(data) {
            const dataObj = typeof data === 'function' ? data() : data;
            formik.setValues({
                name_dinas: dataObj.name_dinas ?? ' ',
                abbreviation: dataObj.abbreviation ?? '',
            })
        }
    }, [data])

    return formik
}