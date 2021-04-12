/*!
 * @license
 * chartjs-chart-financial
 * http://chartjs.org/
 * Version: 0.1.0
 *
 * Copyright 2021 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chart));
}(this, (function (Chart) { 'use strict';

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Chart__default = /*#__PURE__*/_interopDefaultLegacy(Chart);

/*!
 * Chart.js v3.0.1
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
function isNullOrUndef(value) {
  return value === null || typeof value === 'undefined';
}
function isArray(value) {
  if (Array.isArray && Array.isArray(value)) {
    return true;
  }
  const type = Object.prototype.toString.call(value);
  if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
    return true;
  }
  return false;
}
function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}
function valueOrDefault(value, defaultValue) {
  return typeof value === 'undefined' ? defaultValue : value;
}
function clone$1(source) {
  if (isArray(source)) {
    return source.map(clone$1);
  }
  if (isObject(source)) {
    const target = Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;
    for (; k < klen; ++k) {
      target[keys[k]] = clone$1(source[keys[k]]);
    }
    return target;
  }
  return source;
}
function isValidKey(key) {
  return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
}
function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }
  const tval = target[key];
  const sval = source[key];
  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone$1(sval);
  }
}
function merge(target, source, options) {
  const sources = isArray(source) ? source : [source];
  const ilen = sources.length;
  if (!isObject(target)) {
    return target;
  }
  options = options || {};
  const merger = options.merger || _merger;
  for (let i = 0; i < ilen; ++i) {
    source = sources[i];
    if (!isObject(source)) {
      continue;
    }
    const keys = Object.keys(source);
    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, source, options);
    }
  }
  return target;
}

/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */
const map = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
const hex = '0123456789ABCDEF';
const h1 = (b) => hex[b & 0xF];
const h2 = (b) => hex[(b & 0xF0) >> 4] + hex[b & 0xF];
const eq = (b) => (((b & 0xF0) >> 4) === (b & 0xF));
function isShort(v) {
	return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
}
function hexParse(str) {
	var len = str.length;
	var ret;
	if (str[0] === '#') {
		if (len === 4 || len === 5) {
			ret = {
				r: 255 & map[str[1]] * 17,
				g: 255 & map[str[2]] * 17,
				b: 255 & map[str[3]] * 17,
				a: len === 5 ? map[str[4]] * 17 : 255
			};
		} else if (len === 7 || len === 9) {
			ret = {
				r: map[str[1]] << 4 | map[str[2]],
				g: map[str[3]] << 4 | map[str[4]],
				b: map[str[5]] << 4 | map[str[6]],
				a: len === 9 ? (map[str[7]] << 4 | map[str[8]]) : 255
			};
		}
	}
	return ret;
}
function hexString(v) {
	var f = isShort(v) ? h1 : h2;
	return v
		? '#' + f(v.r) + f(v.g) + f(v.b) + (v.a < 255 ? f(v.a) : '')
		: v;
}
function round(v) {
	return v + 0.5 | 0;
}
const lim = (v, l, h) => Math.max(Math.min(v, h), l);
function p2b(v) {
	return lim(round(v * 2.55), 0, 255);
}
function n2b(v) {
	return lim(round(v * 255), 0, 255);
}
function b2n(v) {
	return lim(round(v / 2.55) / 100, 0, 1);
}
function n2p(v) {
	return lim(round(v * 100), 0, 100);
}
const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function rgbParse(str) {
	const m = RGB_RE.exec(str);
	let a = 255;
	let r, g, b;
	if (!m) {
		return;
	}
	if (m[7] !== r) {
		const v = +m[7];
		a = 255 & (m[8] ? p2b(v) : v * 255);
	}
	r = +m[1];
	g = +m[3];
	b = +m[5];
	r = 255 & (m[2] ? p2b(r) : r);
	g = 255 & (m[4] ? p2b(g) : g);
	b = 255 & (m[6] ? p2b(b) : b);
	return {
		r: r,
		g: g,
		b: b,
		a: a
	};
}
function rgbString(v) {
	return v && (
		v.a < 255
			? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
			: `rgb(${v.r}, ${v.g}, ${v.b})`
	);
}
const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function hsl2rgbn(h, s, l) {
	const a = s * Math.min(l, 1 - l);
	const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0), f(8), f(4)];
}
function hsv2rgbn(h, s, v) {
	const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
	return [f(5), f(3), f(1)];
}
function hwb2rgbn(h, w, b) {
	const rgb = hsl2rgbn(h, 1, 0.5);
	let i;
	if (w + b > 1) {
		i = 1 / (w + b);
		w *= i;
		b *= i;
	}
	for (i = 0; i < 3; i++) {
		rgb[i] *= 1 - w - b;
		rgb[i] += w;
	}
	return rgb;
}
function rgb2hsl(v) {
	const range = 255;
	const r = v.r / range;
	const g = v.g / range;
	const b = v.b / range;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h, s, d;
	if (max !== min) {
		d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		h = max === r
			? ((g - b) / d) + (g < b ? 6 : 0)
			: max === g
				? (b - r) / d + 2
				: (r - g) / d + 4;
		h = h * 60 + 0.5;
	}
	return [h | 0, s || 0, l];
}
function calln(f, a, b, c) {
	return (
		Array.isArray(a)
			? f(a[0], a[1], a[2])
			: f(a, b, c)
	).map(n2b);
}
function hsl2rgb(h, s, l) {
	return calln(hsl2rgbn, h, s, l);
}
function hwb2rgb(h, w, b) {
	return calln(hwb2rgbn, h, w, b);
}
function hsv2rgb(h, s, v) {
	return calln(hsv2rgbn, h, s, v);
}
function hue(h) {
	return (h % 360 + 360) % 360;
}
function hueParse(str) {
	const m = HUE_RE.exec(str);
	let a = 255;
	let v;
	if (!m) {
		return;
	}
	if (m[5] !== v) {
		a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
	}
	const h = hue(+m[2]);
	const p1 = +m[3] / 100;
	const p2 = +m[4] / 100;
	if (m[1] === 'hwb') {
		v = hwb2rgb(h, p1, p2);
	} else if (m[1] === 'hsv') {
		v = hsv2rgb(h, p1, p2);
	} else {
		v = hsl2rgb(h, p1, p2);
	}
	return {
		r: v[0],
		g: v[1],
		b: v[2],
		a: a
	};
}
function rotate(v, deg) {
	var h = rgb2hsl(v);
	h[0] = hue(h[0] + deg);
	h = hsl2rgb(h);
	v.r = h[0];
	v.g = h[1];
	v.b = h[2];
}
function hslString(v) {
	if (!v) {
		return;
	}
	const a = rgb2hsl(v);
	const h = a[0];
	const s = n2p(a[1]);
	const l = n2p(a[2]);
	return v.a < 255
		? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
		: `hsl(${h}, ${s}%, ${l}%)`;
}
const map$1 = {
	x: 'dark',
	Z: 'light',
	Y: 're',
	X: 'blu',
	W: 'gr',
	V: 'medium',
	U: 'slate',
	A: 'ee',
	T: 'ol',
	S: 'or',
	B: 'ra',
	C: 'lateg',
	D: 'ights',
	R: 'in',
	Q: 'turquois',
	E: 'hi',
	P: 'ro',
	O: 'al',
	N: 'le',
	M: 'de',
	L: 'yello',
	F: 'en',
	K: 'ch',
	G: 'arks',
	H: 'ea',
	I: 'ightg',
	J: 'wh'
};
const names = {
	OiceXe: 'f0f8ff',
	antiquewEte: 'faebd7',
	aqua: 'ffff',
	aquamarRe: '7fffd4',
	azuY: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '0',
	blanKedOmond: 'ffebcd',
	Xe: 'ff',
	XeviTet: '8a2be2',
	bPwn: 'a52a2a',
	burlywood: 'deb887',
	caMtXe: '5f9ea0',
	KartYuse: '7fff00',
	KocTate: 'd2691e',
	cSO: 'ff7f50',
	cSnflowerXe: '6495ed',
	cSnsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: 'ffff',
	xXe: '8b',
	xcyan: '8b8b',
	xgTMnPd: 'b8860b',
	xWay: 'a9a9a9',
	xgYF: '6400',
	xgYy: 'a9a9a9',
	xkhaki: 'bdb76b',
	xmagFta: '8b008b',
	xTivegYF: '556b2f',
	xSange: 'ff8c00',
	xScEd: '9932cc',
	xYd: '8b0000',
	xsOmon: 'e9967a',
	xsHgYF: '8fbc8f',
	xUXe: '483d8b',
	xUWay: '2f4f4f',
	xUgYy: '2f4f4f',
	xQe: 'ced1',
	xviTet: '9400d3',
	dAppRk: 'ff1493',
	dApskyXe: 'bfff',
	dimWay: '696969',
	dimgYy: '696969',
	dodgerXe: '1e90ff',
	fiYbrick: 'b22222',
	flSOwEte: 'fffaf0',
	foYstWAn: '228b22',
	fuKsia: 'ff00ff',
	gaRsbSo: 'dcdcdc',
	ghostwEte: 'f8f8ff',
	gTd: 'ffd700',
	gTMnPd: 'daa520',
	Way: '808080',
	gYF: '8000',
	gYFLw: 'adff2f',
	gYy: '808080',
	honeyMw: 'f0fff0',
	hotpRk: 'ff69b4',
	RdianYd: 'cd5c5c',
	Rdigo: '4b0082',
	ivSy: 'fffff0',
	khaki: 'f0e68c',
	lavFMr: 'e6e6fa',
	lavFMrXsh: 'fff0f5',
	lawngYF: '7cfc00',
	NmoncEffon: 'fffacd',
	ZXe: 'add8e6',
	ZcSO: 'f08080',
	Zcyan: 'e0ffff',
	ZgTMnPdLw: 'fafad2',
	ZWay: 'd3d3d3',
	ZgYF: '90ee90',
	ZgYy: 'd3d3d3',
	ZpRk: 'ffb6c1',
	ZsOmon: 'ffa07a',
	ZsHgYF: '20b2aa',
	ZskyXe: '87cefa',
	ZUWay: '778899',
	ZUgYy: '778899',
	ZstAlXe: 'b0c4de',
	ZLw: 'ffffe0',
	lime: 'ff00',
	limegYF: '32cd32',
	lRF: 'faf0e6',
	magFta: 'ff00ff',
	maPon: '800000',
	VaquamarRe: '66cdaa',
	VXe: 'cd',
	VScEd: 'ba55d3',
	VpurpN: '9370db',
	VsHgYF: '3cb371',
	VUXe: '7b68ee',
	VsprRggYF: 'fa9a',
	VQe: '48d1cc',
	VviTetYd: 'c71585',
	midnightXe: '191970',
	mRtcYam: 'f5fffa',
	mistyPse: 'ffe4e1',
	moccasR: 'ffe4b5',
	navajowEte: 'ffdead',
	navy: '80',
	Tdlace: 'fdf5e6',
	Tive: '808000',
	TivedBb: '6b8e23',
	Sange: 'ffa500',
	SangeYd: 'ff4500',
	ScEd: 'da70d6',
	pOegTMnPd: 'eee8aa',
	pOegYF: '98fb98',
	pOeQe: 'afeeee',
	pOeviTetYd: 'db7093',
	papayawEp: 'ffefd5',
	pHKpuff: 'ffdab9',
	peru: 'cd853f',
	pRk: 'ffc0cb',
	plum: 'dda0dd',
	powMrXe: 'b0e0e6',
	purpN: '800080',
	YbeccapurpN: '663399',
	Yd: 'ff0000',
	Psybrown: 'bc8f8f',
	PyOXe: '4169e1',
	saddNbPwn: '8b4513',
	sOmon: 'fa8072',
	sandybPwn: 'f4a460',
	sHgYF: '2e8b57',
	sHshell: 'fff5ee',
	siFna: 'a0522d',
	silver: 'c0c0c0',
	skyXe: '87ceeb',
	UXe: '6a5acd',
	UWay: '708090',
	UgYy: '708090',
	snow: 'fffafa',
	sprRggYF: 'ff7f',
	stAlXe: '4682b4',
	tan: 'd2b48c',
	teO: '8080',
	tEstN: 'd8bfd8',
	tomato: 'ff6347',
	Qe: '40e0d0',
	viTet: 'ee82ee',
	JHt: 'f5deb3',
	wEte: 'ffffff',
	wEtesmoke: 'f5f5f5',
	Lw: 'ffff00',
	LwgYF: '9acd32'
};
function unpack() {
	const unpacked = {};
	const keys = Object.keys(names);
	const tkeys = Object.keys(map$1);
	let i, j, k, ok, nk;
	for (i = 0; i < keys.length; i++) {
		ok = nk = keys[i];
		for (j = 0; j < tkeys.length; j++) {
			k = tkeys[j];
			nk = nk.replace(k, map$1[k]);
		}
		k = parseInt(names[ok], 16);
		unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
	}
	return unpacked;
}
let names$1;
function nameParse(str) {
	if (!names$1) {
		names$1 = unpack();
		names$1.transparent = [0, 0, 0, 0];
	}
	const a = names$1[str.toLowerCase()];
	return a && {
		r: a[0],
		g: a[1],
		b: a[2],
		a: a.length === 4 ? a[3] : 255
	};
}
function modHSL(v, i, ratio) {
	if (v) {
		let tmp = rgb2hsl(v);
		tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
		tmp = hsl2rgb(tmp);
		v.r = tmp[0];
		v.g = tmp[1];
		v.b = tmp[2];
	}
}
function clone(v, proto) {
	return v ? Object.assign(proto || {}, v) : v;
}
function fromObject(input) {
	var v = {r: 0, g: 0, b: 0, a: 255};
	if (Array.isArray(input)) {
		if (input.length >= 3) {
			v = {r: input[0], g: input[1], b: input[2], a: 255};
			if (input.length > 3) {
				v.a = n2b(input[3]);
			}
		}
	} else {
		v = clone(input, {r: 0, g: 0, b: 0, a: 1});
		v.a = n2b(v.a);
	}
	return v;
}
function functionParse(str) {
	if (str.charAt(0) === 'r') {
		return rgbParse(str);
	}
	return hueParse(str);
}
class Color {
	constructor(input) {
		if (input instanceof Color) {
			return input;
		}
		const type = typeof input;
		let v;
		if (type === 'object') {
			v = fromObject(input);
		} else if (type === 'string') {
			v = hexParse(input) || nameParse(input) || functionParse(input);
		}
		this._rgb = v;
		this._valid = !!v;
	}
	get valid() {
		return this._valid;
	}
	get rgb() {
		var v = clone(this._rgb);
		if (v) {
			v.a = b2n(v.a);
		}
		return v;
	}
	set rgb(obj) {
		this._rgb = fromObject(obj);
	}
	rgbString() {
		return this._valid ? rgbString(this._rgb) : this._rgb;
	}
	hexString() {
		return this._valid ? hexString(this._rgb) : this._rgb;
	}
	hslString() {
		return this._valid ? hslString(this._rgb) : this._rgb;
	}
	mix(color, weight) {
		const me = this;
		if (color) {
			const c1 = me.rgb;
			const c2 = color.rgb;
			let w2;
			const p = weight === w2 ? 0.5 : weight;
			const w = 2 * p - 1;
			const a = c1.a - c2.a;
			const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
			w2 = 1 - w1;
			c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
			c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
			c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
			c1.a = p * c1.a + (1 - p) * c2.a;
			me.rgb = c1;
		}
		return me;
	}
	clone() {
		return new Color(this.rgb);
	}
	alpha(a) {
		this._rgb.a = n2b(a);
		return this;
	}
	clearer(ratio) {
		const rgb = this._rgb;
		rgb.a *= 1 - ratio;
		return this;
	}
	greyscale() {
		const rgb = this._rgb;
		const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
		rgb.r = rgb.g = rgb.b = val;
		return this;
	}
	opaquer(ratio) {
		const rgb = this._rgb;
		rgb.a *= 1 + ratio;
		return this;
	}
	negate() {
		const v = this._rgb;
		v.r = 255 - v.r;
		v.g = 255 - v.g;
		v.b = 255 - v.b;
		return this;
	}
	lighten(ratio) {
		modHSL(this._rgb, 2, ratio);
		return this;
	}
	darken(ratio) {
		modHSL(this._rgb, 2, -ratio);
		return this;
	}
	saturate(ratio) {
		modHSL(this._rgb, 1, ratio);
		return this;
	}
	desaturate(ratio) {
		modHSL(this._rgb, 1, -ratio);
		return this;
	}
	rotate(deg) {
		rotate(this._rgb, deg);
		return this;
	}
}
function index_esm(input) {
	return new Color(input);
}

