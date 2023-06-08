/*
 based on https://github.com/spatialsparks/Leaflet.idw
*/
import L from "leaflet"
import {isInPolygon} from "./geojsonHelper"
import {RussiaBoundsClient} from "../../services/Clients";

class heatMap {

    defaultCellSize = 20
    defaultGradient = {
        0: '#00E3E500',
        0.1: '#00E19F',
        0.2: '#00DD5A',
        0.3: '#00D917',
        0.4: '#29D500',
        0.5: '#67D200',
        0.6: '#A3CE00',
        0.7: '#CAB700',
        0.8: '#C67800',
        0.9: '#C23B00',
        1: '#BF0000'
    }

    constructor(canvas) {
        if (!(this instanceof heatMap)) return new heatMap(canvas);

        this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;

        this._max = Number.MIN_SAFE_INTEGER;
        this._min = Number.MAX_SAFE_INTEGER;
        this._displayValue = undefined;

        this._data = [];

        this._redrawFinish = undefined; // callback
    }

    data(data) {
        this._data = data;
        return this;
    }

    max(max) {
        this._max = max;
        return this;
    }

    min(min) {
        this._min = min;
        return this;
    }

    displayValue(displayValue) {
        this._displayValue = displayValue;
        return this;
    }

    redrawFinish(callback) {
        this._redrawFinish = callback;
        return this;
    }

    add(point) {
        this._data.push(point);
        return this;
    }

    clear() {
        this._data = [];
        return this;
    }

    cellSize(r) {
        var cell = this._cell = document.createElement("canvas"),
            ctx = cell.getContext('2d');

        this._r = r;


        return this;
    }

    resize() {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }

    gradient(grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;

        return this;
    }

    clear() {
        this._ctx.clearRect(0, 0, this._width, this._height);
    }


    draw(opacity) {
        if (!this._cell) this.cellSize(this.defaultCellSize);
        if (!this._grad) this.gradient(this.defaultGradient);

        var ctx = this._ctx;
        var grad = this._grad;

        ctx.clearRect(0, 0, this._width, this._height);

        let min = this._min;
        let max = this._max;

        if (this._displayValue) {
            min = this._displayValue.min;
            max = this._displayValue.max;
        }

        for (var i = 0, len = this._data.length, p; i < len; i++) {
            var p = this._data[i];

            let value = p[2]

            if (this._displayValue) {
                if (value < this._displayValue.min) {
                    value = this._displayValue.min
                }

                if (value > this._displayValue.max) {
                    value = this._displayValue.max
                }
            }


            var j = Math.round(((value - min) / (max - min)) * 255) * 4;
            let alpha = opacity * grad[j + 3] / 255
            ctx.fillStyle = 'rgba(' + grad[j] + ',' + grad[j + 1] + ',' + grad[j + 2] + ',' + alpha + ')';
            ctx.fillRect(p[0] - this._r, p[1] - this._r, this._r, this._r);
        }

        if (typeof this._redrawFinish == "function") {
            if (this._displayValue) {
                this._redrawFinish(this._displayValue.min, this._displayValue.max);
            } else {
                this._redrawFinish(this._min, this._max);
            }
        }
        return this;
    }

}

