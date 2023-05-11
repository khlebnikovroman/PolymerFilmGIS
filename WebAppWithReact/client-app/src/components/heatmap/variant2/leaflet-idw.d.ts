// import L, {LatLngExpression, Layer, LayerGroup} from "leaflet";
// import {LayerProps} from "@react-leaflet/core";
// import "leaflet.idw"
// declare  module "leaflet" {
//     export class IdwLayer extends L.Layer {
//         constructor(latlngs: number[][], options?: IdwLayerOptions): IdwLayer;
//         setLatLngs(latlngs: number[][]): this;
//         addLatLng(latlng: number[]): this;
//         setOptions(options: IdwLayerOptions): this;
//         redraw(): this;
//         getMax(): number;
//         getMin(): number;
//     }
//     export interface IdwLayerOptions extends LayerProps {
//         opacity?: number;
//         maxZoom?: number;
//         cellSize?: number;
//         exp?: number;
//         redrawFinish?: () => void;
//         displayValue?: {
//             min: number;
//             max: number;
//         };
//         gradient?: Record<number, string>;
//     }
//
// }
//
