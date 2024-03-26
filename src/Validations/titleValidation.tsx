import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service';
import capitalizeEveryWord from '../Helpers/capitalizeEveryWord';

export const useTitleFormik = ({onError, onResponse, dinasID}: {onError?: any, onResponse?: any, dinasID?: string}) => {
    const formik = useFormik<any>({
        initialValues: {
            title: '',
        },
        validationSchema: Yup.object({
            title: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                console.log(dinasID)

                const data = {
                    dinas_id: dinasID,
                    title: capitalizeEveryWord(values.title)
                }
                
                const response = await API.addTitle(data)
                
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