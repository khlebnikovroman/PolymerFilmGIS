import {createSlice} from "@reduxjs/toolkit";
import {GetLayerDto} from "../services/Clients";

type InitialStateType = {
    layers: GetLayerDto[]
}


const initialState: InitialStateType = {
    layers: []
}

const layersSlice = createSlice({
    name: 'layers',
    initialState,
    reducers: {
        addLayer(state, action) {
            state.layers.push(action.payload)
        },
        removeLayer(state, action) {
            state.layers = state.layers.filter(layer => layer.id !== action.payload)
        }
    }
});

export const {addLayer, removeLayer} = layersSlice.actions;

export default layersSlice.reducer;