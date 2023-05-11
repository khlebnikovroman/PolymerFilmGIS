import L from 'leaflet';
import {createLayerComponent, LayerProps} from '@react-leaflet/core';
import 'leaflet.webgl-temperature-map';

interface WebGlTemperatureMapLayerProps extends L.WebGlTemperatureMapLayerOptions, LayerProps {
    data: number[][];
}

const WebGlTemperatureMapLayer = createLayerComponent<
    L.WebGlTemperatureMapLayer,
    WebGlTemperatureMapLayerProps
>(
    function createWebGlTemperatureMapLayer(props, context) {
        const {data, ...options} = props;

        const layer = new L.WebGlTemperatureMapLayer(options);

        const container = context.layerContainer || context.map;
        container.addLayer(layer);
        layer.setPoints(data, {draw: true, isLatLng: true});


        return {
            instance: layer,
            context: {
                ...context,
                container: layer,
            },
        };
    },

    function updateWebGlTemperatureMapLayer(layer, props, prevProps) {
        const {data, ...options} = props;
        //layer.setOptions({draw: true, isLatLng:true});
        layer.setPoints(data, {draw: true, isLatLng: true});
        layer.needRedraw();
    }
);

export default WebGlTemperatureMapLayer;