const isPatternOrGradient = (value) => value instanceof CanvasGradient || value instanceof CanvasPattern;
function getHoverColor(value) {
  return isPatternOrGradient(value)
    ? value
    : index_esm(value).saturate(0.5).darken(0.1).hexString();
}

const overrides = Object.create(null);
const descriptors = Object.create(null);
function getScope$1(node, key) {
  if (!key) {
    return node;
  }
  const keys = key.split('.');
  for (let i = 0, n = keys.length; i < n; ++i) {
    const k = keys[i];
    node = node[k] || (node[k] = Object.create(null));
  }
  return node;
}
function set(root, scope, values) {
  if (typeof scope === 'string') {
    return merge(getScope$1(root, scope), values);
  }
  return merge(getScope$1(root, ''), scope);
}
class Defaults {
  constructor(_descriptors) {
    this.animation = undefined;
    this.backgroundColor = 'rgba(0,0,0,0.1)';
    this.borderColor = 'rgba(0,0,0,0.1)';
    this.color = '#666';
    this.datasets = {};
    this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
    this.elements = {};
    this.events = [
      'mousemove',
      'mouseout',
      'click',
      'touchstart',
      'touchmove'
    ];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: 'normal',
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};
    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
    this.hoverColor = (ctx, options) => getHoverColor(options.color);
    this.indexAxis = 'x';
    this.interaction = {
      mode: 'nearest',
      intersect: true
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = undefined;
    this.scales = {};
    this.showLine = true;
    this.describe(_descriptors);
  }
  set(scope, values) {
    return set(this, scope, values);
  }
  get(scope) {
    return getScope$1(this, scope);
  }
  describe(scope, values) {
    return set(descriptors, scope, values);
  }
  override(scope, values) {
    return set(overrides, scope, values);
  }
  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = '_' + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,
        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];
          if (isObject(local)) {
            return Object.assign({}, target, local);
          }
          return valueOrDefault(local, target);
        },
        set(value) {
          this[privateName] = value;
        }
      }
    });
  }
}
var defaults = new Defaults({
  _scriptable: (name) => !name.startsWith('on'),
  _indexable: (name) => name !== 'events',
  hover: {
    _fallback: 'interaction'
  },
  interaction: {
    _scriptable: false,
    _indexable: false,
  }
});
function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}
function unclipArea(ctx) {
  ctx.restore();
}
const supportsEventListenerOptions = (function() {
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {
  }
  return passiveSupported;
}());

