"use strict";var __decorate=this&&this.__decorate||function(e,t,r,c){var i,o=arguments.length,n=o<3?t:null===c?c=Object.getOwnPropertyDescriptor(t,r):c;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,r,c);else for(var v=e.length-1;v>=0;v--)(i=e[v])&&(n=(o<3?i(n):o>3?i(t,r,n):i(t,r))||n);return o>3&&n&&Object.defineProperty(t,r,n),n};Object.defineProperty(exports,"__esModule",{value:!0});var core_1=require("@angular/core"),iDevice_model_1=require("./iDevice.model"),DeviceService=function(){function e(){}return e.prototype.SetDevice=function(e,t,r){return console.log("SetDevice"),this.deviceObj=new iDevice_model_1.iDeviceService(e,t,r),this.deviceObj},e=__decorate([core_1.Injectable()],e)}();exports.DeviceService=DeviceService;