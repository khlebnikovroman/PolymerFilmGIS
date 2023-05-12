/*
 (c) 2016, Manuel Bär
 Leaflet.idw, a tiny and fast inverse distance weighting plugin for Leaflet.
 Largely based on the source code of Leaflet.heat by Vladimir Agafonkin (c) 2014
 https://github.com/Leaflet/Leaflet.heat
*/
import L from "leaflet"

class simpleidw {

    defaultCellSize = 20
    defaultGradient = {
        0: '#00E3E5',
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
        if (!(this instanceof simpleidw)) return new simpleidw(canvas);

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
            ctx.fillStyle = 'rgba(' + grad[j] + ',' + grad[j + 1] + ',' + grad[j + 2] + ',' + opacity + ')';
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

//window.simpleidw = simpleidw


export const IdwLayer = L.Layer.extend({
    /*
    options: {
        opacity: 0.5,
        maxZoom: 18,
        cellSize: 1,
        exp: 2,
        redrawFinsih: callback
    },
    */
    initialize: function (latlngs, options) {
        this._latlngs = latlngs;
        L.setOptions(this, options);
    },

    setLatLngs: function (latlngs) {
        this._latlngs = latlngs;
        return this.redraw();
    },

    addLatLng: function (latlng) {
        this._latlngs.push(latlng);
        return this.redraw();
    },

    setOptions: function (options) {
        L.setOptions(this, options);
        if (this._idw) {
            this._updateOptions();
        }
        return this.redraw();
    },

    redraw: function () {
        if (this._idw && !this._frame && !this._map._animating) {
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
        return this._idw._max
    },

    getMin: function () {
        return this._idw._min
    },

    _initCanvas: function () {
        var canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-idwmap-layer leaflet-layer');

        var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        canvas.style[originProp] = '50% 50%';

        var size = this._map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        this._idw = new simpleidw(canvas);
        this._updateOptions();
    },

    _updateOptions: function () {
        this._idw.cellSize(this.options.cellSize || this._idw.defaultCellSize);

        if (this.options.redrawFinish) {
            this._idw.redrawFinish(this.options.redrawFinish);
        }

        this._idw.displayValue(this.options.displayValue);

        if (this.options.gradient) {
            this._idw.gradient(this.options.gradient);
        }
    },

    _reset: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);

        var size = this._map.getSize();

        if (this._idw._width !== size.x) {
            this._canvas.width = this._idw._width = size.x;
        }
        if (this._idw._height !== size.y) {
            this._canvas.height = this._idw._height = size.y;
        }

        this._redraw();
    },

    _redraw: function () {
        if (!this._map) {
            return;
        }

        if (!this._latlngs) {
            return;
        }
        if (this._latlngs.length === 0) {
            return;
        }
        var data = [],
            r = this._idw._r,
            size = this._map.getSize(),
            bounds = new L.Bounds(
                L.point([-r, -r]),
                size.add([r, r])),

            exp = this.options.exp === undefined ? 1 : this.options.exp,
            cellCen = r / 2,
            nCellX = Math.ceil((bounds.max.x - bounds.min.x) / r) + 1,
            nCellY = Math.ceil((bounds.max.y - bounds.min.y) / r) + 1;

        this._idw.min(Number.MAX_SAFE_INTEGER);
        this._idw.max(Number.MIN_SAFE_INTEGER);

        // console.time('process');

        for (let i = 0; i < nCellY; i++) {
            for (let j = 0; j < nCellX; j++) {

                const x = i * r;
                const y = j * r;

                let numerator = 0;
                let denominator = 0;

                let zeroDist = false;
                let zeroDistVal = undefined;

                for (let k = 0; k < this._latlngs.length; k++) {

                    // Get distance between cell and point
                    var p = this._map.latLngToContainerPoint(this._latlngs[k]);
                    var cp = L.point((y - cellCen), (x - cellCen));
                    var dist = cp.distanceTo(p);

                    if (dist === 0) {
                        zeroDist = true;
                        zeroDistVal = this._latlngs[k].alt !== undefined ? this._latlngs[k].alt : this._latlngs[k][2];
                        break;
                    }
                    var dist2 = Math.pow(dist, exp);

                    var val = this._latlngs[k].alt !== undefined ? this._latlngs[k].alt : this._latlngs[k][2];

                    numerator += val / dist2;
                    denominator += 1 / dist2;

                }

                const interpolVal = zeroDist ? zeroDistVal : numerator / denominator;

                const cell = [j * r, i * r, interpolVal];

                if (cell && !isNaN(interpolVal)) {
                    data.push([
                        Math.round(cell[0]),
                        Math.round(cell[1]),
                        cell[2]
                    ]);
                    this._idw.min(Math.min(this._idw._min, cell[2]));
                    this._idw.max(Math.max(this._idw._max, cell[2]));
                } else {
                    console.log(`${i}, ${j}`);
                }
            }
        }

        // console.timeEnd('process');

        // console.time('draw ' + data.length);
        this._idw.data(data).draw(this.options.opacity);
        // console.timeEnd('draw ' + data.length);

        this._frame = null;
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

const idwLayer = function (latlngs, options) {
    return new L.IdwLayer(latlngs, options);
};