/**
 * Computes the "optimal" sample size to maintain bars equally sized while preventing overlap.
 * @private
 */
function computeMinSampleSize(scale, pixels) {
	let min = scale._length;
	let prev, curr, i, ilen;

	for (i = 1, ilen = pixels.length; i < ilen; ++i) {
		min = Math.min(min, Math.abs(pixels[i] - pixels[i - 1]));
	}

	for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
		curr = scale.getPixelForTick(i);
		min = i > 0 ? Math.min(min, Math.abs(curr - prev)) : min;
		prev = curr;
	}

	return min;
}

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
class FinancialController extends Chart.BarController {

	getLabelAndValue(index) {
		const me = this;
		const parsed = me.getParsed(index);
		const axis = me._cachedMeta.iScale.axis;

		const {o, h, l, c} = parsed;
		const value = `O: ${o}  H: ${h}  L: ${l}  C: ${c}`;

		return {
			label: `${me._cachedMeta.iScale.getLabelForValue(parsed[axis])}`,
			value
		};
	}

	getAllParsedValues() {
		const meta = this._cachedMeta;
		const axis = meta.iScale.axis;
		const parsed = meta._parsed;
		const values = [];
		for (let i = 0; i < parsed.length; ++i) {
			values.push(parsed[i][axis]);
		}
		return values;
	}

