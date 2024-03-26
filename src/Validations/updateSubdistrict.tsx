import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import { useEffect } from 'react';

export const useUpdateSubdistrictFormik = ({onError, onResponse, data}: {onError?: any, onResponse?: any, data?: any}) => {
    const formik = useFormik<any>({
        initialValues: {
            name_subdistrict: '',
            lat: '',
            long: ''
        },
        validationSchema: Yup.object({
            name_subdistrict: Yup.string()
            .min(4, 'Minimal 4 karakter')
            .required('Tidak boleh kosong!'),
            lat: Yup.string()
            .required('Tidak boleh kosong!'),
            long: Yup.string()
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const dataNow = {
                    name_subdistrict: values.name_subdistrict,
                    subdistrict_id: data() ? data().id : '',
                    lat: values.lat,
                    long: values.long
                }

                console.log('data now:', dataNow)

                const response = await API.updateSubdistrict(dataNow)
                
                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                    resetForm()
                }
            } catch (error: any) {
                onError(error.message)
                resetForm()
            }
        }
    })

    useEffect(() => {
        if(data) {
            const dataObj = typeof data === 'function' ? data() : data;
            formik.setValues({
                name_subdistrict: dataObj.name ?? ' ',
                lat: dataObj.lat ?? '',
                long: dataObj.long ?? '',
            })
        }
    }, [data])

    return formik
}