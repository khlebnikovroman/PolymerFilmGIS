import {createLayerComponent, LayerProps} from '@react-leaflet/core';

// @ts-ignore
import {IdwLayer} from "./leaflet-idw";

export interface IdwLayerOptions extends LayerProps {
    opacity?: number;
    maxZoom?: number;
    cellSize?: number;
    exp?: number;
    redrawfinish?: ((min: number, max: number) => void) | undefined
    displayValue?: {
        min: number;
        max: number;
    };
    gradient?: Record<number, string>;
}

interface IdwLayerProps extends IdwLayerOptions {
    latlngs?: [number, number, number][]
}

const IdwMapLayer = createLayerComponent<IdwLayer, IdwLayerProps>(
    function createIdwMapLayer(props, context) {
        const {latlngs, ...options} = props;

        const layer = new IdwLayer(latlngs!, options);

        const container = context.layerContainer || context.map;
        container.addLayer(layer);

        return {
            instance: layer,
            context: {
                ...context,
                container: layer,
            },
        };
    },
    function updateIdwMapLayer(instance, props, prevProps) {

        if (instance._idw) {
            instance._idw.clear()
        }
        instance.setLatLngs(props.latlngs);
        if (props != null && props !== prevProps) {
            instance.setOptions(props);
        }
        instance._redraw();
    }
);

export default IdwMapLayer;