	/**
	 * Implement this ourselves since it doesn't handle high and low values
	 * https://github.com/chartjs/Chart.js/issues/7328
	 * @protected
	 */
	getMinMax(scale) {
		const meta = this._cachedMeta;
		const _parsed = meta._parsed;
		const axis = meta.iScale.axis;

		if (_parsed.length < 2) {
			return {min: 0, max: 1};
		}

		if (scale === meta.iScale) {
			return {min: _parsed[0][axis], max: _parsed[_parsed.length - 1][axis]};
		}

		let min = Number.POSITIVE_INFINITY;
		let max = Number.NEGATIVE_INFINITY;
		for (let i = 0; i < _parsed.length; i++) {
			const data = _parsed[i];
			min = Math.min(min, data.l);
			max = Math.max(max, data.h);
		}
		return {min, max};
	}

	_getRuler() {
		const me = this;
		const opts = me.options;
		const meta = me._cachedMeta;
		const iScale = meta.iScale;
		const axis = iScale.axis;
		const pixels = [];
		for (let i = 0; i < meta.data.length; ++i) {
			pixels.push(iScale.getPixelForValue(me.getParsed(i)[axis]));
		}
		const barThickness = opts.barThickness;
		const min = computeMinSampleSize(iScale, pixels);
		return {
			min,
			pixels,
			start: iScale._startPixel,
			end: iScale._endPixel,
			stackCount: me._getStackCount(),
			scale: iScale,
			ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
		};
	}

