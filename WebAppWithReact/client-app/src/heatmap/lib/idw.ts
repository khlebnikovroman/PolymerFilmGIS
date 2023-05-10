export {}
// import {Canvas} from "leaflet";
//
// const vertex_shader_source =
//     '\
//     attribute vec2 position;\
//   \
//     void main(void) {\
//       gl_Position = vec4(position.x*2.0-1.0, position.y*2.0-1.0, 1.0, 1.0);\
//     }\
//   ';
//
// const vertex_shader_stencil_poly =
//     '\
//     attribute vec2 position;\
//     \
//     uniform float scale;\
//     uniform vec2 translation;\
//   \
//     void main(void) {\
//       gl_Position = vec4((position.x*scale-translation.x)*2.0-1.0, 1.0-(position.y*scale-translation.y)*2.0, 1.0, 1.0);\
//     }\
//   ';
//
// const fragment_shader_stencil_poly = '\
// \
//   void main(void) {\
//   \
//      gl_FragColor = vec4(0, 0, 0, 1.0);\
//   }\
// ';
//
// const computation_fragment_shader_source =
//     '\
//     precision highp float;\
//   \
//     uniform float ui;\
//     uniform vec2 xi;\
//     uniform float p;\
//     uniform float scale;\
//     uniform float range_factor;\
//     uniform vec2 screen_size;\
//     uniform vec2 translation;\
//     void main(void) {\
//       vec2 x = vec2((gl_FragCoord.x+translation.x)/screen_size.x, (gl_FragCoord.y+translation.y)/screen_size.y);\
//       float dist = distance(x, xi*scale);\
//       float wi = 1.0/pow(dist, p);\
//       gl_FragColor = vec4(ui*wi*range_factor, wi*range_factor, 0.0, 1.0);\
//     }\
//   ';
//
// const get_draw_fragment_shader_source = ({ isNullColorized }: { isNullColorized?: boolean } = {}): string =>
//     `\
//   precision highp float;\
// \
//   uniform sampler2D computation_texture;\
//   uniform vec2 screen_size;\
//   uniform float gamma;\
//   void main(void) {\
//     vec4 data = texture2D(computation_texture, vec2(gl_FragCoord.x/screen_size.x, 1.0-gl_FragCoord.y/screen_size.y));\
//     float val = data.x/data.y;\
//     vec3 color = vec3(max((val-0.5)*2.0, 0.0), ${
//         isNullColorized ? '1.0 - 2.0*abs(val - 0.5)' : '0.0'
//     }, max((0.5-val)*2.0, 0.0));\
//     gl_FragColor.rgb = pow(color, vec3(1.0/gamma));\
//     gl_FragColor.a = ${isNullColorized ? '1.0' : 'max(abs((0.5 - val)*2.0), abs(max((val-0.5)*2.0, 0.0)))'};\
//   }\
// `;
//
// function get_shader(gl:WebGLRenderingContext, source:string, type:string|number) {
//    
//     if (type === 'fragment') {
//         type = gl.FRAGMENT_SHADER;
//     } else if (type === 'vertex') {
//         type = gl.VERTEX_SHADER;
//     } else {
//         return null;
//     }
//
//     let shader = gl.createShader(type)!;
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);
//
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//         return null;
//     }
//
//     return shader;
// }
//
// function get_program(gl:WebGLRenderingContext, vertex_shader:WebGLShader, fragment_shader:WebGLShader):WebGLProgram {
//     let program = gl.createProgram();
//     gl.attachShader(program!, vertex_shader);
//     gl.attachShader(program!, fragment_shader);
//     gl.linkProgram(program!);
//
//     if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) {
//         console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program!));
//     }
//
//     return program!;
// }
//
// interface ITemperatureMapGlOptions{
//     p: number,
//     canvas: HTMLCanvasElement | null,
//     zIndex: number,
//     opacity: number,
//     range_factor: number,
//     gamma: number,
//     debug_points: boolean, // work only for debug - not right position on zoom after move
//     framebuffer_factor: number,
//     isNullColorized: boolean,
//    
// }
// export class TemperatureMapGlOptions implements ITemperatureMapGlOptions{
//     unit: any;
//     constructor() {
//         this.canvas = null;
//         this.p= 5
//         this.canvas= null
//         this.zIndex= 10
//         this.opacity= 0.35
//         this.range_factor= 0.00390625
//         this.gamma= 2.2
//         this.debug_points= false // work only for debug - not right position on zoom after move
//         this.framebuffer_factor= 1
//         this.isNullColorized= true
//     }
//     canvas: HTMLCanvasElement | null;
//     debug_points: boolean;
//     framebuffer_factor: number;
//     gamma: number;
//     isNullColorized: boolean;
//     opacity: number;
//     p: number;
//     range_factor: number;
//     zIndex: number;
//
//      point_text(val: number) {
//         let v;
//         if (val < 1) v = val.toFixed(2);
//         else if (val < 10) v = val.toFixed(1);
//         else v = Math.round(val);
//         return v;
//         }
//    
// }
//
// let instance = 0;
// export class TemperatureMapGl{
//     private translated_points: any[];
//     private canvas: HTMLCanvasElement;
//     private context:  WebGLRenderingContext | null;
//     private _points: any[];
//     private square_vertices_buffer: WebGLBuffer| null;
//     private computation_program: WebGLProgram| null;
//     private draw_program: WebGLProgram| null;
//     private position_attribute: GLint| null;
//     private computation_framebuffer: WebGLFramebuffer | null;
//     private computation_texture: WebGLTexture | null;
//     private ui_uniform: WebGLUniformLocation | null;
//     private xi_uniform: WebGLUniformLocation | null;
//     private c_screen_size_uniform: WebGLUniformLocation | null;
//     private d_screen_size_uniform: WebGLUniformLocation | null;
//     private range_factor_uniform: WebGLUniformLocation | null;
//     private p_uniform: WebGLUniformLocation | null;
//     private computation_texture_uniform: WebGLUniformLocation | null;
//     private gamma_uniform: WebGLUniformLocation | null;
//     private point_text: any;
//     private p: any;
//     private range_factor: number;
//     private gamma: number;
//     private isNullColorized: boolean;
//     private unit: any;
//     private framebuffer_factor: number;
//     private computation_framebuffer_width: number;
//     private computation_framebuffer_height: number;
//     private scale_uniform: WebGLUniformLocation | null;
//     private mask_points: number[][]|null;
//     private points: number[][]|null;
//     private translated_mask_points: any;
//     private stencil_vertices_buffer: WebGLBuffer | null;
//     private stencil_points_count: number| null = null;
//     private stencil_program: WebGLProgram| null = null;
//     private stencil_position_attribute: GLint| null = null;
//     private stencil_scale_uniform: WebGLUniformLocation | null = null;
//     private stencil_translation_uniform: WebGLUniformLocation | null = null;
//     private translation_uniform: WebGLUniformLocation | null= null;
//     private is_debug_points: boolean;
//     constructor(options: TemperatureMapGlOptions) {
//        
//
//         if (!options.canvas) throw new Error("Don't set canvas");
//
//         instance++;
//
//         let canvas = options.canvas;
//         canvas.style.position = 'absolute';
//         canvas.style.top = '0px';
//         canvas.style.left = '0px';
//         canvas.style.zIndex = options.zIndex.toString();
//         canvas.style.opacity = options.opacity.toString();
//         this.canvas = options.canvas;
//
//         this.context =
//             this.canvas.getContext('webgl', { stencil: true }) //||
//             //this.canvas.getContext('experimental-webgl', { stencil: true });
//         if (!this.context) console.log('Your browser does not support webgl');
//
//         if (!this.context || !this.context.getExtension('OES_texture_float')) {
//             console.log('Your browser does not support float textures');
//             this.context = null;
//         }
//         this.scale_uniform = null;
//         this.mask_points = null;
//         this.points = null;
//         this.stencil_vertices_buffer = null;
//
//         this._points = [];
//         this.translated_points = [];
//         this.square_vertices_buffer = null;
//         this.computation_program = null;
//         this.draw_program = null;
//         this.position_attribute = null;
//         this.computation_framebuffer = null;
//         this.computation_texture = null;
//
//         this.ui_uniform = null;
//         this.xi_uniform = null;
//         this.c_screen_size_uniform = null;
//         this.d_screen_size_uniform = null;
//         this.range_factor_uniform = null;
//         this.p_uniform = null;
//         this.computation_texture_uniform = null;
//         this.gamma_uniform = null;
//
//         this.point_text = options.point_text;
//         this.p = options.p;
//         this.range_factor = options.range_factor;
//         this.gamma = options.gamma;
//         this.isNullColorized = options.isNullColorized;
//
//         this.is_debug_points = options.debug_points;
//         this.unit = options.unit;
//
//         this.framebuffer_factor = options.framebuffer_factor;
//         this.computation_framebuffer_width = 0;
//         this.computation_framebuffer_height = 0;
//
//         this.init_shaders();
//         this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
//     }
//      is_supported() {
//         let canvas = document.createElement('canvas');
//         let context = canvas.getContext('webgl', { stencil: true });
//         return canvas && context && context.getExtension('OES_texture_float');
//     };
//
//     set_points(points: number[][],
//                low_val:number|undefined = undefined,
//                high_val:number|undefined = undefined, 
//                normal_val:number|undefined = undefined,
//                { mask = false } = {}) {
//         if (mask){
//             this.mask_points = points
//         }
//         else {
//             this.points=points;
//         }
//         this[mask ? 'mask_points' : 'points'] = points;
//         if (!this.context) return;
//
//         if (points.length) {
//             let translated_points = [];
//             let min = typeof low_val !== 'undefined' ? Math.min(points[0][2], low_val) : points[0][2];
//             let max = typeof high_val !== 'undefined' ? Math.max(points[0][2], high_val) : points[0][2];
//             let avg = typeof normal_val !== 'undefined' ? normal_val : 0;
//             for (let i = 1; i < points.length; ++i) {
//                 let p = [points[i][0], points[i][1], points[i][2]];
//                 if (p[2] > max) max = p[2];
//                 if (p[2] < min) min = p[2];
//
//                 if (typeof normal_val === 'undefined') avg += p[2] / points.length;
//             }
//
//             let w = this.canvas.width;
//             let h = this.canvas.height;
//             for (let i = 0; i < points.length; ++i) {
//                 let p = [points[i][0], points[i][1], points[i][2]];
//                 p[0] = p[0] / w;
//                 p[1] = p[1] / h;
//
//                 if (p[2] > avg) p[2] = max == avg ? 1.0 : (0.5 * (p[2] - avg)) / (max - avg) + 0.5;
//                 else p[2] = min == avg ? 0.5 : (-0.5 * (avg - p[2])) / (avg - min) + 0.5;
//                 p[2] = Math.max(Math.min(p[2], 1.0), 0.0);
//
//                 if (p[2] > max) max = p[2];
//                 if (p[2] < min) min = p[2];
//
//                 translated_points.push(p);
//             }
//             if (mask){
//                 this.translated_mask_points = translated_points.reduce((result, [lat, lng]) => [...result, lat, lng], [])
//             }
//             else{
//                 this.translated_points = translated_points
//             }
//         }
//     };
//
//      init_buffers() {
//         if (!this.context) return;
//
//         let gl = this.context;
//         this.square_vertices_buffer = gl.createBuffer()!;
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.square_vertices_buffer);
//
//         let vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
//
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//
//         this.stencil_vertices_buffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.stencil_vertices_buffer);
//
//         let stencil_vertices = this.translated_mask_points || [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
//         this.stencil_points_count = stencil_vertices.length / 2;
//
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stencil_vertices), gl.STATIC_DRAW);
//
//         this.computation_framebuffer_width = Math.ceil(this.canvas.width * this.framebuffer_factor);
//         this.computation_framebuffer_height = Math.ceil(this.canvas.height * this.framebuffer_factor);
//
//         this.computation_texture = gl.createTexture();
//         gl.bindTexture(gl.TEXTURE_2D, this.computation_texture);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//
//         gl.texImage2D(
//             gl.TEXTURE_2D,
//             0,
//             gl.RGBA,
//             this.computation_framebuffer_width,
//             this.computation_framebuffer_height,
//             0,
//             gl.RGBA,
//             gl.FLOAT,
//             null
//         );
//
//         this.computation_framebuffer = gl.createFramebuffer();
//         gl.bindFramebuffer(gl.FRAMEBUFFER, this.computation_framebuffer);
//         gl.viewport(0, 0, this.computation_framebuffer_width, this.computation_framebuffer_height);
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.computation_texture, 0);
//
//         gl.bindTexture(gl.TEXTURE_2D, null);
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//     };
//
//      init_shaders() {
//         if (!this.context) return;
//
//         const gl = this.context;
//         const vertex_shader = get_shader(gl, vertex_shader_source, 'vertex')!;
//         const stencil_vertex_shader = get_shader(gl, vertex_shader_stencil_poly, 'vertex')!;
//         const stencil_fragment_shader = get_shader(gl, fragment_shader_stencil_poly, 'fragment')!;
//         const computation_fragment_shader = get_shader(gl, computation_fragment_shader_source, 'fragment')!;
//         const draw_fragment_shader = get_shader(
//             gl,
//             get_draw_fragment_shader_source({ isNullColorized: this.isNullColorized }),
//             'fragment'
//         )!;
//
//         this.stencil_program = get_program(gl, stencil_vertex_shader, stencil_fragment_shader);
//         this.stencil_position_attribute = gl.getAttribLocation(this.stencil_program, 'position');
//         this.stencil_scale_uniform = gl.getUniformLocation(this.stencil_program, 'scale');
//         this.stencil_translation_uniform = gl.getUniformLocation(this.stencil_program, 'translation');
//
//         this.computation_program = get_program(gl, vertex_shader, computation_fragment_shader);
//         this.position_attribute = gl.getAttribLocation(this.computation_program, 'position');
//         this.ui_uniform = gl.getUniformLocation(this.computation_program, 'ui');
//         this.xi_uniform = gl.getUniformLocation(this.computation_program, 'xi');
//         this.c_screen_size_uniform = gl.getUniformLocation(this.computation_program, 'screen_size');
//         this.range_factor_uniform = gl.getUniformLocation(this.computation_program, 'range_factor');
//         this.p_uniform = gl.getUniformLocation(this.computation_program, 'p');
//         this.scale_uniform = gl.getUniformLocation(this.computation_program, 'scale');
//         this.translation_uniform = gl.getUniformLocation(this.computation_program, 'translation');
//         gl.enableVertexAttribArray(this.position_attribute);
//
//         this.draw_program = get_program(gl, vertex_shader, draw_fragment_shader);
//         this.d_screen_size_uniform = gl.getUniformLocation(this.draw_program, 'screen_size');
//         this.computation_texture_uniform = gl.getUniformLocation(this.draw_program, 'computation_texture');
//         this.gamma_uniform = gl.getUniformLocation(this.draw_program, 'gamma');
//     };
//     draw({ scale = 1.0, transform = [0.0, 0.0] } = {}) {
//         if (!this.context) return;
//         let w = this.canvas.width;
//         let h = this.canvas.height;
//
//         let gl = this.context;
//
//         gl.disable(gl.DEPTH_TEST);
//
//         gl.enable(gl.BLEND);
//         gl.enable(gl.STENCIL_TEST);
//
//         gl.blendEquation(gl.FUNC_ADD);
//         gl.blendFunc(gl.SRC_ALPHA, gl.SRC_ALPHA);
//
//         gl.clearColor(0.0, 0.0, 0.0, 1.0);
//
//         gl.useProgram(this.computation_program);
//         gl.uniform2f(this.c_screen_size_uniform, this.computation_framebuffer_width, this.computation_framebuffer_height);
//         gl.uniform1f(this.p_uniform, this.p);
//         gl.uniform1f(this.range_factor_uniform, this.range_factor);
//         gl.uniform1f(this.scale_uniform, scale);
//         gl.uniform2f(this.translation_uniform, transform[0], transform[1]);
//         gl.bindFramebuffer(gl.FRAMEBUFFER, this.computation_framebuffer);
//         gl.viewport(0, 0, this.computation_framebuffer_width, this.computation_framebuffer_height);
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
//
//         for (let i = 0; i < this.translated_points.length; ++i) {
//             let p = this.translated_points[i];
//             gl.uniform2f(this.xi_uniform, p[0], p[1]);
//             gl.uniform1f(this.ui_uniform, p[2]);
//
//             gl.bindBuffer(gl.ARRAY_BUFFER, this.square_vertices_buffer);
//             gl.vertexAttribPointer(this.position_attribute!, 2, gl.FLOAT, false, 0, 0);
//             gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//         }
//
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//         gl.clearColor(0.0, 0.0, 0.0, 0);
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
//
//         gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
//         gl.stencilFunc(gl.ALWAYS, 1, 0xff);
//
//         gl.useProgram(this.stencil_program);
//         gl.uniform1f(this.stencil_scale_uniform, scale);
//         gl.uniform2f(this.stencil_translation_uniform, transform[0] / w, transform[1] / h);
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.stencil_vertices_buffer);
//         gl.vertexAttribPointer(this.stencil_position_attribute!, 2, gl.FLOAT, false, 0, 0);
//
//         gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.stencil_points_count || 4);
//
//         gl.stencilFunc(gl.EQUAL, 1, 0xff);
//
//         gl.useProgram(this.draw_program);
//         gl.activeTexture(gl.TEXTURE0);
//         gl.bindTexture(gl.TEXTURE_2D, this.computation_texture);
//         gl.uniform1i(this.computation_texture_uniform, 0);
//         gl.uniform1f(this.gamma_uniform, this.gamma);
//         gl.uniform2f(this.d_screen_size_uniform, this.canvas.width, this.canvas.height);
//         gl.viewport(0, 0, this.canvas.width, this.canvas.height);
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.square_vertices_buffer);
//         gl.vertexAttribPointer(this.position_attribute!, 2, gl.FLOAT, false, 0, 0);
//
//         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//
//         if (this.is_debug_points) 
//             this.debug_points(scale, transform);
//         else this.hide_points();
//     };
//     hide_points() {
//         const elements = document.getElementsByClassName('tmg-point-' + instance);
//         while (elements[0]) {
//             elements[0].parentNode?.removeChild(elements[0]);
//         }
//     };
//     debug_points(scale:number, offset:number[]) {
//         this.hide_points();
//
//         for (let i = 0; i < this._points.length; ++i) {
//             const p = this._points[i];
//             const dot = document.createElement('p');
//
//             dot.style.position = 'absolute';
//             if (oldScale !== scale) {
//                 p[3] = p[0] - offset[0] / scale;
//                 p[4] = p[1] - offset[1] / scale;
//             }
//             dot.style.left = (p[3] || p[0]) * scale + 'px';
//             dot.style.top = (p[4] || p[1]) * scale + 'px';
//             dot.style.zIndex = '' + (Number(this.canvas.style.zIndex) + 1);
//             dot.className = 'tmg-point ' + 'tmg-point-' + instance;
//             dot.innerHTML = this.point_text(p[2]);
//             this.canvas.parentNode?.insertBefore(dot, this.canvas.nextSibling);
//         }
//         oldScale = scale;
//     };
//
//     resize(width = this.canvas.clientWidth, height = this.canvas.clientHeight) {
//         this.canvas.height = height;
//         this.canvas.width = width;
//         this.canvas.style.height = this.canvas.height + 'px';
//         this.canvas.style.width = this.canvas.width + 'px';
//         this.init_buffers();
//     };
//
// }
//
// let oldScale = 1;
//
// export default TemperatureMapGl;