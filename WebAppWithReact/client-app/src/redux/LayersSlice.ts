import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetLayerDto} from "../services/Clients";

type InitialStateType = {
    layers: GetLayerDto[]
}


const initialState: InitialStateType = {
    layers: []
}

interface setSelectionOptions {
    selection: boolean,
    id: string
}
const layersSlice = createSlice({
    name: 'layers',
    initialState,
    reducers: {
        setLayers(state, action: PayloadAction<GetLayerDto[]>) {
            state.layers = action.payload;
        },
        setSelection(state, action: PayloadAction<setSelectionOptions>) {
            const index = state.layers.findIndex((item) => item.id === action.payload.id);
            state.layers[index].isSelectedByUser = action.payload.selection;

        },
        addLayer(state, action) {
            state.layers.push(action.payload)
        },
        removeLayer(state, action) {
            state.layers = state.layers.filter(layer => layer.id !== action.payload)
        }
    }
});

export const {addLayer, removeLayer, setLayers, setSelection} = layersSlice.actions;

export default layersSlice.reducer;