	/**
	 * @protected
	 */
	calculateElementProperties(index, ruler, reset, options) {
		const me = this;
		const vscale = me._cachedMeta.vScale;
		const base = vscale.getBasePixel();
		const ipixels = me._calculateBarIndexPixels(index, ruler, options);
		const data = me.chart.data.datasets[me.index].data[index];
		const open = vscale.getPixelForValue(data.o);
		const high = vscale.getPixelForValue(data.h);
		const low = vscale.getPixelForValue(data.l);
		const close = vscale.getPixelForValue(data.c);

		return {
			base: reset ? base : low,
			x: ipixels.center,
			y: (low + high) / 2,
			width: ipixels.size,
			open,
			high,
			low,
			close
		};
	}

	draw() {
		const me = this;
		const chart = me.chart;
		const rects = me._cachedMeta.data;
		clipArea(chart.ctx, chart.chartArea);
		for (let i = 0; i < rects.length; ++i) {
			rects[i].draw(me._ctx);
		}
		unclipArea(chart.ctx);
	}

}

FinancialController.overrides = {
	label: '',

	parsing: false,

	hover: {
		mode: 'label'
	},

	datasets: {
		categoryPercentage: 0.8,
		barPercentage: 0.9,
		animation: {
			numbers: {
				type: 'number',
				properties: ['x', 'y', 'base', 'width', 'open', 'high', 'low', 'close']
			}
		}
	},

	scales: {
		x: {
			type: 'timeseries',
			offset: true,
			ticks: {
				major: {
					enabled: true,
				},
				fontStyle: context => context.tick.major ? 'bold' : undefined,
				source: 'data',
				maxRotation: 0,
				autoSkip: true,
				autoSkipPadding: 75,
				sampleSize: 100
			},
			afterBuildTicks: scale => {
				const DateTime = window && window.luxon && window.luxon.DateTime;
				if (!DateTime) {
					return;
				}
				const majorUnit = scale._majorUnit;
				const ticks = scale.ticks;
				const firstTick = ticks[0];
				if (!firstTick) {
					return;
				}

				let val = DateTime.fromMillis(firstTick.value);
				if ((majorUnit === 'minute' && val.second === 0)
						|| (majorUnit === 'hour' && val.minute === 0)
						|| (majorUnit === 'day' && val.hour === 9)
						|| (majorUnit === 'month' && val.day <= 3 && val.weekday === 1)
						|| (majorUnit === 'year' && val.month === 1)) {
					firstTick.major = true;
				} else {
					firstTick.major = false;
				}
				let lastMajor = val.get(majorUnit);

				for (let i = 1; i < ticks.length; i++) {
					const tick = ticks[i];
					val = DateTime.fromMillis(tick.value);
					const currMajor = val.get(majorUnit);
					tick.major = currMajor !== lastMajor;
					lastMajor = currMajor;
				}
				scale.ticks = ticks;
			}
		},
		y: {
			type: 'linear'
		}
	},

	plugins: {
		tooltip: {
			intersect: false,
			mode: 'index',
			callbacks: {
				label(ctx) {
					const point = ctx.parsed;

					if (!isNullOrUndef(point.y)) {
						return Chart.defaults.interaction.callbacks.label(ctx);
					}

					const {o, h, l, c} = point;

					return `O: ${o}  H: ${h}  L: ${l}  C: ${c}`;
				}
			}
		}
	}
};

