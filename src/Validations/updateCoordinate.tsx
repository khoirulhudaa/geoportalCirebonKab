import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { coordinateProps } from '../Models/apiInterface';
import API from '../Services/service';

export const useUpdateCoordinateFormik = ({onError, onResponse, titleID, condition, data}: {onError?: any, onResponse?: any, titleID?: string, condition?: any, data?: any}) => {
    const formik = useFormik<coordinateProps>({
        initialValues: {
            name_location: '',
            subdistrict: '',
            lat: '',
            long: '',
            link: '',  
            note: '',  
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
            note: Yup.string()
            .notRequired(),
            condition: Yup.array()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                console.log('title id:', titleID)
                
                const newData = {
                    title_id: data.title_id,
                    coordinate_id: data.coordinate_id,
                    name_location: values.name_location,
                    subdistrict: values.subdistrict,
                    lat: values.lat,
                    long: values.long,
                    link: values.link, 
                    note: values.note, 
                    condition: condition,  
                }
                console.log('data coordinate new:', newData)
                
                const response = await API.updateCoordinate(newData)
                console.log('new kor',response)

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
        console.log('now:', data)
        formik.setValues({
            name_location: data ? data.name_location : '',
            subdistrict: data ? data.subdistrict : '',
            lat: data ? data.lat : '',
            long: data ? data.long : '',
            link: data ? data.link : '',  
            note: data ? data.note : '',  
            condition: data ? data.condition : [],  
        })
    }, [data])

    return formik
}