"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var n,c=arguments.length,a=c<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,o);else for(var l=e.length-1;l>=0;l--)(n=e[l])&&(a=(c<3?n(a):c>3?n(t,r,a):n(t,r))||a);return c>3&&a&&Object.defineProperty(t,r,a),a},__metadata=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),convert=require("color-convert"),ColorUtilityService=function(){function e(){}return e.prototype.createColorOutput=function(e,t,r){var o=convert.hsl.rgb([e,t,r]),n=o[0],c=o[1],a=o[2],l={red:n,green:c,blue:a},i=convert.rgb.hex([n,c,a]);return{rgb:l,hexString:"#"+i,hex:parseInt("0x"+i,16),hsl:{hue:e,saturation:t,lightness:r}}},e.prototype.calculateHslFromHex=function(e){var t=convert.hex.rgb(e),r=convert.rgb.hsl(t),o=r[0],n=r[1],c=r[2];return{hue:o/360,saturation:n/100,lightness:c/100}},e.prototype.calculateHslFromRgb=function(e){var t=convert.rgb.hsl([e.red,e.green,e.blue]),r=t[0],o=t[1],n=t[2];return{hue:r/360,saturation:o/100,lightness:n/100}},e.prototype.calculateHexFromHsl=function(e){var t=convert.hsl.rgb([e.hue,e.saturation,e.lightness]),r=convert.rgb.hex(t);return"#"+r},e=__decorate([core_1.Injectable(),__metadata("design:paramtypes",[])],e)}();exports.ColorUtilityService=ColorUtilityService;