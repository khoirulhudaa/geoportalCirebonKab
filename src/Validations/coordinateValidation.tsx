import { useFormik } from 'formik';
import * as Yup from 'yup';
import { coordinateProps } from '../Models/apiInterface';
import API from '../Services/service';

export const useCoordinateFormik = ({onError, onResponse, titleID, condition}: {onError?: any, onResponse?: any, titleID?: string, condition: any[]}) => {
    const formik = useFormik<coordinateProps>({
        initialValues: {
            name_location: '',
            subdistrict: '',
            lat: '',
            long: '',
            link: '',  
            condition: [],  
        },
        validationSchema: Yup.object({
            name_location: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
            subdistrict: Yup.string()
            .required('Tidak boleh kosong!'),
            lat: Yup.string()
            .required('Tidak boleh kosong!'),
            long: Yup.string()
            .required('Tidak boleh kosong!'),
            link: Yup.string()
            .notRequired(),
            condition: Yup.array()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                console.log('title id:', titleID)
                
                const data = {
                    title_id: titleID,
                    name_location: values.name_location,
                    subdistrict: values.subdistrict,
                    lat: values.lat,
                    long: values.long,
                    link: values.link, 
                    condition: condition,  
                }
                console.log('data coordinate new:', data)
                
                const response = await API.addCoordinate(data)
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