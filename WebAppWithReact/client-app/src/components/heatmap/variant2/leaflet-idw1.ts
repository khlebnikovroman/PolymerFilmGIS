// import L from "leaflet"
// import {LayerProps} from "@react-leaflet/core";
// class SimpleIDW {
//     private _canvas: HTMLCanvasElement ;
//     private _ctx: CanvasRenderingContext2D;
//     _width: number = 0;
//     _height: number = 0;
//     _max: number = Number.MIN_SAFE_INTEGER;
//     _min: number = Number.MAX_SAFE_INTEGER;
//     private _displayValue: { min: number, max: number } | undefined;
//     private _data: Array<[number, number, number]> = [];
//     private _redrawFinish: ((min: number, max: number) => void) | undefined;
//
//     private _cell?: HTMLCanvasElement;
//     _r?: number;
//     private _grad?: Uint8ClampedArray;
//
//     public defaultCellSize: number = 20;
//
//     public defaultGradient: { [key: number]: string } = {
//         0: '#00E3E5',
//         0.1: '#00E19F',
//         0.2: '#00DD5A',
//         0.3: '#00D917',
//         0.4: '#29D500',
//         0.5: '#67D200',
//         0.6: '#A3CE00',
//         0.7: '#CAB700',
//         0.8: '#C67800',
//         0.9: '#C23B00',
//         1: '#BF0000'
//     };
//
//     constructor(canvas: HTMLCanvasElement) {
//         this._canvas = canvas;
//         this._ctx = canvas.getContext('2d')!;
//         this._width = canvas.width;
//         this._height = canvas.height;
//     }
//
//     public data(data: Array<[number, number, number]>): this {
//         this._data = data;
//         return this;
//     }
//
//     public max(max: number): this {
//         this._max = max;
//         return this;
//     }
//
//     public min(min: number): this {
//         this._min = min;
//         return this;
//     }
//
//     public displayValue(displayValue: { min: number, max: number }): this {
//         this._displayValue = displayValue;
//         return this;
//     }
//
//     public redrawFinish(callback: (min: number, max: number) => void): this {
//         this._redrawFinish = callback;
//         return this;
//     }
//
//     public add(point: [number, number, number]): this {
//         this._data.push(point);
//         return this;
//     }
//
//     public clear(): this {
//         this._data = [];
//         return this;
//     }
//
//     public cellSize(r: number): this {
//         const cell = this._cell = document.createElement("canvas");
//         const ctx = cell.getContext('2d')!;
//
//         this._r = r;
//
//         return this;
//     }
//
//     public resize(): void {
//         this._width = this._canvas.width;
//         this._height = this._canvas.height;
//     }
//
//     public gradient(grad: { [key: number]: string }): this {
//         // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext('2d')!;
//         const gradient = ctx.createLinearGradient(0, 0, 0, 256);
//
//         canvas.width = 1;
//         canvas.height = 256;
//
//         for (const i in grad) {
//             gradient.addColorStop(+i, grad[i]);
//         }
//
//         ctx.fillStyle = gradient;
//         ctx.fillRect(0, 0, 1, 256);
//
//         this._grad = ctx.getImageData(0, 0, 1, 256).data;
//
//         return this;
//     }
//
//     public draw(opacity: number): this {
//         if (!this._cell) this.cellSize(this.defaultCellSize);
//         if (!this._grad) this.gradient(this.defaultGradient);
//
//         const ctx = this._ctx;
//         const grad = this._grad!;
//
//         ctx.clearRect(0, 0, this._width, this._height);
//
//         let min = this._min;
//         let max = this._max;
//
//         if (this._displayValue) {
//             min = this._displayValue.min;
//             max = this._displayValue.max;
//         }
//
//         for (let i = 0, len = this._data.length, p; i < len; i++) {
//             const p = this._data[i];
//
//             let value = p[2];
//
//             if (this._displayValue) {
//                 if (value < this._displayValue.min) {
//                     value = this._displayValue.min;
//                 }
//
//                 if (value > this._displayValue.max) {
//                     value = this._displayValue.max;
//                 }
//             }
//
//             const j = Math.round(((value - min) / (max - min)) * 255) * 4;
//             ctx.fillStyle = `rgba(${grad[j]}, ${grad[j + 1]}, ${grad[j + 2]}, ${opacity})`;
//             ctx.fillRect(p[0] - this._r!, p[1] - this._r!, this._r!, this._r!);
//         }
//
//         if (typeof this._redrawFinish == "function") {
//             if (this._displayValue) {
//                 this._redrawFinish(this._displayValue.min, this._displayValue.max);
//             } else {
//                 this._redrawFinish(this._min, this._max);
//             }
//         }
//
//         return this;
//     }
// }
//
// (window as any).SimpleIDW = SimpleIDW;
//
//
// export interface IdwLayerOptions extends LayerProps {
//     opacity?: number;
//     maxZoom?: number;
//     cellSize?: number;
//     exp?: number;
//     redrawfinish?: ((min: number, max: number) => void) | undefined
//     displayValue?: {
//         min: number;
//         max: number;
//     };
//     gradient?: Record<number, string>;
// }
//
// export default class IdwLayer extends L.Layer {
//     private _latlngs: [number,number,number][];
//     private _canvas: HTMLCanvasElement| undefined;
//     private _idw: SimpleIDW | undefined;
//     private _frame: number| null= null;
//     private _idwOptions: IdwLayerOptions
//
//     constructor(latlngs: any[], options: IdwLayerOptions) {
//         super(options);
//         this._idwOptions = options;
//         this._latlngs = latlngs;
//         L.setOptions(this, options);
//     }
//
//     public setLatLngs(latlngs: [number,number,number][]): this {
//         this._latlngs = latlngs;
//         return this.redraw();
//     }
//
//     public addLatLng(latlng: [number,number,number]): this {
//         this._latlngs.push(latlng);
//         return this.redraw();
//     }
//
//     public setOptions(options: L.LayerOptions): this {
//         L.setOptions(this, options);
//         if (this._idw) {
//             this._updateOptions();
//         }
//         return this.redraw();
//     }
//
//     public redraw(): this {
//         if (this._idw && !this._frame) {
//             this._frame = L.Util.requestAnimFrame(this._redraw, this);
//         }
//         return this;
//     }
//
//     public  onAdd(map: L.Map) {
//         this._map = map;
//
//         if (!this._canvas) {
//             this._initCanvas();
//         }
//
//         map.getPane("overlayPane")!.appendChild(this._canvas!);
//
//         map.on('moveend', this._reset, this);
//
//         if (map.options.zoomAnimation && L.Browser.any3d) {
//             map.on('zoomanim', this._animateZoom, this);
//         }
//
//         this._reset();
//         return this;
//     }
//
//     public onRemove(map: L.Map) {
//         map.getPanes().overlayPane.removeChild(this._canvas!);
//
//         map.off('moveend', this._reset, this);
//
//         if (map.options.zoomAnimation) {
//             map.off('zoomanim', this._animateZoom, this);
//         }
//         return this;
//     }
//
//     public addTo(map: L.Map): this {
//         map.addLayer(this);
//         return this;
//     }
//
//     public getMax(): number {
//         return this._idw!._max;
//     }
//
//     public getMin(): number {
//         return this._idw!._min;
//     }
//
//     private _initCanvas(): void {
//         const canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-idwmap-layer leaflet-layer') as HTMLCanvasElement;
//        
//         const originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']) as string;
//
//         // @ts-ignore
//         canvas.style[originProp] = '50% 50%';
//
//
//         const size = this._map.getSize();
//         canvas.width = size.x;
//         canvas.height = size.y;
//
//         const animated = this._map.options.zoomAnimation && L.Browser.any3d;
//         L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
//
//         this._idw = new SimpleIDW(canvas);
//         this._updateOptions();
//     }
//
//     private _updateOptions(): void {
//         this._idw!.cellSize(this._idwOptions.cellSize || this._idw!.defaultCellSize);
//
//         if (this._idwOptions.redrawfinish) {
//             this._idw!.redrawFinish(this._idwOptions.redrawfinish);
//         }
//
//         this._idw!.displayValue(this._idwOptions.displayValue!);
//
//         if (this._idwOptions.gradient) {
//             this._idw!.gradient(this._idwOptions.gradient);
//         }
//     }
//
//     private _reset(): void {
//         const topLeft = this._map.containerPointToLayerPoint([0, 0]);
//         L.DomUtil.setPosition(this._canvas!, topLeft);
//
//         const size = this._map.getSize();
//
//         if (this._idw!._width !== size.x) {
//             this._canvas!.width = this._idw!._width = size.x;
//         }
//         if (this._idw!._height !== size.y) {
//             this._canvas!.height = this._idw!._height = size.y;
//         }
//
//         this._redraw();
//     }
//
//     private _redraw(): void {
//         if (!this._map) {
//             return;
//         }
//
//         if (this._latlngs.length === 0) {
//             return;
//         }
//
//         const data: [number,number,number][] = [];
//         const r = this._idw!._r!;
//         const size = this._map.getSize();
//         const bounds = new L.Bounds(
//             L.point([-r, -r]),
//             size.add([r, r])
//         );
//
//         const exp = this._idwOptions.exp === undefined ? 1 : this._idwOptions.exp;
//         const cellCen = r / 2;
//         const nCellX = Math.ceil((bounds.max!.x - bounds.min!.x) / r) + 1;
//         const nCellY = Math.ceil((bounds.max!.y - bounds.min!.y) / r) + 1;
//
//         this._idw!.min(Number.MAX_SAFE_INTEGER);
//         this._idw!.max(Number.MIN_SAFE_INTEGER);
//
//         for (let i = 0; i < nCellY; i++) {
//             for (let j = 0; j < nCellX; j++) {
//                 const x = i * r;
//                 const y = j * r;
//
//                 let numerator = 0;
//                 let denominator = 0;
//
//                 let zeroDist = false;
//                 let zeroDistVal = undefined;
//
//                 for (let k = 0; k < this._latlngs.length; k++) {
//                     const p = this._map.latLngToContainerPoint(L.latLng(this._latlngs[k]));
//                     const cp = L.point((y - cellCen), (x - cellCen));
//                     const dist = cp.distanceTo(p);
//
//                     if (dist === 0) {
//                         zeroDist = true;
//                         // @ts-ignore
//                         zeroDistVal = this._latlngs[k].alt !== undefined ? this._latlngs[k].alt : this._latlngs[k][2];
//                         break;
//                     }
//
//                     const dist2 = Math.pow(dist, exp);
//                     // @ts-ignore
//                     const val = this._latlngs[k].alt !== undefined ? this._latlngs[k].alt : this._latlngs[k][2];
//
//                     numerator += val / dist2;
//                     denominator += 1 / dist2;
//                 }
//
//                 const interpolVal = zeroDist ? zeroDistVal : numerator / denominator;
//
//                 const cell = [j * r, i * r, interpolVal];
//
//                 if (cell && !isNaN(interpolVal)) {
//                     data.push([
//                         Math.round(cell[0]),
//                         Math.round(cell[1]),
//                         cell[2]
//                     ]);
//                     this._idw!.min(Math.min(this._idw!._min, cell[2]));
//                     this._idw!.max(Math.max(this._idw!._max, cell[2]));
//                 } else {
//                     console.log(`${i}, ${j}`);
//                 }
//             }
//         }
//
//         this._idw!.data(data).draw(this._idwOptions!.opacity!);
//
//         this._frame = null;
//     }
//
//     private _animateZoom(e: L.ZoomAnimEvent): void {
//         const scale = this._map.getZoomScale(e.zoom);
//        
//         // @ts-ignore
//         const offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
//
//         if (L.DomUtil.setTransform) {
//             L.DomUtil.setTransform(this._canvas!, offset, scale);
//         } else {
//            
//             // @ts-ignore
//             this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
//         }
//     }
// }
export {}