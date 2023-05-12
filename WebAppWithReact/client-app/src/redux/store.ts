import {configureStore} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import layersSlice from './LayersSlice'


const store = configureStore({
    reducer: {
        layers: layersSlice
    }
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export type RootState = ReturnType<typeof store.getState>

export default store