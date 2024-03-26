import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface coordinateState {
    coordinate: any[][],
    dinas_id: string,
    title_id: string,
}

const initialState: coordinateState = {
    coordinate: [],
    dinas_id: '',
    title_id: '',
}

const coordinateSlide = createSlice({
    name: 'coordinate',
    initialState,   
    reducers: {
        getCoordinate: (state, action: PayloadAction<any[]>) => {
            state.coordinate.push(action.payload);
        },
        getDinasId: (state, action: PayloadAction<any>) => {
            state.dinas_id = action.payload;
        },
        getTitleId: (state, action: PayloadAction<any>) => {
            state.title_id = action.payload;
        },
        removeCoordinateById: (state, action: PayloadAction<number>) => {
            state.coordinate.splice(action.payload,  1);
        },
        clearCoordinate: (state) => {
            state.coordinate = []
        },
    }
})

export const { getCoordinate, removeCoordinateById, getDinasId, getTitleId, clearCoordinate } = coordinateSlide.actions;
export default coordinateSlide.reducer;

