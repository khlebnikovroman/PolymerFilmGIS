import {LayersAction, LayersState} from "./type";
import {SET_INVISIBLE, SET_VISIBLE} from "./actionTypes"

const initialState: LayersState = {
    layers: []
}

const reducer = (
    state: LayersState = initialState,
    action: LayersAction
): LayersState => {
    switch (action.type) {
        case SET_VISIBLE:
            const visibleLayer = state.layers.find(x => x.layer.id == action.layerKey);
            visibleLayer!.isVisible = true;
            return {
                ...state,
                layers: state.layers,
            }
        case SET_INVISIBLE:
            const invisibleLayer = state.layers.find(x => x.layer.id == action.layerKey);
            invisibleLayer!.isVisible = false;
            return {
                ...state,
                layers: state.layers,
            }
    }
    return state
}

export default reducer