export const GaussHeatMap = L.Layer.extend({
    initialize: function (latlngs, options) {
        const client = new RussiaBoundsClient()
        const promise = client.russiaBounds()
            .then((res) => {
                this._polygon = res;
            })
            .then(() => {
                this._latlngs = latlngs;
                L.setOptions(this, options);
            });
        return promise.then(() => {
        })
    },

    setLatLngs: function (latlngs) {
        this._latlngs = latlngs;
        if (!(!this._polygon || !this._map || !this._latlngs || this._latlngs.length === 0)) {
            let minmax = this._findMinMax()
            this._heatmap.min(minmax.min)
            this._heatmap.max(minmax.max)
            console.log(minmax)
        }
        return this.redraw();
    },

    findMinMaxInRussia: function () {

    },

    addLatLng: function (latlng) {
        this._latlngs.push(latlng);
        return this.redraw();
    },

    setOptions: function (options) {
        L.setOptions(this, options);
        if (this._heatmap) {
            this._updateOptions();
        }
        return this.redraw();
    },

    redraw: function () {
        if (this._heatmap && !this._frame && !this._map._animating) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },

    onAdd: function (map) {
        this._map = map;

        if (!this._canvas) {
            this._initCanvas();
        }

        map._panes.overlayPane.appendChild(this._canvas);

        map.on('moveend', this._reset, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off('moveend', this._reset, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    getMax: function () {
        return this._heatmap._max
    },

    getMin: function () {
        return this._heatmap._min
    },

    _initCanvas: function () {
        var canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');

        var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        canvas.style[originProp] = '50% 50%';

        var size = this._map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        this._heatmap = new heatMap(canvas);
        this._updateOptions();
    },

    _updateOptions: function () {
        this._heatmap.cellSize(this.options.cellSize || this._heatmap.defaultCellSize);

        if (this.options.redrawFinish) {
            this._heatmap.redrawFinish(this.options.redrawFinish);
        }

        this._heatmap.displayValue(this.options.displayValue);

        if (this.options.gradient) {
            this._heatmap.gradient(this.options.gradient);
        }
    },

    _reset: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);

        var size = this._map.getSize();

        if (this._heatmap._width !== size.x) {
            this._canvas.width = this._heatmap._width = size.x;
        }
        if (this._heatmap._height !== size.y) {
            this._canvas.height = this._heatmap._height = size.y;
        }

        this._redraw();
    },


    _redraw: function () {
        if (!this._polygon || !this._map || !this._latlngs || this._latlngs.length === 0) {
            return;
        }
        var r = this._heatmap._r;
        var size = this._map.getSize();
        var bounds = this._calculateBounds(r, size);
        var data = this._calculateData(bounds);
        this._drawData(data);
    },
    _drawData: function (data) {
        this._heatmap.data(data).draw(this.options.opacity);
    },

    _findMinMax: function () {

        let a = 1
        let f = (x, y) => {
            return this._calculateWeight(L.latLng(x, y))
        }
        let fminus = (x, y) => {
            return -this._calculateWeight(L.latLng(x, y))
        }
        let min = Number.MAX_SAFE_INTEGER
        let max = Number.MIN_SAFE_INTEGER
        for (let k = 0; k < this._latlngs.length; k++) {
            let latlngVal = this._latlngs[k]
            let point = this._latLngToPoint(L.latLng(latlngVal[0], latlngVal[1]))
            let scale = L.CRS.EPSG3857.scale(5)
            //todo найти нормальную формуул для вычисления c сейчас как-то очень нестабильно
            let c = Math.sqrt(Math.pow(Math.abs(latlngVal[2]), a) / 2) * 2.35482 / 10
            const localMax = this._findMaxOnGrid(f, latlngVal[0] - c, latlngVal[0] + c, latlngVal[1] - c, latlngVal[1] + c, 100, 3)
            const localMin = -this._findMaxOnGrid(fminus, latlngVal[0] - c, latlngVal[0] + c, latlngVal[1] - c, latlngVal[1] + c, 100, 3)
            max = Math.max(max, localMax)
            min = Math.min(min, localMin)
            console.log("k= ", latlngVal[2], 'максимальное значение:', max, 'минимальное значение:', min, "c= ", c);
        }
        return {min: min, max: max}
    },

    _findMaxOnGrid(f, minX, maxX, minY, maxY, cellCount, interationCount) {
        let bestX = minX;
        let bestY = minY;
        let bestValue = f(minX, minY);

        let xStep = (maxX - minX) / cellCount
        let yStep = (maxY - minY) / cellCount

        for (let x = minX; x <= maxX; x += xStep) {
            for (let y = minY; y <= maxY; y += yStep) {
                const value = f(x, y);
                if (value > bestValue) {
                    bestValue = value;
                    bestX = x;
                    bestY = y;
                }
            }
        }
        if (interationCount == 1) {
            return bestValue
        } else {
            return this._findMaxOnGrid(f, bestX - xStep * 2, bestX + xStep * 2, bestY - yStep * 2, bestY + yStep * 2, cellCount, interationCount - 1)
        }
    },

    _findMinMaxInRussia: function () {
        if (!this._polygon || !this._map || !this._latlngs || this._latlngs.length === 0) {
            return;
        }
        var latLngLeftTop = L.latLng(81.858333, 19.638889);
        var latLngRightTop = L.latLng(81.858333, 179.99999);
        var latLngRightBottom = L.latLng(41.185556, 179.99999);
        var pLeftTop = this._map.latLngToContainerPoint(latLngLeftTop)
        var pRightTop = this._map.latLngToContainerPoint(latLngRightTop)
        var pRightBottom = this._map.latLngToContainerPoint(latLngRightBottom)
        var nCellX = 200
        var xdist = pLeftTop.distanceTo(pRightBottom)
        var ydist = pRightTop.distanceTo(pRightBottom)
        var r = xdist / nCellX;
        var nCellY = ydist / r;
        var min = Number.MAX_SAFE_INTEGER;
        var max = Number.MIN_SAFE_INTEGER;
        for (let i = 0; i < nCellY; i++) {
            for (let j = 0; j < nCellX; j++) {
                const x = i * r;
                const y = j * r;

                let weight = 0;

                var cp = L.point((pLeftTop.y + y - (r / 2)), (pLeftTop.x + x + r - (r / 2)));
                var p2 = this._map.containerPointToLatLng(cp);

                if (!isInPolygon(this._polygon, p2)) {
                    continue;
                }

                weight = this._calculateWeight(p2);
                min = Math.min(min, weight)
                max = Math.max(max, weight)
            }
        }

        return {min: min, max: max};
    },

    _calculateData: function (bounds) {
        var r = this._heatmap._r;
        var data = [];

        var nCellX = this._calculateCellCount(bounds, r, 'x');
        var nCellY = this._calculateCellCount(bounds, r, 'y');


        for (let i = 0; i < nCellY; i++) {
            for (let j = 0; j < nCellX; j++) {
                const x = i * r;
                const y = j * r;

                let weight = 0;


                var cp = L.point((y - (r / 2)), (x - (r / 2)));
                var p2 = this._map.containerPointToLatLng(cp);

                if (!isInPolygon(this._polygon, p2)) {
                    continue;
                }

                weight = this._calculateWeight(p2);

                const cell = [j * r, i * r, weight];

                if (cell && !isNaN(weight)) {
                    data.push([
                        Math.round(cell[0]),
                        Math.round(cell[1]),
                        cell[2]
                    ]);
                } else {
                    //console.log(`${i}, ${j}`);
                }
            }
        }

        return data;
    },

    _calculateBounds: function (r, size) {
        return new L.Bounds(
            L.point([-r, -r]),
            size.add([r, r])
        );
    },

    _calculateCellCount: function (bounds, r, axis) {
        var min = bounds.min[axis];
        var max = bounds.max[axis];
        return Math.ceil((max - min) / r) + 1;
    },
    _latLngToPoint: function (point) {
        return L.CRS.EPSG3857.latLngToPoint(point, 5)
    },
    _calculateWeight: function (point) {
        let weight = 0;

        for (let k = 0; k < this._latlngs.length; k++) {
            var p1 = L.latLng(this._latlngs[k][0], this._latlngs[k][1]);
            var ppp = this._latLngToPoint(p1)
            var pp = this._latLngToPoint(point)

            weight += this._gaussFunction(pp.x, pp.y, ppp.x, ppp.y, this._latlngs[k][2], 1)
        }

        return weight;
    },
    _gaussFunction: function (x, y, x0, y0, k, a) {
        const exponent = -(((Math.pow(x - x0, 2)) + (Math.pow(y - y0, 2))) / Math.pow(Math.abs(k), a));
        const ePoweExp = Math.exp(exponent)
        Math.sign()
        return k * ePoweExp;
    },

    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        if (L.DomUtil.setTransform) {
            L.DomUtil.setTransform(this._canvas, offset, scale);

        } else {
            this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
        }
    }
});