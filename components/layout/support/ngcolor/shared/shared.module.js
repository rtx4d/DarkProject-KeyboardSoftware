"use strict";var __decorate=this&&this.__decorate||function(e,r,o,t){var i,c=arguments.length,l=c<3?r:null===t?t=Object.getOwnPropertyDescriptor(r,o):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,r,o,t);else for(var u=e.length-1;u>=0;u--)(i=e[u])&&(l=(c<3?i(l):c>3?i(r,o,l):i(r,o))||l);return c>3&&l&&Object.defineProperty(r,o,l),l};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),color_utility_service_1=require("./color-utility/color-utility.service"),mouse_handler_directive_1=require("./mouse-handler/mouse-handler.directive"),SharedModule=function(){function e(){}return e=__decorate([core_1.NgModule({imports:[common_1.CommonModule],declarations:[mouse_handler_directive_1.MouseHandlerDirective],exports:[mouse_handler_directive_1.MouseHandlerDirective],providers:[color_utility_service_1.ColorUtilityService]})],e)}();exports.SharedModule=SharedModule;