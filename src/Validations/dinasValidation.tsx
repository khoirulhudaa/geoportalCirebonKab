import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';

export const useDinasFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
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
            try {
                const response = await API.addDinas(values)
                console.log('res', response)
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