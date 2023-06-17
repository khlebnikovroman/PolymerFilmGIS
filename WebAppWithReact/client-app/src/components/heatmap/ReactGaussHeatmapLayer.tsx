import {createLayerComponent, LayerProps} from '@react-leaflet/core';

// @ts-ignore
import {GaussHeatMap} from "./gaussHeatmap";

export interface GaussHeatmapLayerOptions extends LayerProps {
    maxDistance?: number;
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

interface GaussHeatmapLayerProps extends GaussHeatmapLayerOptions {
    latlngs?: [number, number, number, number][]
}

// @ts-ignore
const ReactGaussHeatmapLayer = createLayerComponent<GaussHeatMap, GaussHeatmapLayerProps>(
    function createGaussHeatMapLayer(props, context) {
        const {latlngs, ...options} = props;

        // @ts-ignore
        const layer = new GaussHeatMap(latlngs!, options);

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
    function updateGaussHeatmapLayer(instance, props, prevProps) {

        if (instance._heatmap) {
            instance._heatmap.clear()
        }
        instance.setLatLngs(props.latlngs);
        if (props != null && props !== prevProps) {
            instance.setOptions(props);
        }
        instance._redraw();
    }
);

export default ReactGaussHeatmapLayer;