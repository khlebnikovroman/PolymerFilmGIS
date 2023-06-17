import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import layersSlice from './LayersSlice'
import objectSlice from "./ObjectSlice";
import allObjectSlice from "./AllObjectSlice";


const store = configureStore({
    reducer: {
        layers: layersSlice,
        objects: objectSlice,
        allObjects: allObjectSlice
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export type RootState = ReturnType<typeof store.getState>

export default store