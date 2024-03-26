import api from './axios';

const API = {

    // Account user
    checkAccount: (body: any) => {
        return api.post('/account/signin', body)
    },
    createAccount: (body: any) => {
        return api.post('/account/signup', body)
    },
    updateProfile: (body: any) => {
        return api.post('/account/user', body)
    },
    
    // Dinas
    addDinas: (body: any) => {
        return api.post('/dinas', body)
    },
    getAllDinas: () => {
        return api.get('/dinas')
    },
    removeDinas: (dinas_id: string) => {
        return api.post(`/dinas/${dinas_id}`)
    },
    updateDinas: (body: any) => {
        return api.post('/dinas/update', body)
    },
    
    // Title
    addTitle: (body: any) => {
        return api.post('/judul-data', body)
    },
    getAllTitle: () => {
        return api.get('/judul-data')
    },
    getAllTitleUser: () => {
        return api.get('/judul-data')
    },
    removeTitle: (title_id: string) => {
        return api.post(`/v2/judul-data/${title_id}`)
    },
    
    // Subdistrict
    addSubdistrict: (body: any) => {
        return api.post('/kecamatan', body)
    },
    getAllSubdistrict: () => {
        return api.get('/kecamatan')
    },
    removeSubdistrict: (subdistrict_id: string) => {
        return api.post(`/kecamatan/${subdistrict_id}`)
    },
    updateSubdistrict: (body: any) => {
        return api.post('/kecamatan/update', body)
    },
    
    // Coordinate
    addCoordinate: (body: any) => {
        return api.post('/coordinate', body)
    },
    removeCoordinate: (body: any) => {
        return api.post('/coordinate/remove', body)
    },
    updateCoordinate: (body: any) => {
        return api.post('/coordinate/update', body)
    },
    customCoordinate: (body: any) => {
        return api.post('/coordinate/custom', body)
    },
    getCustomCoordinate: (title_id: string) => {
        return api.get(`/coordinate/custom/${title_id}`)
    },
    removeCoordinateCustom: (coordinate_id?: string) => {
        return api.post(`/coordinate/delete/custom/${coordinate_id}`)
    },

    // Response
    addResponse: (body: any) => {
        return api.post('/response-user', body)
    },
}

export default API;