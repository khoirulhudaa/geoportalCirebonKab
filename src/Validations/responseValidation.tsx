import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import store from '../Store/store';

export const useResponseFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
    console.log(1)
    const coordinates: any = store.getState().Coordinate.coordinate
    console.log('cor:', coordinates)

    const formik = useFormik<any>({
        initialValues: {
            username: '',
            email: '',
            response: '',  
        },
        validationSchema: Yup.object({
            username: Yup.string()
            .min(2, 'Minimal 2 karakter')
            .required('Tidak boleh kosong!'),
            email: Yup.string()
            .email('Fromat tidak sesuai')
            .required('Tidak boleh kosong!'),
            response: Yup.string()
            .min(10, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const response = await API.addResponse(values)
                console.log('reponse masukan', response)

                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
                    resetForm()
                }
            } catch (error: any) {
                console.log('error:', error)
                onError(error.message)
                resetForm()
            }
        }
    })

    return formik
}