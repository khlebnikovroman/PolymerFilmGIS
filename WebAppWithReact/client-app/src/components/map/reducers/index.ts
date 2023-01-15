import {DispatchType, LayersAction} from "./type";

import {SET_INVISIBLE, SET_VISIBLE} from "./actionTypes";

export function setVisible(key: string) {
    const action: LayersAction = {
        type: SET_VISIBLE,
        layerKey: key
    }
    return func1(action)
}

export function setInvisible(key: string) {
    const action: LayersAction = {
        type: SET_INVISIBLE,
        layerKey: key
    }
    return func1(action)
}

//todo rename
export function func1(action: LayersAction) {
    return (dispath: DispatchType) => {
        dispath(action)
    }
}

