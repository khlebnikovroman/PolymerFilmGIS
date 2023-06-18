import {GetUserSettingsDTO} from "../services/Clients";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


type InitialStateType = {
    settings: GetUserSettingsDTO
}

let initialState: InitialStateType = {
    settings: new GetUserSettingsDTO
}

const UserSettingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings(state, action: PayloadAction<GetUserSettingsDTO>) {
            state.settings = action.payload;
        }
    }
});

export const { setSettings } =  UserSettingsSlice.actions;

export default UserSettingsSlice.reducer;