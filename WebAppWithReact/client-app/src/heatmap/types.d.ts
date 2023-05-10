import {Layer} from 'leaflet';
import "leaflet.webgl-temperature-map"

declare module 'leaflet' {
    interface WebGlTemperatureMapLayerOptions {
        idwOptions?: IdwOptions;
    }

    interface IdwOptions {
        p?: number
        canvas?: HTMLCanvasElement
        zIndex?: number

        opacity?: number
        range_factor?: number
        gamma?: number
        debug_points?: boolean // work only for debug - not right position on zoom after move
        framebuffer_factor?: number
        isNullColorized?: boolean, // to transparent background set false
    }

    interface SetPointsOptions {
        isLatLng: boolean
        draw: boolean
    }

    class WebGlTemperatureMapLayer extends Layer {

        constructor(options?: WebGlTemperatureMapLayerOptions);

        // addTo(map: Map | LayerGroup): this {
        //     return super.addTo(map);
        // }

        delegate(del: any): this;

        needRedraw(): this;

        setOptions(options: SetPointsOptions = {isLatLng: true, draw: true});

        setPoints(points?: any[], options?: SetPointsOptions = {isLatLng: true, draw: true}): void;

        setMask(points?: any[], options?: SetPointsOptions = {isLatLng: true, draw: true}): void;
    }

    function webGLTemperatureMapLayer(options): WebGlTemperatureMapLayer;
}