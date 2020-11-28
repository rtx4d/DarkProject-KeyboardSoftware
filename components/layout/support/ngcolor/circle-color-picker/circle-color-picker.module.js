"use strict";var __decorate=this&&this.__decorate||function(e,o,r,c){var n,l=arguments.length,t=l<3?o:null===c?c=Object.getOwnPropertyDescriptor(o,r):c;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)t=Reflect.decorate(e,o,r,c);else for(var i=e.length-1;i>=0;i--)(n=e[i])&&(t=(l<3?n(t):l>3?n(o,r,t):n(o,r))||t);return l>3&&t&&Object.defineProperty(o,r,t),t};Object.defineProperty(exports,"__esModule",{value:!0});var common_1=require("@angular/common"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),shared_module_1=require("../shared/shared.module"),circle_color_picker_component_1=require("./circle-color-picker.component"),circle_hsl_component_1=require("./circle-hsl/circle-hsl.component"),circle_hue_component_1=require("./circle-hue/circle-hue.component"),cursor_component_1=require("./cursor/cursor.component"),CircleColorPickerModule=function(){function e(){}return e=__decorate([core_1.NgModule({imports:[common_1.CommonModule,shared_module_1.SharedModule,forms_1.FormsModule],declarations:[circle_color_picker_component_1.CircleColorPickerComponent,circle_hue_component_1.CircleHueComponent,circle_hsl_component_1.HslComponent,cursor_component_1.CursorComponent],exports:[circle_color_picker_component_1.CircleColorPickerComponent]})],e)}();exports.CircleColorPickerModule=CircleColorPickerModule;