const globalOpts = Chart.Chart.defaults;

globalOpts.elements.financial = {
	color: {
		up: 'rgba(80, 160, 115, 1)',
		down: 'rgba(215, 85, 65, 1)',
		unchanged: 'rgba(90, 90, 90, 1)',
	}
};

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {Rectangle} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
	const {x, y, base, width, height} = bar.getProps(['x', 'low', 'high', 'width', 'height'], useFinalPosition);

	let left, right, top, bottom, half;

	if (bar.horizontal) {
		half = height / 2;
		left = Math.min(x, base);
		right = Math.max(x, base);
		top = y - half;
		bottom = y + half;
	} else {
		half = width / 2;
		left = x - half;
		right = x + half;
		top = Math.min(y, base); // use min because 0 pixel at top of screen
		bottom = Math.max(y, base);
	}

	return {left, top, right, bottom};
}

function inRange(bar, x, y, useFinalPosition) {
	const skipX = x === null;
	const skipY = y === null;
	const bounds = !bar || (skipX && skipY) ? false : getBarBounds(bar, useFinalPosition);

	return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

class FinancialElement extends Chart.Element {

	height() {
		return this.base - this.y;
	}

	inRange(mouseX, mouseY, useFinalPosition) {
		return inRange(this, mouseX, mouseY, useFinalPosition);
	}

	inXRange(mouseX, useFinalPosition) {
		return inRange(this, mouseX, null, useFinalPosition);
	}

	inYRange(mouseY, useFinalPosition) {
		return inRange(this, null, mouseY, useFinalPosition);
	}

	getRange(axis) {
		return axis === 'x' ? this.width / 2 : this.height / 2;
	}

	getCenterPoint(useFinalPosition) {
		const {x, low, high} = this.getProps(['x', 'low', 'high'], useFinalPosition);
		return {
			x,
			y: (high + low) / 2
		};
	}

	tooltipPosition(useFinalPosition) {
		const {x, open, close} = this.getProps(['x', 'open', 'close'], useFinalPosition);
		return {
			x,
			y: (open + close) / 2
		};
	}
}

const globalOpts$1 = Chart.Chart.defaults;

class CandlestickElement extends FinancialElement {
	draw(ctx) {
		const me = this;

		const {x, open, high, low, close} = me;

		let borderColors = me.borderColor;
		if (typeof borderColors === 'string') {
			borderColors = {
				up: borderColors,
				down: borderColors,
				unchanged: borderColors
			};
		}

		let borderColor;
		if (close < open) {
			borderColor = valueOrDefault(borderColors ? borderColors.up : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = valueOrDefault(me.color ? me.color.up : undefined, globalOpts$1.elements.candlestick.color.up);
		} else if (close > open) {
			borderColor = valueOrDefault(borderColors ? borderColors.down : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = valueOrDefault(me.color ? me.color.down : undefined, globalOpts$1.elements.candlestick.color.down);
		} else {
			borderColor = valueOrDefault(borderColors ? borderColors.unchanged : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = valueOrDefault(me.color ? me.color.unchanged : undefined, globalOpts$1.elements.candlestick.color.unchanged);
		}

		ctx.lineWidth = valueOrDefault(me.borderWidth, globalOpts$1.elements.candlestick.borderWidth);
		ctx.strokeStyle = valueOrDefault(borderColor, globalOpts$1.elements.candlestick.borderColor);

		ctx.beginPath();
		ctx.moveTo(x, high);
		ctx.lineTo(x, Math.min(open, close));
		ctx.moveTo(x, low);
		ctx.lineTo(x, Math.max(open, close));
		ctx.stroke();
		ctx.fillRect(x - me.width / 2, close, me.width, open - close);
		ctx.strokeRect(x - me.width / 2, close, me.width, open - close);
		ctx.closePath();
	}
}

CandlestickElement.id = 'candlestick';
CandlestickElement.defaults = merge({}, [globalOpts$1.elements.financial, {
	borderColor: globalOpts$1.elements.financial.color.unchanged,
	borderWidth: 1,
}]);

class CandlestickController extends FinancialController {

	updateElements(elements, start, count, mode) {
		const me = this;
		const dataset = me.getDataset();
		const ruler = me._ruler || me._getRuler();
		const firstOpts = me.resolveDataElementOptions(start, mode);
		const sharedOptions = me.getSharedOptions(firstOpts);
		const includeOptions = me.includeOptions(mode, sharedOptions);

		me.updateSharedOptions(sharedOptions, mode, firstOpts);

		for (let i = start; i < count; i++) {
			const options = sharedOptions || me.resolveDataElementOptions(i, mode);

			const baseProperties = me.calculateElementProperties(i, ruler, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				// label: '', // to get label value please use dataset.data[index].label

				// Appearance
				color: dataset.color,
				borderColor: dataset.borderColor,
				borderWidth: dataset.borderWidth,
			};

			if (includeOptions) {
				properties.options = options;
			}
			me.updateElement(elements[i], i, properties, mode);
		}
	}

}

CandlestickController.id = 'candlestick';
CandlestickController.defaults = merge({
	dataElementType: CandlestickElement.id
}, Chart__default['default'].defaults.financial);

const globalOpts$2 = Chart.Chart.defaults;

class OhlcElement extends FinancialElement {
	draw(ctx) {
		const me = this;

		const {x, open, high, low, close} = me;

		const armLengthRatio = valueOrDefault(me.armLengthRatio, globalOpts$2.elements.ohlc.armLengthRatio);
		let armLength = valueOrDefault(me.armLength, globalOpts$2.elements.ohlc.armLength);
		if (armLength === null) {
			// The width of an ohlc is affected by barPercentage and categoryPercentage
			// This behavior is caused by extending controller.financial, which extends controller.bar
			// barPercentage and categoryPercentage are now set to 1.0 (see controller.ohlc)
			// and armLengthRatio is multipled by 0.5,
			// so that when armLengthRatio=1.0, the arms from neighbour ohcl touch,
			// and when armLengthRatio=0.0, ohcl are just vertical lines.
			armLength = me.width * armLengthRatio * 0.5;
		}

		if (close < open) {
			ctx.strokeStyle = valueOrDefault(me.color ? me.color.up : undefined, globalOpts$2.elements.ohlc.color.up);
		} else if (close > open) {
			ctx.strokeStyle = valueOrDefault(me.color ? me.color.down : undefined, globalOpts$2.elements.ohlc.color.down);
		} else {
			ctx.strokeStyle = valueOrDefault(me.color ? me.color.unchanged : undefined, globalOpts$2.elements.ohlc.color.unchanged);
		}
		ctx.lineWidth = valueOrDefault(me.lineWidth, globalOpts$2.elements.ohlc.lineWidth);

		ctx.beginPath();
		ctx.moveTo(x, high);
		ctx.lineTo(x, low);
		ctx.moveTo(x - armLength, open);
		ctx.lineTo(x, open);
		ctx.moveTo(x + armLength, close);
		ctx.lineTo(x, close);
		ctx.stroke();
	}
}

OhlcElement.id = 'ohlc';
OhlcElement.defaults = merge({}, [globalOpts$2.elements.financial, {
	lineWidth: 2,
	armLength: null,
	armLengthRatio: 0.8,
}]);

class OhlcController extends FinancialController {

	updateElements(elements, start, count, mode) {
		const me = this;
		const dataset = me.getDataset();
		const ruler = me._ruler || me._getRuler();
		const firstOpts = me.resolveDataElementOptions(start, mode);
		const sharedOptions = me.getSharedOptions(firstOpts);
		const includeOptions = me.includeOptions(mode, sharedOptions);

		for (let i = 0; i < count; i++) {
			const options = sharedOptions || me.resolveDataElementOptions(i, mode);

			const baseProperties = me.calculateElementProperties(i, ruler, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				lineWidth: dataset.lineWidth,
				armLength: dataset.armLength,
				armLengthRatio: dataset.armLengthRatio,
				color: dataset.color,
			};

			if (includeOptions) {
				properties.options = options;
			}
			me.updateElement(elements[i], i, properties, mode);
		}
	}

}

OhlcController.id = 'ohlc';
OhlcController.defaults = merge({
	dataElementType: OhlcElement.id,
	datasets: {
		barPercentage: 1.0,
		categoryPercentage: 1.0
	}
}, Chart.Chart.defaults.financial);

Chart.Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);

})));
