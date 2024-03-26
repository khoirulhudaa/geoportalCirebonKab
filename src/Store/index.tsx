// reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import coordinateSlice from "./coordinateSlice";

const rootReducer = combineReducers({
    Auth: authSlice,
    Coordinate: coordinateSlice,
});

export default rootReducer;
