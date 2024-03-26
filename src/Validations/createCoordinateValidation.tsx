import { useFormik } from 'formik';
import * as Yup from 'yup';
import { coordinateProps } from '../Models/apiInterface';
import API from '../Services/service';
import store from '../Store/store';

export const useCustomCoordinateFormik = ({onError, onResponse, titleID, color, danger}: {onError?: any, onResponse?: any, titleID?: string, color?: any, danger?: boolean}) => {
    console.log(1)
    const coordinates: any = store.getState().Coordinate.coordinate
    console.log('cor:', coordinates)

    const formik = useFormik<coordinateProps>({
        initialValues: {
            name: '',
            wide: 0,
            type_area: '',
            type_danger: '',  
            coordinates: [],  
            typeWide: '',
            description: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
            .min(6, 'Minimal 6 karakter')
            .required('Tidak boleh kosong!'),
            description: Yup.string()
            .min(10, 'Minimal 10 karakter')
            .required('Tidak boleh kosong!'),
            type_area: Yup.string()
            .required('Tidak boleh kosong!'),
            type_danger: Yup.string()
            .notRequired(),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const data = {
                    title_id: titleID,
                    name: values.name,
                    type_danger: values.type_danger !== '' && danger ? values.type_danger : '',
                    type_area: values.type_area,
                    color: color ? color?.hex : '-', 
                    description: values.description,
                    wide: values.wide !== 0 ? values.wide : 0,
                    typeWide: values.typeWide !== '' && values.wide !== 0 ? values.typeWide : '-',
                    coordinates: coordinates ?? [],  
                }

                const response = await API.customCoordinate(data)
                console.log('reponse', response)

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