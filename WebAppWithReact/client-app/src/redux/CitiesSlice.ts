import {CityDto} from "../services/Clients";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type InitialStateType = {
    cities: CityDto[]
}

let initialState: InitialStateType = {
    cities: []
}

const CitiesSlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        setCities(state, action: PayloadAction<CityDto[]>) {
            state.cities = action.payload;
        }
    }
});

export const { setCities } =  CitiesSlice.actions;

export default CitiesSlice.reducer;