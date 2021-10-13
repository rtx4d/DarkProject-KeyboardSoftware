var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var events = require('events');
var fs = require('fs');
var env = require('../others/env');
var funcVar = require('../others/FunctionVariable');
var evtType = require('../others/EventVariable').EventTypes;
var exec = require('child_process').exec;//execFile->exec

var AppObj = require("../dbapi/AppDB");

var m_AudioCap;
var g_bGetAudioCap = false;
var g_GetAudioCap = {};

var g_DataAudio;
//var HID = require('node-hid');

'use strict';
//------------coordinate.js-------------
//[0]:左上角 [1]:右上角 [2]:右下角 [3]:左下角
var keyboard =  [//Device1:DarkProject-KD3_104

	//Esc~Pause
	{ X1: 8, X2: 35, Y1: 50, Y2: 77 },
	{ X1: 73, X2: 100, Y1: 50, Y2: 77 },
	{ X1: 107, X2: 134, Y1: 50, Y2: 77 },
	{ X1: 140, X2: 167, Y1: 50, Y2: 77 },
	{ X1: 174, X2: 201, Y1: 50, Y2: 77 },
	{ X1: 222, X2: 249, Y1: 50, Y2: 77 },
	{ X1: 255, X2: 282, Y1: 50, Y2: 77 },
	{ X1: 289, X2: 316, Y1: 50, Y2: 77 },
	{ X1: 323, X2: 350, Y1: 50, Y2: 77 },
	{ X1: 371, X2: 398, Y1: 50, Y2: 77 },
	{ X1: 405, X2: 432, Y1: 50, Y2: 77 },
	{ X1: 438, X2: 465, Y1: 50, Y2: 77 },
	{ X1: 470, X2: 504, Y1: 50, Y2: 77 },
	{ X1: 505, X2: 532, Y1: 50, Y2: 77 },
	{ X1: 539, X2: 566, Y1: 50, Y2: 77 },
	{ X1: 572, X2: 599, Y1: 50, Y2: 77 },

	//Period~NumMinus
	{ X1: 8,   X2: (35  + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 41,  X2: (68  + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 75,  X2: (102 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 107, X2: (134 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 141, X2: (168 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 173, X2: (200 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 207, X2: (234 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 239, X2: (273 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 272, X2: (299 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 305, X2: (332 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 339, X2: (366 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 372, X2: (399 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 405, X2: (432 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 437, X2: (437 + 62), Y1: 50, Y2: (50 + 27) },

	{ X1: 505, X2: (505 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 537, X2: (537 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 571, X2: (571 + 27), Y1: 50, Y2: (50 + 27) },

	{ X1: 570, X2: (570 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 600, X2: (600 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 630, X2: (630 + 27), Y1: 50, Y2: (50 + 27) },
	{ X1: 660, X2: (660 + 27), Y1: 50, Y2: (50 + 27) },

	//Tab~NumPlus
	{ X1: 8,   X2: (8 + 44)  , Y1: 83, Y2: (83 + 27) },
	{ X1: 58,  X2: (58 + 27) , Y1: 83, Y2: (83 + 27) },
	{ X1: 91,  X2: (91 + 27) , Y1: 83, Y2: (83 + 27) },
	{ X1: 125, X2: (125 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 157, X2: (157 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 190, X2: (190 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 222, X2: (222 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 255, X2: (255 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 289, X2: (289 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 321, X2: (321 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 355, X2: (355 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 388, X2: (388 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 421, X2: (421 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 453, X2: (453 + 45), Y1: 83, Y2: (83 + 27) },

	{ X1: 460, X2: (460 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 490, X2: (490 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 520, X2: (520 + 27), Y1: 83, Y2: (83 + 27) },
	
	{ X1: 570, X2: (570 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 600, X2: (600 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 630, X2: (630 + 27), Y1: 83, Y2: (83 + 27) },
	{ X1: 660, X2: (660 + 27), Y1: 83, Y2: (83 + 27) },
	//Caplock~Enter

	{ X1: 8, X2: (8 + 53), Y1: 116, Y2: (116 + 27) },
	{ X1: 66, X2: (66 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 100, X2: (100 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 133, X2: (133 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 167, X2: (167 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 198, X2: (198 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 232, X2: (232 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 265, X2: (265 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 298, X2: (298 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 331, X2: (331 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 364, X2: (364 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 397, X2: (397 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 431, X2: (431 + 66), Y1: 116, Y2: (116 + 27) },
	
	{ X1: 570, X2: (570 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 600, X2: (600 + 27), Y1: 116, Y2: (116 + 27) },
	{ X1: 630, X2: (630 + 27), Y1: 116, Y2: (116 + 27) },
	//LShift~RShift
	{ X1: 8, X2: (8 + 70), Y1: 149, Y2: (149 + 27) },
	{ X1: 83, X2: (83 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 116, X2: (116 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 149, X2: (149 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 183, X2: (183 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 215, X2: (215 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 248, X2: (248 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 281, X2: (281 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 314, X2: (314 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 347, X2: (347 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 380, X2: (380 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 413, X2: (413 + 85), Y1: 149, Y2: (149 + 27) },
	
	{ X1: 537, X2: (537 + 27), Y1: 149, Y2: (149 + 27) },

	{ X1: 604, X2: (604 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 638, X2: (638 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 671, X2: (671 + 27), Y1: 149, Y2: (149 + 27) },
	{ X1: 704, X2: (704 + 27), Y1: 149, Y2: (149 + 61) },
	//Lctrl~FN
	{ X1: 8, X2: (8 + 44), Y1: 182, Y2: (182 + 27) },
	{ X1: 56, X2: (56 + 27), Y1: 182, Y2: (182 + 27) },
	{ X1: 90, X2: (90 + 44), Y1: 182, Y2: (182 + 27) },
	{ X1: 140, X2: (140 + 192), Y1: 182, Y2: (182 + 27) },
	{ X1: 338, X2: (338 + 44), Y1: 182, Y2: (182 + 27) },
	{ X1: 386, X2: (386 + 27), Y1: 182, Y2: (182 + 27) },
	{ X1: 421, X2: (421 + 27), Y1: 182, Y2: (182 + 27) },
	{ X1: 453, X2: (453 + 45), Y1: 182, Y2: (182 + 27) },
	
	{ X1: 504, X2: (504 + 27), Y1: 182, Y2: (182 + 27) },
	{ X1: 537, X2: (537 + 27), Y1: 182, Y2: (182 + 27) },
	{ X1: 571, X2: (571 + 27), Y1: 182, Y2: (182 + 27) },

	{ X1: 605, X2: (605 + 62), Y1: 182, Y2: (182 + 27) },
	{ X1: 671, X2: (671 + 27), Y1: 182, Y2: (182 + 27) },
  ];
//KD1-104
// var keycodes = [
// 	"esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
// 	"period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" , "numlock","numdivide" ,"nummulti" , "numminus",
// 	"tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown", "num7", "num8"   , "num9"     , "numplus" ,
// 	"caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" , "num4"  , "num5"  , "num6" ,
// 	"lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    , "num1"  , "num2" , "num3","numenter",
// 	"lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" , "num0"  ,"numdot",
// 	];
//KD3-87
var keycodes = [
	"esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
	"period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" ,
	"tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown",
	"caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" ,
	"lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    ,
	"lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" ,
	];

var m_EffectName = ['Wave','ConicBand','Spiral','Cycle','LinearWave','Ripple','Breathing','Rain','Fire','Trigger','AudioCap','Static'];
//------------coordinate.js-------------
//------------device.js-------------
class Device {
	constructor(device_type, coordinates, keycodes) {
		this.type = device_type;
		if (!keycodes) keycodes = [];

		var x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
		for (let i=0; i<coordinates.length; ++i)
		{
			x1 = Math.min(x1, coordinates[i].X1);
			y1 = Math.min(y1, coordinates[i].Y1);
			x2 = Math.max(x2, coordinates[i].X2);
			y2 = Math.max(y2, coordinates[i].Y2);
		}

		this.position = {
			x      : -14,
			y      : -24,
			width  : 803,
			height : 287,
		}

		this.region = {
			x      : 0,
			y      : 0,
			width  : x2 - x1,
			height : y2 - y1,
		};

		this.lights = new Array(coordinates.length);
		for (let i=0; i<coordinates.length; ++i) {
			var light = {};
			light.x1 = coordinates[i].X1 - x1;
			light.y1 = coordinates[i].Y1 - y1;
			light.x2 = coordinates[i].X2 - x1;
			light.y2 = coordinates[i].Y2 - y1;

			light.x = (light.x1 + light.x2) / 2;//Center X
			light.y = (light.y1 + light.y2) / 2;//Center Y
//			light.code = (i < keycodes.length) ? keycodes[i] : '';
			this.lights[i] = light;
		}

		// given name, return light index
		var array = new Array(keycodes.length);
		for (let i=0; i<keycodes.length; ++i)
			array[i] = [keycodes[i], i];
		this.keycodemap = new Map(array);

	}
	
	move(dx, dy) {
		this.position.x += dx;
		this.position.y += dy;
		this.region.x += dx;
		this.region.y += dy;
		for (let light of this.lights) {
			light.x1 += dx;
			light.y1 += dy;
			light.x2 += dx;
			light.y2 += dy;
			light.x  += dx;
			light.y  += dy;
		}
	}
	moveTo(dx, dy) {
		const init = {position:this.position,region:this.region,lights:this.lights};
		this.position.x = init.position.x + dx;
		this.position.y = init.position.y + dy;
		this.region.x = init.region.x + dx;
		this.region.y = init.region.y + dy;
		for (let i=0; i<this.lights.length; ++i) {
			this.lights[i].x1 = init.lights[i].x1 + dx;
			this.lights[i].y1 = init.lights[i].y1 + dy;
			this.lights[i].x2 = init.lights[i].x2 + dx;
			this.lights[i].y2 = init.lights[i].y2 + dy;
			this.lights[i].x  = init.lights[i].x + dx;
			this.lights[i].y  = init.lights[i].y + dy;
		}

	}
	draw(ctx, colors, selects) {
		ctx.roundRect(this.position.x, this.position.y, this.position.width, this.position.height, 16);
		ctx.fillStyle = 'rgb(32,32,32)';
		ctx.fill();

		if (this.image)
			ctx.drawImage(this.image, this.position.x, this.position.y);

		for (let i=0; i<this.lights.length; ++i) {
			var light = this.lights[i];
			ctx.roundRect(light.x1, light.y1, light.x2 - light.x1, light.y2 - light.y1, 6);
			if (colors && colors[i]) {
				ctx.fillStyle = 'rgba(' + colors[i][0] + ',' + colors[i][1] + ',' + colors[i][2] + ', 0.6)';
				ctx.fill();
			}
			if (selects && selects[i]) {
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(204,172,0,1.0)';
				ctx.stroke();
			}
		}
	}
}

//------------device.js-------------

//------------Color.js-------------

function hsl2rgb(h, s, l) {
	if (!isFinite(h)) h = 0;
	if (!isFinite(s)) s = 0;
	if (!isFinite(l)) l = 0;

	h /= 60;
	if (h < 0) h = 6 - (-h % 6);
	h %= 6;

	s = Math.max(0, Math.min(1, s / 100));
	l = Math.max(0, Math.min(1, l / 100));

	var c = (1 - Math.abs((2 * l) - 1)) * s;
	var x = c * (1 - Math.abs((h % 2) - 1));

	if      (h < 1) {r = c; g = x; b = 0;}
	else if (h < 2) {r = x; g = c; b = 0;}
	else if (h < 3) {r = 0; g = c; b = x;}
	else if (h < 4) {r = 0; g = x; b = c;}
	else if (h < 5) {r = x; g = 0; b = c;}
	else            {r = c; g = 0; b = x;}

	var m = l - c / 2;
	var r = Math.round((r + m) * 255);
	var g = Math.round((g + m) * 255);
	var b = Math.round((b + m) * 255);
	return [r, g, b];
}

function assigncolor(color, color1) {
	for (let i=0; i<3; ++i)
		color[i] = color1[i];
}

function addcolor(color, color1) {
	for (let i=0; i<3; ++i)
		color[i] += color1[i];
}

function mulcolor(color, ratio) {
	for (let i=0; i<3; ++i)
		color[i] *= ratio;
}

function softcolor(color, ratio) {
	ratio = 1 - Math.abs(ratio * 2 - 1);	// linear mountain
	ratio = 1 - Math.pow(2, -5 * ratio);	// easeOutExpo
	mulcolor(color, ratio);
}

function interpolatecolor(color, color1, color2, ratio) {
	for (let i=0; i<3; ++i)
		color[i] = color1[i] * (1 - ratio) + color2[i] * ratio;
}
//------------Color.js-------------
//------------effect.js-------------
class Effect {
	constructor() {
		this.opacity = 1;
		Effect.prototype.blend_mode = 'overlap';
		this.defaultcolors = [
			hsl2rgb( 0, 100, 50),
			hsl2rgb( 30, 100, 50),
			hsl2rgb( 90, 100, 50),
			hsl2rgb( 120, 100, 50),
			hsl2rgb( 180, 100, 50),
			hsl2rgb( 240, 100, 50),
			hsl2rgb( 300, 100, 50),
			hsl2rgb( 330, 100, 50),
			hsl2rgb( 300, 100, 100),

			// hsl2rgb( 45, 60, 60),
			// hsl2rgb(135, 60, 60),
			// hsl2rgb(225, 60, 60),
			// hsl2rgb(315, 60, 60),
			//[192,192,192]
		];
		this.defaultscales = [
            //0, 0.2, 0.4, 0.6, 0.8
			0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1
		];
		this.colors = new Array(this.defaultcolors.length);
		for (let i=0; i<this.defaultcolors.length; ++i) {
			this.colors[i] = [0,0,0];
			assigncolor(this.colors[i], this.defaultcolors[i]);
		}
		this.scales = this.defaultscales.slice(0);
		this.color_number = 9;
		this.use_scales = false;
	}
	initGUI() {
		// this.gui = new dat.GUI({hideable: false});
		// this.gui.hide();
		// this.folder = this.gui.addFolder('colors');
		// this.folder.open();
		//this.folder.add(this, "opacity").min(0).max(1).step(0.1);
		this.guicolors = new Array(this.defaultcolors.length);
		this.guiscales = new Array(this.defaultscales.length);
		for (let i=0; i<this.color_number; ++i) {
			//this.guicolors[i] = this.folder.addColor(this.colors, i, this.colors[i]).name('color ' + (i+1));
			//if (this.use_scales) this.guiscales[i] = this.folder.add(this.scales, i, this.scales[i]).name('scale ' + (i+1)).min(0).max(1).step(.1);
		}
	}
	createColor() {
		if (this.color_number >= this.defaultcolors.length) return;
		var i = this.color_number++;
		assigncolor(this.colors[i], this.defaultcolors[i]);
		this.scales[i] = this.defaultscales[i];

		this.guicolors[i] = this.folder.addColor(this.colors, i, this.colors[i]).name('color ' + (i+1));
		if (this.use_scales) this.guiscales[i] = this.folder.add(this.scales, i, this.scales[i]).name('scale ' + (i+1)).min(0).max(1).step(.1);
	}
	removeColor() {
		if (this.color_number <= 1) return;
		var i = --this.color_number;

		this.folder.remove(this.guicolors[i]);
		if (this.use_scales) this.folder.remove(this.guiscales[i]);
	}
	toggleColorScale() {
		this.use_scales = !this.use_scales;
		if (this.use_scales) {
			for (let i=0; i<this.color_number; ++i)
				this.folder.remove(this.guicolors[i]);
			for (let i=0; i<this.color_number; ++i) {
				this.guicolors[i] = this.folder.addColor(this.colors, i, this.colors[i]).name('color ' + (i+1));
				this.guiscales[i] = this.folder.add(this.scales, i, this.scales[i]).name('scale ' + (i+1)).min(0).max(1).step(.1);
			}
		} else {
			for (let i=0; i<this.color_number; ++i)
				this.folder.remove(this.guiscales[i]);
		}
	}
	getColor(result, scale, loop) {
		scale -= Math.floor(scale);	// [0, 1)
		if (!this.use_scales) {
			if (!this.gradient) {
				scale *= this.color_number;
				var index = Math.floor(scale);
				assigncolor(result, this.colors[index]);
			} else {
				if (loop) scale *= this.color_number;
				else      scale *= (this.color_number - 1);
				if (loop) scale -= 0.5;		// align to !gradient
				var index = Math.floor(scale);
				var color1 = this.colors[(index + this.color_number) % this.color_number];
				var color2 = this.colors[(index + 1) % this.color_number];
				var ratio = scale - index;
				interpolatecolor(result, color1, color2, ratio);
			}
		} else {
			var min_index = 0;
			var min_scale = 1.1;
			var max_index = 0;
			var max_scale = 0;
			for (let i=0; i<this.color_number; ++i) {
				if (this.scales[i] >= max_scale)
					max_scale = this.scales[max_index = i];
				if (this.scales[i] < min_scale)
					min_scale = this.scales[min_index = i];
			}
		
			var lower_index = -1;
			var lower_scale = 0;
			var upper_index = this.color_number;
			var upper_scale = 1;
			for (let i=0; i<this.color_number; ++i)
				if (this.scales[i] <= scale) {
					if (this.scales[i] >= lower_scale)
						lower_scale = this.scales[lower_index = i];
				} else {
					if (this.scales[i] < upper_scale)
						upper_scale = this.scales[upper_index = i];
				}
		
			if (loop) {
				if (lower_index == -1)
					lower_scale = this.scales[lower_index = max_index] - 1;
				if (upper_index == this.color_number)
					upper_scale = this.scales[upper_index = min_index] + 1;
			} else {
				if (lower_index == -1)
					lower_scale = this.scales[lower_index = min_index];
				if (upper_index == this.color_number)
					upper_scale = this.scales[upper_index = max_index];
			}
	
			if (!this.gradient) {
				assigncolor(result, this.colors[lower_index]);
			} else {
				if (lower_scale == upper_scale)
					assigncolor(result, this.colors[lower_index]);
				else {
					var color1 = this.colors[lower_index];
					var color2 = this.colors[upper_index];
					var ratio = (scale - lower_scale) / (upper_scale - lower_scale);
					interpolatecolor(result, color1, color2, ratio);
				}
			}
		}
	}
	blendColor(result, color) {
		if (Effect.prototype.blend_mode === 'add')
			addscaledcolor(result, color, this.opacity);
		else if (Effect.prototype.blend_mode === 'overlap')
			interpolatecolor(result, result, color, this.opacity);
	}
	event(light) {
		// empty
	}
	init(region) {
		// empty
	}
	center(x, y) {
		// empty
	}
	draw(ctx) {
		// empty
	}
}

class Static extends Effect {
	constructor() {
		super();
		this.description = "Static";
		this.position = 0;
	}
	update() {
		this.position = 0;
	}
	render(lights, region, outputs, selects) {
		var output = [0,0,0];
		var scale = this.position;
		this.getColor(output, scale, true);

		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			this.blendColor(outputs[i], output);
		}
	}
}
class AudioCap extends Effect {
	constructor() {
		super();
		this.description = "Wave";
		this.speed = 5;
		this.bandwidth = 300;
		this.angle = 0;		// degree
		this.gradient = true;

		this.position = 0;
		
		this.Color1 = this.colors[0];
		
	}
	update() {
		this.position += this.speed;
	}
	render(lights, region, outputs, selects) {

		if (g_DataAudio != null) 
		{

			for (var i=0; i<lights.length; i++) {
				if (!selects[i]) continue;
				
				var light = lights[i];
				var xAXis = Math.floor((light.x-region.x)*256/(region.width));
				var yAXis = Math.floor((light.y-region.y)*64/(region.height));
				// if (g_DataAudio[yAXis][xAXis] == undefined) {
				// 	var fgdxg = 0;
				// }
				
	
				var col = [g_DataAudio[yAXis][xAXis].R,g_DataAudio[yAXis][xAXis].G,g_DataAudio[yAXis][xAXis].B];
				var output = [0,0,0];
				if (col[0] >0 || col[1] >0 || col[2] >0) {
					
					output = this.Color1;
					this.blendColor(outputs[i], output);
				}
			}
		}

		
		
	}
}
class Wave extends Effect {
	constructor() {
		super();
		this.description = "Wave";
		this.speed = 5;
		this.bandwidth = 300;
		this.angle = 0;		// degree
		this.gradient = true;

		this.position = 0;
	}
	update() {
		this.position += this.speed;
		this.position %= this.bandwidth * this.color_number;
	}
	render(lights, region, outputs, selects) {
		var theta = 2 * Math.PI * this.angle / 360;
		var dx =  Math.cos(theta);
		var dy = -Math.sin(theta);
		if (Math.abs(dx) < 1e-5) dx = 0;
		if (Math.abs(dy) < 1e-5) dy = 0;

		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var d = light.x * dx + light.y * dy;
			var scale = (d - this.position) / this.bandwidth / this.color_number;
			var output = [0,0,0];
			this.getColor(output, scale, true);
			this.blendColor(outputs[i], output);
		}
	}
}

class ConicBand extends Effect {
	constructor() {
		super();
		this.description = "ConicBand";
		this.speed = 5;
		this.bandwidth = 300;
		this.direction = true;
		this.gradient = true;

		this.position = 0;
	}
	init(region) {
		this.x = region.width  / 2;
		this.y = region.height / 2;
	}
	center(x, y) {
		this.x = x;
		this.y = y;
	}
	update() {
		this.position += this.speed * (this.direction ? +1 : -1);
		this.position %= this.bandwidth * this.color_number;
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var d = Math.hypot(light.x - this.x, light.y - this.y);
			var scale = (d - this.position) / this.bandwidth / this.color_number;
			var output = [0,0,0];
			this.getColor(output, scale, true);
			this.blendColor(outputs[i], output);
		}
	}
}

class Spiral extends Effect {
	constructor() {
		super();
		this.description = "Spiral";
		this.speed = 10;
		this.direction = true;
		this.gradient = true;

		this.angle = 0;								// degree
		this.bandangle = 360 / this.color_number;	// degree
	}
	init(region) {
		this.x = region.width  / 2;
		this.y = region.height / 2;
	}
	center(x, y) {
		this.x = x;
		this.y = y;
	}
	update() {
		this.angle += this.speed * (this.direction ? -1 : +1);
		this.angle %= 360;
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var t = Math.atan2(-(light.y - this.y), light.x - this.x);
			t = t / (2 * Math.PI) * 360;
			this.bandangle = 360 / this.color_number;
			var scale = (t - this.angle) / this.bandangle / this.color_number;
			var output = [0,0,0];
			this.getColor(output, scale, true);
			this.blendColor(outputs[i], output);
		}
	}
}

class Cycle extends Effect {
	constructor() {
		super();
		this.description = "Cycle";
		this.bandwidth = 100;
		this.speed = 10;
		this.gradient = true;

		this.position = 0;
	}
	update() {
		this.position += this.speed;
		this.position %= this.bandwidth * this.color_number;
	}
	render(lights, region, outputs, selects) {
		var output = [0,0,0];
		var scale = this.position / this.bandwidth / this.color_number;
		this.getColor(output, scale, true);

		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			this.blendColor(outputs[i], output);
		}
	}
}

class Breathing extends Effect {
	constructor() {
		super();
		this.description = "Breathing";
		this.speed = 1;
		this.bandwidth = 100;
		this.gap = 100;
		this.gradient = false;
		this.fade = true;

		this.position = 0;
	}
	update() {
		this.position += this.speed;
		this.position %= (this.bandwidth + this.gap) * this.color_number;
	}
	render(lights, region, outputs, selects) {
		var output = [0,0,0];

		var quotient = this.position / (this.bandwidth + this.gap);
		quotient = Math.floor(quotient);
		var residue = this.position - quotient * (this.bandwidth + this.gap);
		if (residue > this.bandwidth) return;

		var scale = (quotient + residue / this.bandwidth) / this.color_number;
		this.getColor(output, scale, false);

		if (this.fade) {
			var ratio = residue / this.bandwidth;
			softcolor(output, ratio);
		}

		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			this.blendColor(outputs[i], output);
		}
	}
}

class Rain extends Effect {
	constructor() {
		super();
		this.description = "Rain";
		this.speed = 10;
		this.number = 10;
		this.angle = 0;
	}
	init(region) {
		this.particles = new Array(this.number);
		for (let i=0; i<this.particles.length; ++i) {
			this.particles[i] = {
				x: region.width  * Math.random(),
				y: region.height * Math.random(),
				color: this.colors[i % this.color_number],
			};
		}
		this.color_index = this.number % this.color_number;
	}
	nextcolor() {
		this.color_index++;
		this.color_index %= this.color_number;
		return this.colors[this.color_index];
	}
	update(region) {
		var theta = 2 * Math.PI * this.angle / 360;
		var dx =  Math.cos(theta);
		var dy = -Math.sin(theta);
		if (Math.abs(dx) < 1e-5) dx = 0;
		if (Math.abs(dy) < 1e-5) dy = 0;

		for (let i=0; i<this.number; ++i) {
			var p = this.particles[i];
			p.x += dx * this.speed;
			p.y += dy * this.speed;
			if (p.x < 0) {
				p.x = region.width;
				p.y = region.height * Math.random();
				p.color = this.nextcolor();
			} else if (p.x > region.width) {
				p.x = 0;
				p.y = region.height * Math.random();
				p.color = this.nextcolor();
			} else if (p.y < 0) {
				p.x = region.width  * Math.random();
				p.y = region.height;
				p.color = this.nextcolor();
			} else if (p.y > region.height) {
				p.x = region.width  * Math.random();
				p.y = 0;
				p.color = this.nextcolor();
			}
		}
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var output = [0,0,0];
			var has_output = false;
			for (let k=0; k<this.number; ++k) {
				var p = this.particles[k];
				if (p.x >= light.x1 && p.x <= light.x2
				 && p.y >= light.y1 && p.y <= light.y2) {
//					addcolor(output, p.color);
					assigncolor(output, p.color);
					has_output = true;
				}
			}
			if (has_output)
				this.blendColor(outputs[i], output);
		}
	}
}

class Fire extends Effect {
	constructor() {
		super();
		this.description = "Fire";
		this.diffuse = 0.1;
		this.fire = 0.5;
		this.gradient = true;

//		this.defaultcolors[4] = [255, 255, 128];
//		this.defaultcolors[3] = [255, 255, 64];
//		this.defaultcolors[2] = [255, 255, 32];
//		this.defaultcolors[1] = [255, 32, 0];
//		this.defaultcolors[0] = [32, 32, 0]
//		for (let i=0; i<this.defaultcolors.length; ++i)
//			assigncolor(this.colors[i], this.defaultcolors[i]);
	}
	init(region) {
		this.size = 50;	// KEY WIDTH & HEIGHT
		this.X = Math.ceil(region.width / this.size);
		this.Y = Math.ceil(region.height / this.size);
		this.array = new Array(this.Y + 2);
		for (let y=0; y<this.array.length; ++y)
			this.array[y] = new Float32Array(this.X + 2).fill(0);
	}
	update() {
		var one_minus_diffuse = 1 - this.diffuse;

		if (!this.array) return;
		for (let y=1; y<this.Y; ++y) {
			for (let x=1; x<=this.X; ++x) {
				this.array[y][x] *= one_minus_diffuse;
				var value = 0;
				if (x == 0) {
					value += this.array[y+1][x];
					value += this.array[y+1][x+1];
					this.array[y][x] += value / 2 * this.diffuse;
				} else if (x == this.X - 1) {
					value += this.array[y+1][x];
					value += this.array[y+1][x-1];
					this.array[y][x] += value / 2 * this.diffuse;
				} else {
					value += this.array[y+1][x];
					value += this.array[y+1][x-1];
					value += this.array[y+1][x+1];
					this.array[y][x] += value / 3 * this.diffuse;
				}
			}
		}

		for (let x=1; x<=this.X; ++x) {
			this.array[this.Y][x] *= (one_minus_diffuse + this.diffuse / 2);
			if (Math.random() < this.fire * 0.01)
				this.array[this.Y][x] += 10;
			if (this.array[this.Y][x] >= 100)
				this.array[this.Y][x] = 100;
		}
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var output = [255, 7, 0];
			var x = (light.x - region.x) / this.size + 0.5;
			var y = (light.y - region.y) / this.size + 0.5;
			var x0 = x | 0;  var x1 = x0 + 1;
			var y0 = y | 0;  var y1 = y0 + 1;
			var s1 = x - x0; var s0 = 1 - s1;
			var t1 = y - y0; var t0 = 1 - t1;
			if (!(x0 >= 0 && x1 <= this.X+1
			   && y0 >= 0 && y1 <= this.Y+1)) continue;
			var scale = s0 * (t0 * this.array[y0][x0] + t1 * this.array[y1][x0])
			          + s1 * (t0 * this.array[y0][x1] + t1 * this.array[y1][x1]);
//			var scale = this.array[y0][x0];
//			this.getColor(output, scale, false);
			mulcolor(output, scale);
			this.blendColor(outputs[i], output);
		}
	}
}


class LinearWave extends Effect {
	constructor() {
		super();
		this.description = "直線波紋(晴朗)";
		this.speed = 10;
		this.bandwidth = 100;
		this.gap = 0;
		this.width = (this.bandwidth + this.gap) * this.color_number - this.gap;
		this.bump = 0;
		this.angle = 0;

		this.fps = 60;
		this.randomspeed = 0;
		this.gradient = false;
		this.soft = false;
		this.fixed = false;
		this.bidirectional = true;

		this.frame = 0;
		this.animations = [];	// cicular queue
	}
	event(light) {
		this.animations.push({
			position : 0,
			direction : +1,
			bump : 0,
			x : light.x,
			y : light.y,
			life : 1,
		});
		if (!this.bidirectional) return;
		this.animations.push({
			position : 0,
			direction : -1,
			bump : 0,
			x : light.x,
			y : light.y,
			life : 1,
		});
	}
	update(region, devices) {
		this.width = (this.bandwidth + this.gap) * this.color_number - this.gap;
		var theta = 2 * Math.PI * this.angle / 360;
		var dx =  Math.cos(theta);
		var dy = -Math.sin(theta);
		if (Math.abs(dx) < 1e-5) dx = 0;
		if (Math.abs(dy) < 1e-5) dy = 0;
		var d = region.x * dx + region.y * dy;
		var rx = region.width * dx;
		var ry = region.height * dy;
		var dmin = d + Math.min(rx, 0) + Math.min(ry, 0);
		var dmax = d + Math.max(rx, 0) + Math.max(ry, 0);

		for (let animation of this.animations) {
			if (!animation.life) continue;
			animation.position += this.speed;
			var d = (animation.x * dx + animation.y * dy) * animation.direction;
			var D = (animation.direction === +1) ? dmax: -dmin;
			if (d + animation.position > D + this.width) {
				animation.bump++;
				animation.position = 0;
				animation.x = region.x + region.width * (rx * animation.direction > 0);
				animation.y = region.y + region.height * (ry *animation.direction > 0);
				animation.direction *= -1;
			}
			if (animation.bump > this.bump)
				animation.life--;
		}
		while (this.animations.length > 0
			&& !this.animations[0].life)
//			&& this.animations[0].position - this.width > region.diameter)
			this.animations.shift();

		if (this.randomspeed > 0) {
			this.frame ++;
			this.frame %= Math.ceil(1000 / this.fps / this.randomspeed);
			if (this.frame == 0) {
				for (let i=0; i<devices.length; ++i) {
					var lights = devices[i].lights;
					if (lights.length == 0) continue;
					var index = Math.floor(Math.random() * lights.length);
					this.event(lights[index]);
				}
			}
		}
	}
	render(lights, region, outputs, selects) {
		var theta = 2 * Math.PI * this.angle / 360;
		var dx =  Math.cos(theta);
		var dy = -Math.sin(theta);
		if (Math.abs(dx) < 1e-5) dx = 0;
		if (Math.abs(dy) < 1e-5) dy = 0;

		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var output = [0,0,0];
			var has_output = false;
			for (let animation of this.animations) {
				if (!animation.life) continue;
				var d = (light.x - animation.x) * dx
				      + (light.y - animation.y) * dy;
				d *= animation.direction;
				if (d < 0) continue;
				if (!(d >= animation.position - this.width && d < animation.position)) continue;

				var position = d - (animation.position - this.width);
				var quotient = position / (this.bandwidth + this.gap);
				quotient = Math.floor(quotient);
				var residue = position - quotient * (this.bandwidth + this.gap);
				if (residue > this.bandwidth) continue;

				var color = [0,0,0];
				if (this.fixed) {
					var scale = (quotient + residue / this.bandwidth) / this.color_number;
					this.getColor(color, scale, false);
				} else {
					var D = Math.abs(region.width  * dx)
					      + Math.abs(region.height * dy);
					if (d >= D) continue;
					var scale = d / D;
					this.getColor(color, scale, false);
				}
				if (this.soft) {
					var ratio = residue / this.bandwidth;
					if (this.gap == 0) ratio = position / this.width;
					softcolor(color, ratio);
				}
				addcolor(output, color);
				has_output = true;
			}
			if (has_output)
				this.blendColor(outputs[i], output);
		}
	}
}

class Ripple extends Effect {
	constructor() {
		super();
		this.description = "擴散波紋";
		this.speed = 10;
		this.bandwidth = 50;
		this.gap = 0;
		this.width = (this.bandwidth + this.gap) * this.color_number - this.gap;

		this.fps = 60;
		this.randomspeed = 0;
		this.gradient = true;
		this.soft = true;
		this.fixed = false;

		this.frame = 0;
		this.animations = [];	// cicular queue
	}
	event(light) {
		this.animations.push({
			position : 0,
			x : light.x,
			y : light.y,
		});
	}
	update(region, devices) {
		this.width = (this.bandwidth + this.gap) * this.color_number - this.gap;

		for (let animation of this.animations)
			animation.position += this.speed;
		while (this.animations.length > 0
			&& this.animations[0].position - this.width > region.diameter)
			this.animations.shift();

		if (this.randomspeed > 0) {
			this.frame ++;
			this.frame %= Math.ceil(1000 / this.fps / this.randomspeed);
			if (this.frame == 0) {
				for (let i=0; i<devices.length; ++i) {
					var lights = devices[i].lights;
					if (lights.length == 0) continue;
					var index = Math.floor(Math.random() * lights.length);
					this.event(lights[index]);
				}
			}
		}
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var output = [0,0,0];
			var has_output = false;
			for (let animation of this.animations) {
				var d = Math.hypot(light.x - animation.x, light.y - animation.y);
				if (!(d >= animation.position - this.width && d < animation.position)) continue;

				var position = d - (animation.position - this.width);
				var quotient = position / (this.bandwidth + this.gap);
				quotient = Math.floor(quotient);
				var residue = position - quotient * (this.bandwidth + this.gap);
				if (residue > this.bandwidth) continue;

				var color = [0,0,0];
				if (this.fixed) {
					var scale = (quotient + residue / this.bandwidth) / this.color_number;
					this.getColor(color, scale, false);
				} else {
					var D = region.diameter;
					if (d >= D) continue;
					var scale = d / D;
					this.getColor(color, scale, false);
				}
				if (this.soft) {
					var ratio = residue / this.bandwidth;
					if (this.gap == 0) ratio = position / this.width;
					softcolor(color, ratio);
				}
				addcolor(output, color);
				has_output = true;
			}
			if (has_output)
				this.blendColor(outputs[i], output);
		}
	}
}

class Trigger extends Effect {
	constructor() {
		super();
		this.description = "Trigger";
		this.fps  = 60;
		this.time = 3.0;	// second
		this.maxlife = Math.ceil(this.time * 1000 / this.fps);
		this.radius = 0;
		this.randomspeed = 0;
		this.gradient = false;
		this.soft = true;
		this.separate = false;

		this.frame = 0;
		this.color_index = 0;
		this.animations = [];	// cicular queue
	}
	event(light) {
		this.animations.push({
			life  : 0,
			light : light,
			color : this.colors[this.color_index],
		});
		this.color_index = (this.color_index + 1) % this.color_number;
	}
	update(region, devices) {
		this.maxlife = Math.ceil(this.time * 1000 / this.fps);
		for (let animation of this.animations)
			animation.life++;
		while (this.animations.length > 0 && this.animations[0].life > this.maxlife)
			this.animations.shift();

		if (this.randomspeed > 0) {
			this.frame ++;
			this.frame %= Math.ceil(1000 / this.fps / this.randomspeed);
			if (this.frame == 0) {
				for (let i=0; i<devices.length; ++i) {
					var lights = devices[i].lights;
					if (lights.length == 0) continue;
					var index = Math.floor(Math.random() * lights.length);
					this.event(lights[index]);
				}
			}
		}
	}
	render(lights, region, outputs, selects) {
		for (let i=0; i<lights.length; ++i) {
			if (!selects[i]) continue;
			var light = lights[i];
			var output = [0,0,0];
			var has_output = false;
			for (let animation of this.animations) {
				var d = Math.hypot(light.x - animation.light.x, light.y - animation.light.y);
				if (d > this.radius) continue;
				if (this.separate) {
					assigncolor(output, animation.color);
				} else {
					var scale = animation.life / this.maxlife;
					this.getColor(output, scale, false);
				}
				if (this.soft) {
					var ratio = animation.life / this.maxlife;
					softcolor(output, ratio);
				}
				has_output = true;
			}
			if (has_output)
				this.blendColor(outputs[i], output);
		}
	}
}


//------------effect.js-------------
//------------manager.js---------------
class Manager {
	constructor() {
		this.devices = [];
		this.effects = [];
		this.outputs = [];	// device -> [r,g,b] array
		this.selects = [];	// (device, effect) -> bool array
		this.blends = [];	// effect -> bool

		this.region = {
			x        : 0,
			y        : 0,
			width    : 0,
			height   : 0,
			diameter : 0,
		};

		this.effect_index = -1;
		this.effect = null;
		this.device_index = -1;
		this.device = null;

		this.show_effect = null;
	}
	reset() {
		this.outputs = new Array(this.devices.length);
		for (let i=0; i<this.devices.length; ++i) {
			this.outputs[i] = new Array(this.devices[i].lights.length);
			for (let j=0; j<this.outputs[i].length; ++j) {
				this.outputs[i][j] = [0,0,0];
			}
		}

		this.selects = new Array(this.devices.length);
		for (let i=0; i<this.devices.length; ++i) {
			this.selects[i] = new Array(this.effects.length);
			for (let j=0; j<this.effects.length; ++j) {
				this.selects[i][j] = new Array(this.devices[i].lights.length).fill(true);
			}
		}

		this.blends = new Array(this.effects.length).fill(true);
	}
	updateRegion() {
		var x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
		for (let device of this.devices) {
			x1 = Math.min(x1, device.region.x);
			y1 = Math.min(y1, device.region.y);
			x2 = Math.max(x2, device.region.x + device.region.width);
			y2 = Math.max(y2, device.region.y + device.region.height);
		}
		this.region.x = x1;
		this.region.y = y1;
		this.region.width  = x2 - x1;
		this.region.height = y2 - y1;
		this.region.diameter = Math.hypot(x2 - x1, y2 - y1);
	}
	updateEffects() {
		for (let i=0; i<this.effects.length; ++i)
			this.effects[i].init(this.region);
	}
	setBlendMode(blend_mode) {
		Effect.prototype.blend_mode = blend_mode;
	}
	pushDevice(device) {
		this.devices.push(device);

		var outputs = new Array(device.lights.length);
		for (let j=0; j<outputs.length; ++j)
			outputs[j] = [0,0,0];
		this.outputs.push(outputs);

		var selects = new Array(this.effects.length);
		for (let j=0; j<selects.length; ++j)
			selects[j] = new Array(device.lights.length).fill(true);
		this.selects.push(selects);

		// screen position
		// var x = this.devices.length * 20;
		// var y = this.devices.length * 20;
		// device.move(x, y);
		//------------------------------

		//-----------------------------
		this.updateRegion();
		this.updateEffects();
	}
	popDevice() {
		this.devices.pop();
		this.outputs.pop();
		this.selects.pop();
		this.updateRegion();
		this.updateEffects();
	}
	pushEffect(effect) {
		effect.init(this.region);
		this.effects.push(effect);
		for (let i=0; i<this.devices.length; ++i) {
			var selects = new Array(this.devices[i].lights.length).fill(false);//Select All True
			this.selects[i].push(selects);
		}
		this.blends.push(true);

		if (this.effect_index < 0)
			this.effect = this.effects[this.effect_index = 0];

		effect.initGUI();
		//this.showGUI();
	}
	popEffect() {
		if (this.effects.length == 0) return;

		this.effects.pop();
		for (let i=0; i<this.devices.length; ++i)
			this.selects[i].pop();
		this.blends.pop();

		if (this.effect_index >= this.effects.length)
			this.effect_index--;
		if (this.effect_index < 0)
			this.effect = null;
		else
			this.effect = this.effects[this.effect_index];

		//this.showGUI();
	}
	insertEffect(effect) {
		if (this.effect_index < 0) this.effect_index = 0;

		effect.init(this.region);
		this.effects.splice(this.effect_index, 0, effect);
		for (let i=0; i<this.devices.length; ++i) {
			var selects = new Array(this.devices[i].lights.length).fill(true);
			this.selects[i].splice(this.effect_index, 0, selects);
		}
		this.blends.splice(this.effect_index, 0, true);

		this.effect = this.effects[this.effect_index];

		effect.initGUI();
		this.showGUI();
	}
	insertAfterEffect(effect) {
		this.effect_index++;
		this.insertEffect(effect);
	}
	deleteEffect() {
		if (this.effects.length == 0) return;

		this.effects.splice(this.effect_index, 1);
		for (let i=0; i<this.devices.length; ++i)
			this.selects[i].splice(this.effect_index, 1);
		this.blends.splice(this.effect_index, 1);

		if (this.effect_index >= this.effects.length)
			this.effect_index--;
		if (this.effect_index < 0)
			this.effect = null;
		else
			this.effect = this.effects[this.effect_index];

		this.showGUI();
	}
	toggleEffect() {
		if (!(this.effect_index >= 0 && this.effect_index < this.effects.length)) return;
		this.blends[this.effect_index] = !this.blends[this.effect_index];
		this.showGUI();
	}
	selectEffect(index) {
		if (!(index >= 0 && index < this.effects.length)) return;
		this.effect = this.effects[this.effect_index = index];
		this.showGUI();
	}
	changeEffect(diff) {
		var index = this.effect_index + diff;
		if (index < 0) index = 0;
		if (index >= this.effects.length - 1) index = this.effects.length - 1;
		if (index == this.effect_index) return;
		this.effect = this.effects[this.effect_index = index];
		this.showGUI();
	}
//	initGUI() {
//		for (let effect of this.effects) effect.initGUI();
//		this.effect_index = 0;
//		this.effect = this.effects[this.effect_index];
//		this.showGUI();
//	}
	showGUI() {
		if (this.show_effect)
			this.show_effect.gui.hide();
		if (this.effect_index < 0) {
			this.show_effect = null;
		} else {
			this.show_effect = this.effect;
			this.show_effect.gui.show();
		}
		this.showEffectNames();
	}
	showEffectNames() {
		if (this.effects.length == 0) {
			output.innerHTML = '請新增燈效';
			return;
		}
		var str = '';
		for (let i=0; i<this.effects.length; ++i) {
			var effect = this.effects[i];
			var blend = this.blends[i];
			if (effect == this.effect) str += '<strong><span style="color: gold;">'
			if (!blend) str += '<span style="opacity: 0.3;">';
			str += ' � ';
			str += effect.description;
//			str += ' ' + effect.constructor.name;
			if (!blend) str += '</span>';
			if (effect == this.effect) str += '</span></strong>'
		}
		output.innerHTML = str;
	}
	event(device_type, keycode) {
		for (let i=0; i<this.devices.length; ++i) {
			var device = this.devices[i];
			if (device.type != device_type) continue;
			//if (device.type === 'keyboard') {
				var index = device.keycodemap.get(keycode);
				if (index == null) continue;
			// } else if (device.type === 'mouse') {
			// 	var index = device.lights.length - 1;
			// 	if (index < 0) continue;
			// }
			var light = device.lights[index];
			for (let j=0; j<this.effects.length; ++j)
				this.effects[j].event(light);
		}
	}
	center(x, y) {
		if (!this.effect) return;
		this.effect.center(x, y);
	}
	update() {
		for (let effect of this.effects)
			effect.update(this.region, this.devices);
	}
	render() {
		for (let i=0; i<this.devices.length; ++i)
			for (let j=0; j<this.outputs[i].length; ++j)
				assigncolor(this.outputs[i][j], [0,0,0]);

		if (!this.effect) return;
		if (!this.blends[this.effect_index]) return;
		for (let i=0; i<this.devices.length; ++i) {
			var device = this.devices[i];
			var outputs = this.outputs[i];
			var selects = this.selects[i][this.effect_index];
			this.effect.render(device.lights, this.region, outputs, selects);
		}
	}
	draw(ctx) {
		for (let i=0; i<this.devices.length; ++i) {
			var device = this.devices[i];
			var outputs = this.outputs[i];
			var selects = this.selects[i][this.effect_index];
			device.draw(ctx, outputs, selects);
		}
		if (this.effect) this.effect.draw(ctx);
	}
	renderAll() {
		for (let i=0; i<this.devices.length; ++i)
			for (let j=0; j<this.outputs[i].length; ++j)
				assigncolor(this.outputs[i][j], [0,0,0]);

		for (let i=0; i<this.devices.length; ++i) {
			var device = this.devices[i];
			var outputs = this.outputs[i];
			for (let j=0; j<this.effects.length; ++j) {
				var effect = this.effects[j];
				var selects = this.selects[i][j];
				var blend = this.blends[j];
				if (!blend) continue;
				effect.render(device.lights, this.region, outputs, selects);
			}
		}
	}
	drawAll(ctx) {
		for (let i=0; i<this.devices.length; ++i) {
			var device = this.devices[i];
			var outputs = this.outputs[i];
			device.draw(ctx, outputs, null);
		}
	}
//	flush() {
//		for (let i=0; i<this.devices.length; ++i)
//			for (let j=0; j<this.outputs[i].length; ++j) {
//				this.outputs[i][j][0] = Math.min(255, this.outputs[i][j][0]);
//				this.outputs[i][j][1] = Math.min(255, this.outputs[i][j][1]);
//				this.outputs[i][j][2] = Math.min(255, this.outputs[i][j][2]);
//			}
//	}
	selectAll(bool) {
		if (!(this.effect_index >= 0 && this.effect_index < this.effects.length)) return;
		for (let i=0; i<this.devices.length; ++i) {
			var select = this.selects[i][this.effect_index];
			for (let j=0; j<select.length; ++j)
				select[j] = bool;
		}
	}
	selectXY(x, y, bool) {
		if (!(this.effect_index >= 0 && this.effect_index < this.effects.length)) return;
		for (let i=0; i<this.devices.length; ++i) {
			var select = this.selects[i][this.effect_index];
			for (let j=0; j<select.length; ++j) {
				var light = this.devices[i].lights[j];
				if (x >= light.x1 && x <= light.x2
				 && y >= light.y1 && y <= light.y2)
					select[j] = bool;
			}
		}
	}
	selectSegment(x1, y1, x2, y2, bool) {
		if (!(this.effect_index >= 0 && this.effect_index < this.effects.length)) return;
		for (let i=0; i<this.devices.length; ++i) {
			var select = this.selects[i][this.effect_index];
			for (let j=0; j<select.length; ++j) {
				var light = this.devices[i].lights[j];
				if (x1 < light.x1 && x2 < light.x1) continue;
				if (x1 > light.x2 && x2 > light.x2) continue;
				if (y1 < light.y1 && y2 < light.y1) continue;
				if (y1 > light.y2 && y2 > light.y2) continue;
				var dx = x2 - x1;
				var dy = y2 - y1;
				var c = x1 * y2 - x2 * y1;
				var c1 = light.x1 * dy - light.y1 * dx - c;
				var c2 = light.x1 * dy - light.y2 * dx - c;
				var c3 = light.x2 * dy - light.y1 * dx - c;
				var c4 = light.x2 * dy - light.y2 * dx - c;
				if (c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0) continue;
				if (c1 < 0 && c2 < 0 && c3 < 0 && c4 < 0) continue;
				select[j] = bool;
			}
		}
	}
	selectRegion(x1, y1, x2, y2, bool) {
		if (!(this.effect_index >= 0 && this.effect_index < this.effects.length)) return;
		if (x1 > x2) [x1, x2] = [x2, x1];
		if (y1 > y2) [y1, y2] = [y2, y1];
		for (let i=0; i<this.devices.length; ++i) {
			var select = this.selects[i][this.effect_index];
			for (let j=0; j<select.length; ++j) {
				var light = this.devices[i].lights[j];
				if (!(light.x2 <= x1 || light.x1 >= x2
				   || light.y2 <= y1 || light.y1 >= y2))
					select[j] = bool;
			}
		}
	}
	holdDevice(x, y) {
		this.device_index = -1;
		this.device = null;
		for (let i=this.devices.length-1; i>=0; --i) {
			var position = this.devices[i].position;
			if (x >= position.x && x <= position.x + position.width
			 && y >= position.y && y <= position.y + position.height) {
				this.device_index = i;
				this.device = this.devices[i];
				return;
			}
		}
	}
	moveDevice(dx, dy) {
		if (!this.device) return;
		this.device.move(dx, dy);
		this.updateRegion();
	}
	releaseDevice(x, y) {
		this.device_index = -1;
		this.device = null;
		this.updateEffects();
	}
	createColor() {
		if (!this.effect) return;
		this.effect.createColor();
	}
	removeColor() {
		if (!this.effect) return;
		this.effect.removeColor();
	}
	toggleColorScale() {
		if (!this.effect) return;
		this.effect.toggleColorScale();
	}

	//--------20190821 LAG Edited-----------
	moveRegionDevice(iDevice,dx, dy) {
		if (!this.devices[iDevice]) return;
		var iX = dx - this.devices[iDevice].region.x;
		var iY = dy - this.devices[iDevice].region.y;
		this.devices[iDevice].move(iX, iY);

		this.updateRegion();
	}
}      
//------------manager.js---------------

//------------init.js---------------

var manager = new Manager();


function init() {
	//if (++images_count < images.length) return;
	manager.pushDevice(new Device('Kemove', keyboard, keycodes));
	// manager.pushDevice(new Device('M20', keyboard2, keycodes));
	// manager.pushDevice(new Device('H6LV2', mouse, H6LV2_keycodes));

	manager.pushEffect(new Wave());

	if (env.isWindows) 
	{

		//----------------AudioCap-------------------
		m_AudioCap = require(`./nodeDriver/win64/AudioCap.node`);
		
		var bState = 0;
		bState = m_AudioCap.Initialization();
		m_AudioCap.CapStart(0);
		
		m_AudioCap.FFTMode('Set',0);
		m_AudioCap.ComboFrgdMode('Set',21);
		m_AudioCap.ComboBkgdMode('Set',0);
		m_AudioCap.SetAmplitude(1500);//3000
		
		var color= Buffer.alloc(18);
		color[0] = 255;
		color[1] = 255;
		color[2] = 255;
		m_AudioCap.SetCustemColor(1,color);
		g_GetAudioCap = setInterval(AudioCapture, 50);
		
		//----------------AudioCap2-------------------
	}
	
}
//------------init.js---------------

//------------animation.js---------------
//var canvas = document.getElementById("canvas");
//var ctx    = canvas.getContext('2d');

// var canvas;
// canvas.Width = 980;
// canvas.height = 300;

var scale = 0.5;
//ctx.scale(scale, scale);

var all = true;
var draw = true;

function AudioCapture() {

	g_DataAudio = m_AudioCap.GetGdColor();
}

function update() {
    // try
    // {
		manager.update();
		all ? manager.renderAll() : manager.render();
	// }
	// catch(ex)
	// {
	// 	//env.log("SpecEffects","SpecEffects","New SpecEffects INSTANCE");
    // }

}
//------------animation.js---------------
//------------fps.js---------------



//------------fps.js---------------
var SpecEffects = function() {
        try{
            _thisSpec = this;

            init();
            //-----------test----------
            //var iRGB = hsl2rgb(0,100,50);

            var id;
            if (!id) {id = setInterval(update, 10);}
            else     {clearInterval(id); id = 0;}
            //-----------test----------

            env.log("SpecEffects","SpecEffects","New SpecEffects INSTANCE");
            
        }catch(ex){
            env.log("SpecEffects Error","SpecEffects",`ex${ex.message}`);
        }
    }
    SpecEffects.prototype.RunFunction = function (Obj,callback) {
    	try{
            // env.log('DeviceApi','RunFunction',`Function:${Obj.Func}`);
	    	if (Obj.Type !== funcVar.FuncType.Device)
	    		throw new Error('Type must be Device.');

	    	var fn = _thisSpec[Obj.Func];

	    	if (fn === undefined || !funcVar.FuncName.hasOwnProperty(Obj.Func))
	    		throw new Error(`Func error of ${Obj.Func}`);
	    	fn(Obj.Param, callback);
	    }catch(ex){
            env.log('SpecEffects','RunFunction',`SpecEffects.RunFunction error : ${ex.message}.`);
	    	callback(errCode.ValidateError, ex);
	    }
    };

    //-------------Function------------

    SpecEffects.prototype.GetRenderColors = function (Obj) 
    {
        //------------Render-----------------
        return new Promise(function (resolve) {
                   
		// for (let i=0; i<this.devices.length; ++i)
        // for (let j=0; j<this.outputs[i].length; ++j)
        //     assigncolor(this.outputs[i][j], [0,0,0]);

        var OutputData = manager.outputs;
            resolve(OutputData);
        });
        //-----------------------------------
    }

    SpecEffects.prototype.SetDeviceBtnAxis = function (Obj) 
    {
		var DeviceBtnAxis = Obj.DeviceBtnAxis;
			
		for (var i=0; i<manager.devices.length; ++i) 
		{
			var x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
			manager.devices[i].lights = DeviceBtnAxis;
			
			for (var j=0; j< DeviceBtnAxis.length; ++j) 
			{
				manager.devices[i].lights[j].x = (manager.devices[i].lights[j].x2+manager.devices[i].lights[j].x1)/2;
				manager.devices[i].lights[j].y = (manager.devices[i].lights[j].y2+manager.devices[i].lights[j].y1)/2;
				
				x1 = Math.min(x1, manager.devices[i].lights[j].x1);
				y1 = Math.min(y1, manager.devices[i].lights[j].y1);
				x2 = Math.max(x2, manager.devices[i].lights[j].x2);
				y2 = Math.max(y2, manager.devices[i].lights[j].y2);
			}
			manager.devices[i].region = {
				x      : 0,
				y      : 0,
				width  : x2 - x1,
				height : y2 - y1,
			};
		}

		manager.updateRegion();
	}
    SpecEffects.prototype.SetSyncLEDData = function (Obj) 
    {
        return new Promise(function (resolve) {

			var iEffectCount = Obj.EffectLibrary.length;
			var iManageCount = manager.effects.length;
			var bChangeEffect = false;
			if (iManageCount != iEffectCount) 
			{
				bChangeEffect = true;
			}
			else
			{
				for (var i = 0; i < iManageCount; i++) 
				{
					var iEffect = Obj.EffectLibrary[i].Effect;
					if (iEffect != m_EffectName.indexOf(manager.effects[i].description) )
					{
						bChangeEffect = true;
						break;
					}
				}
			}
			if (bChangeEffect) {
				
				for (var i = 0; i < iManageCount; i++) 
				{
					manager.popEffect();
				}
				
				for (var i = 0; i < iEffectCount; i++) 
				{
					var iEffect = Obj.EffectLibrary[i].Effect;
					manager.pushEffect(eval('new ' + m_EffectName[iEffect] + '()'));
				}
			}				   
			for (var i = 0; i < iEffectCount; i++) {
				
				//-----------Synceffect---------------
				var Synceffect = Obj.EffectLibrary[i];
				var effectTemp = manager.effects[i];

				manager.blends[i] = Synceffect.check;

				effectTemp.opacity = Synceffect.opacity;
				if (effectTemp.center != undefined) 
				{
					effectTemp.center(Synceffect.coordinateX,Synceffect.coordinateY);
				}
				
				if (effectTemp.angle != undefined) 
					effectTemp.angle = Synceffect.angle;
				if (effectTemp.bandwidth != undefined) 
					effectTemp.bandwidth = Synceffect.bandwidth;
				if (effectTemp.speed != undefined) 
					effectTemp.speed = Synceffect.speed;
				if (effectTemp.gradient != undefined) 
					effectTemp.gradient = Synceffect.gradient;
				if (effectTemp.direction != undefined) 
					effectTemp.direction = Synceffect.direction;
				if (effectTemp.soft != undefined) 
					effectTemp.soft = Synceffect.soft;
				if (effectTemp.number != undefined) 
					effectTemp.number = Synceffect.number;
				if (effectTemp.fire != undefined) 
					effectTemp.fire = Synceffect.fire;
				if (effectTemp.bump != undefined) 
					effectTemp.bump = Synceffect.bump;
				if (effectTemp.randomspeed != undefined) 
					effectTemp.randomspeed = Synceffect.randomspeed;
				if (effectTemp.fixed != undefined) 
					effectTemp.fixed = Synceffect.fixed;
				if (effectTemp.bidirectional != undefined) 
					effectTemp.bidirectional = Synceffect.bidirectional;
				if (effectTemp.time != undefined) 
					effectTemp.time = Synceffect.time;
				if (effectTemp.separate != undefined) 
					effectTemp.separate = Synceffect.separate;
				if (effectTemp.radius != undefined) 
					effectTemp.radius = Synceffect.radius;

				if (m_AudioCap != undefined && Synceffect.amplitude != undefined) 
					m_AudioCap.SetAmplitude(Synceffect.amplitude);//3000
					
				if (effectTemp.gap != undefined) 
					effectTemp.gap = Synceffect.gap;
					
				//-----------SyncColors---------------

				if (effectTemp.colors != undefined) 
				{
					effectTemp.color_number = Synceffect.GradientArray.length;
					
					for (var j = 0; j < Synceffect.GradientArray.length; j++) {

						if (effectTemp.colors[j] == undefined) {
							effectTemp.colors.push([0,0,0]);
						}
						effectTemp.colors[j][0] = Synceffect.GradientArray[j].color.R;
						effectTemp.colors[j][1] = Synceffect.GradientArray[j].color.G;
						effectTemp.colors[j][2] = Synceffect.GradientArray[j].color.B;
						
						effectTemp.scales[j] = Synceffect.GradientArray[j].percent/100;
						// if (effectTemp.scales[j]>=1) {
						// 	effectTemp.scales[j] = 0.99;
						// }
						// if (j < Synceffect.GradientArray.length-1) {
						// 	effectTemp.defaultscales[j] = 1-((Synceffect.GradientArray[j+1].percent-Synceffect.GradientArray[j].percent)/100);
						// }
						// else if (j == Synceffect.GradientArray.length-1) {
						// 	effectTemp.defaultscales[j] = 1-((Synceffect.GradientArray[j].percent-Synceffect.GradientArray[j-1].percent)/100);
						// }
					}
					// effectTemp.defaultscales[0] = 0;
					// effectTemp.defaultscales[Synceffect.GradientArray.length-1] = 1;
				}


				//manager.effect = effectTemp;
				//-----------deviceselects--------------
				var deviceselects = Synceffect.deviceselects;
				for (var j=0; j<manager.devices.length; ++j) {
					var select = manager.selects[j][i];
					for (var k=0; k<select.length; ++k) {
						select[k] = deviceselects[j][k];
					}
				}
			}

			//------------GetAudioCap--------------
			// if (g_GetAudioCap != null) 
			// {
			// 	clearInterval(g_GetAudioCap); 
			// 	g_GetAudioCap = null;
			// } 
			// for (var i = 0; i < iEffectCount; i++) 
			// {
			// 	var iEffect = Obj.EffectLibrary[i].Effect;
			// 	if (m_EffectName[iEffect] == 'AudioCap') {
			// 		g_GetAudioCap = setInterval(AudioCapture, 50);
			// 		break;
			// 	} 
			// }
			
			//------------GetAudioCap--------------
			//------------DeviceAxis--------------
			var DeviceAxis = Obj.DeviceAxis;
			
			for (var i=0; i<manager.devices.length; ++i) 
			{
				manager.moveRegionDevice(i,DeviceAxis[i].X, DeviceAxis[i].Y) ;
				//manager.releaseDevice();
			}
			manager.updateRegion();
			//------------------------------------

            resolve(0);
        });
    }

    SpecEffects.prototype.SyncLEDEvent = function (Obj) 
    {
		var csType = Obj.Type;
		var iKey = Obj.Keycode;
		
        return new Promise(function (resolve) {
			if (csType != undefined) {
				manager.event(csType,iKey);
			}

			resolve(0);
        });
	}
    //-------------Function------------


    //-----------------------------------
    SpecEffects.prototype.AppDB = false;
    
    // return SpecEffects;

exports.SpecEffects = SpecEffects;
