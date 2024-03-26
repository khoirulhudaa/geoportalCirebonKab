import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../Services/service.tsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { authSignIn, saveToken } from '../Store/authSlice.tsx';

export const useSignInFormik = ({onError}: {onError?: any}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
  const abortController = new AbortController()
  const abortSignal = abortController.signal

  
  const formik = useFormik<any>({
    initialValues: {
        email: '',
        password: '',
    },
    validationSchema: Yup.object({
        email: Yup.string()
        .email('Format email tidak sesuai!')
        .required('Tidak boleh kosong!'),
        password: Yup.string()
        .min(8, 'Minimal 18 karakter')
        .required('Tidak boleh kosong!'),
    }),
    onSubmit: async (values: any, {resetForm}) => {
        try {
        
        if(abortSignal.aborted) return
        
        const response = await API.checkAccount(values);
        if (response.data.status === 200) {
            resetForm()
            console.log(response.data.data)
            dispatch(authSignIn(response.data.data))
            dispatch(saveToken(response.data.token))
            navigate('/home')
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