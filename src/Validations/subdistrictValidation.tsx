import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';

export const useSubdistrictFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
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
                const response = await API.addSubdistrict(values)
                console.log(response)
                
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

    return formik
}