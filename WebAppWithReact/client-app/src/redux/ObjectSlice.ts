import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetObjectOnMapDto} from "../services/Clients";

type InitialStateType = {
    objects: GetObjectOnMapDto[]
}


let initialState: InitialStateType = {
    objects: []
}

const objectsWithoutLayerSlice = createSlice({
    name: 'objects',
    initialState,
    reducers: {
        setObjects(state, action: PayloadAction<GetObjectOnMapDto[]>) {
            state.objects = action.payload
        },
        addObject(state, action: PayloadAction<GetObjectOnMapDto>) {
            state.objects.push(action.payload)
        },
        removeObject(state, action: PayloadAction<string>) {
            state.objects = state.objects.filter(layer => layer.id !== action.payload)
        },
        editObject(state, action: PayloadAction<GetObjectOnMapDto>) {
            const index = state.objects.findIndex((item) => item.id === action.payload.id);
            state.objects[index] = action.payload;
        }
    }
});

export const {setObjects, addObject, removeObject, editObject} = objectsWithoutLayerSlice.actions;

export default objectsWithoutLayerSlice.reducer;