import {GetLayerDto} from "../../../services/Clients";

type SwitchableLayer = {
    layer: GetLayerDto,
    isVisible: boolean
}
type LayersState = {
    layers: SwitchableLayer[]
}

type LayersAction = {
    type: string,
    layerKey: string
}

type DispatchType = (args: LayersAction) => LayersAction
