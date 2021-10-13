"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var remote=window.System._nodeRequire("electron").remote,evtVar=window.System._nodeRequire("./backend/others/EventVariable"),funcVar=window.System._nodeRequire("./backend/others/FunctionVariable"),env=window.System._nodeRequire("./backend/others/env"),AppProtocol=function(){function e(){this.protocol=remote.getGlobal("AppProtocol")}return e.prototype.RunSetFunction=function(e,t){e.Type===funcVar.FuncType.System?this.RunSetFunctionSystem(e,t):e.Type===funcVar.FuncType.Device&&this.RunSetFunctionDevice(e,t)},e.prototype.RunGetFunction=function(e,t){e.Type===funcVar.FuncType.System?this.RunGetFunctionSystem(e,t):e.Type===funcVar.FuncType.Device&&this.RunGetFunctionDevice(e,t)},e.prototype.checkGetSystemFunction=function(e){var t=["abctest"];return t.lastIndexOf(e)>=0},e.prototype.checkSetSystemFunction=function(e){var t=["abctest","InitDevice","ChangeWindowSize","SendKey","ExportProfile","QuitApp"];return t.lastIndexOf(e)>=0},e.prototype.RunGetFunctionSystem=function(e,t){var n={Type:funcVar.FuncType.System,Func:e.Func,Param:e.Param};this.protocol.RunFunction(n,function(e){t(e)})},e.prototype.RunSetFunctionSystem=function(e,t){var n={Type:funcVar.FuncType.System,Func:e.Func,Param:e.Param};this.protocol.RunFunction(n,function(e,n){t(e)})},e.prototype.checkSetDeviceFunction=function(e){var t=["SetCommand","SetMacroKey","GetKeyMatrix","SetKeyMatrix","APMode","RunApplication","LightBarMode","GetProfieAndFirmwareVer","GetDefaultKeyMatrix","SetProfie","GetProfileInfo","SetWinKeyLock"];return t.lastIndexOf(e)>=0},e.prototype.checkGetDeviceFunction=function(e){var t=[""];return t.lastIndexOf(e)>=0},e.prototype.RunGetFunctionDevice=function(e,t){var n={Type:funcVar.FuncType.Device,Func:e.Func,Param:e.Param};this.protocol.RunFunction(n,function(e){t(e)})},e.prototype.RunSetFunctionDevice=function(e,t){var n={Type:funcVar.FuncType.Device,Func:e.Func,Param:e.Param};this.protocol.RunFunction(n,function(e,n){t(e)})},e}();exports.AppProtocol=AppProtocol;