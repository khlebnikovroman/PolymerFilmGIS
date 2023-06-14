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
            const layers = state.layers.slice()
            const index = layers.findIndex((item) => item.id === action.payload.id);
            layers[index].isSelectedByUser = action.payload.selection;
            state.layers = layers
        },
        // editLayer(state, action: PayloadAction<GetLayerDto|UpdateLayerDto>){
        //     const layers = state.layers.slice()
        //     const item = layers.find((item) => item.id === action.payload.id);
        //     if (item){
        //         item.name = action.payload.name
        //         item.objects= action.payload.objects
        //     }
        //    
        // },
        addLayer(state, action: PayloadAction<GetLayerDto>) {
            state.layers.push(action.payload)
        },
        removeLayer(state, action: PayloadAction<GetLayerDto>) {
            state.layers = state.layers.filter(layer => layer.id !== action.payload.id)
        }
    }
});

export const {addLayer, removeLayer, setLayers, setSelection} = layersSlice.actions;

export default layersSlice.reducer;