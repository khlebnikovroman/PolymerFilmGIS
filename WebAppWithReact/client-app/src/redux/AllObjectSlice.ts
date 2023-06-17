import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetObjectOnMapDto} from "../services/Clients";

type InitialStateType = {
    objects: GetObjectOnMapDto[]
}

let initialState: InitialStateType = {
    objects: []
}

const allObjectsWithoutLayerSlice = createSlice({
    name: 'allObjects',
    initialState,
    reducers: {
        setMarker(state, action: PayloadAction<GetObjectOnMapDto[]>) {
            state.objects = action.payload
        },
        addMarker(state, action: PayloadAction<GetObjectOnMapDto>) {
            state.objects.push(action.payload)
        },
        removeMarker(state, action: PayloadAction<string>) {
            state.objects = state.objects.filter(layer => layer.id !== action.payload)
        },
        editMarker(state, action: PayloadAction<GetObjectOnMapDto>) {
            const index = state.objects.findIndex((item) => item.id === action.payload.id);
            state.objects[index] = action.payload;
        }
    }
});

export const { setMarker, addMarker, removeMarker, editMarker} = allObjectsWithoutLayerSlice.actions;

export default allObjectsWithoutLayerSlice.reducer;