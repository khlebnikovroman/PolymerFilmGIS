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
        addObjectToAll(state, action: PayloadAction<GetObjectOnMapDto>) {
            const newState = state.allObjects.slice();
            newState.push(action.payload);
            state.allObjects = newState;
        },
        removeObjectFromAll(state, action: PayloadAction<string>) {
            state.allObjects = state.allObjects.filter(object => object.id !== action.payload);
        },
        editObjectFromAll(state, action: PayloadAction<GetObjectOnMapDto>) {
            const newState = state.allObjects.slice();
            const index = newState.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                newState[index] = action.payload;
                state.allObjects = newState;
            }
        }
    }
});

export const { setAllObjects, addObjectToAll, removeObjectFromAll, editObjectFromAll} = allObjectsSlice.actions;

export default allObjectsSlice.reducer;