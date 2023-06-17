import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetObjectOnMapDto} from "../services/Clients";

type InitialStateType = {
    allObjects: GetObjectOnMapDto[]
}

let initialState: InitialStateType = {
    allObjects: []
}

const allObjectsSlice = createSlice({
    name: 'allObjects',
    initialState,
    reducers: {
        setAllObjects(state, action: PayloadAction<GetObjectOnMapDto[]>) {
            state.allObjects = action.payload;
        },
        addObject(state, action: PayloadAction<GetObjectOnMapDto>) {
            const newState = state.allObjects.slice();
            newState.push(action.payload);
            state.allObjects = newState;
        },
        removeObject(state, action: PayloadAction<string>) {
            state.allObjects = state.allObjects.filter(object => object.id !== action.payload);
        },
        editObject(state, action: PayloadAction<GetObjectOnMapDto>) {
            const newState = state.allObjects.slice();
            const index = newState.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                newState[index] = action.payload;
                state.allObjects = newState;
            }
        }
    }
});

export const { setAllObjects, addObject, removeObject, editObject} = allObjectsSlice.actions;

export default allObjectsSlice.reducer;