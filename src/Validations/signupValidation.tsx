import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service.tsx';

export const useSignUpFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const formik = useFormik<any>({
    initialValues: {
        email: '',
        password: '',
    },
    validationSchema: Yup.object({
        email: Yup.string()
        .min(3, 'Minimal 3 karakter')
        .required('Tidak boleh kosong!.'),
        password: Yup.string()
        .min(8, 'Minimal 8 karakter')
        .required('Tidak boleh kosong!'),
    }),
    onSubmit: async (values: any, {resetForm}) => {
        try {
        
        if(abortSignal.aborted) return
        
        const response = await API.createAccount(values);
        if (response.data.status === 200) {
            onResponse(response.data.message)
            resetForm()
        } else {
            onError(response.data.message)
        }
        
        } catch (error: any) {
            onError(error.message)
        }
    }
  });

  return formik
};