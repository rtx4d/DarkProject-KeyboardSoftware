var events = require('events');
var env = require('../others/env');
var fs = require('fs');
var path = require('path');
var funcVar = require('../others/FunctionVariable');
var evtType = require('../others/EventVariable').EventTypes;
var deviceTuring = require('./device/device_Turing');//TURING
var AppObj = require("../dbapi/AppDB");
var JsonDBObj = require("../dbapi/JsonDB");

var SpecEffects = require('./SpecEffects');//SpecEffects
var CustomKeyEffects = require('./CustomKeyEffects');//CustomKeyEffects

// var Firmware_Update = require('./UpdateDevice');//Firmware_Upfatestaynight


var InitDeviceFlag = false;;//TURING
var os = require('os');
var appFullPath = undefined;

//var InitDeviceFlag = false
var InitDeviceFlag = new Array(3).fill(false);
var m_bSetSyncDB = false;

var iPID_Turing = 0x2061;
var iVID_Turing = 0x195D;
var EP2Data_Turing = new Array(3).fill(0);

var iPID = 0x2071;
var iVID = 0x195D;

var iPID2 = 0x2072;
var iVID2 = 0x195D;

var iPID3 = 0x1026;
var iVID3 = 0x195D;


var m_ApplyOption ;

var m_iTimerAllLED = null;//Timer For Function
var m_bBlockLED2Front = false;//Timer For Function

var m_iTimerCustomLED = null;//Timer For Function

var m_DeviceProfile = [1,2,3,4];

var m_DeviceName = ["Kemove","M20","H6LV2"];
'use strict';

var __extends = this.__extends || function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var ProtocolInterface = (function (_super) {
    __extends(ProtocolInterface, _super);
    var _this;

    function ProtocolInterface() {
        try {
            _this = this;
            _super.call(this);
            env.log( 'Interface', 'ProtocolInterface', " New ProtocolInterface INSTANCE. ");

            if (env.isWindows) 
            {
                if (env.arch == 'ia32')
                {
                    _this.hiddevice = require(`./nodeDriver/win32/hiddevice.node`);
                    _this.AudioControl = require(`./nodeDriver/win32/AudioControl.node`);
                    // _this.AudioCap = require(`./nodeDriver/win32/AudioCap.node`);
                    _this.VirtualKey = require(`./nodeDriver/win32/VirtualKey.node`);
                }
                else
                {
                    _this.hiddevice = require(`./nodeDriver/win64/hiddevice.node`);
                    _this.AudioControl = require(`./nodeDriver/win64/AudioControl.node`);
                    // _this.AudioCap = require(`./nodeDriver/win64/AudioCap.node`);
                    _this.VirtualKey = require(`./nodeDriver/win64/VirtualKey.node`);

                    _this.SyncProgram = require(`./nodeDriver/win64/SyncProgram.node`);

                    //-------------SyncProgram---------------------
                    var bState = 0;
                    bState = _this.SyncProgram.Initialization();
                    //_this.SyncProgram.ShowDebug(false);
                    
                    _this.SyncProgram.SyncCallback(_this.SyncProgram_Callback);
                    //-------------SyncProgram2---------------------
                    //var ffi = require('ffi'), ref = require('ref');

                    
                    //-------------SyncProgram2---------------------
                    //_this.hiddevice.DebugMessageCallback(_this.DebugCallback);
                    _this.hiddevice.StartHidPnpNotify();
                    _this.hiddevice.HIDPnpCallBack(_this.HIDDevicePnp);
                }
                
                // //----------------AudioCap-------------------
                // var bState = 0;
                // bState = _this.AudioCap.Initialization();
                // _this.AudioCap.CapStart(0);
                // //_this.AudioCap.DLLCallback(_this.AudioCallBack);
                // //----------------AudioCap2-------------------
            } else if (env.isMac) 
            {
                _this.hiddevice = require(`./nodeDriver/darwin/hiddevicemac.node`);

                _this.hiddevice.DebugMessageCallback(_this.DebugCallback);
                _this.hiddevice.StartHidPnpNotify();
                _this.hiddevice.HIDPnpCallBack(_this.HIDDevicePnp);



                // var app = require('electron').app;
                // var TESTdir = app.getAppPath('exe').slice(0,app.getAppPath('exe').indexOf('.app'));
                // TESTdir += '_appdata';
            }
            
            _this.AppDB = new AppObj.AppDB();
            _this.JsonDB = new JsonDBObj.JsonDB();



            

            if (_this.hiddevice === undefined)
                env.log( "Interface", "InterfaceClass", `hiddevice init error.`);

            // //-------------Firmware_Update---------------------
                
            // if (_this.Firmware_Update == undefined)
            // {
            //     _this.Firmware_Update = new Firmware_Update.UpdateDeviceClass(_this.EmitText);
            // }

            //-------------DeviceApi---------------------
            if (_this.DeviceApi_Turing == undefined)
            {
                _this.DeviceApi_Turing = new deviceTuring.DeviceApi_Turing(_this.EmitText,_this.hiddevice,_this.AudioControl,_this.VirtualKey,_this.SyncProgram);
                
                _this.DeviceApi_Turing.InitialConfig();
                _this.DeviceApi_Turing.InitialMacro();
                
                //_this.DeviceApi_Turing.SetSyncProgram();
            }
            //--------------------------------------------

            var bActionSync = [];
            for (let i = 0; i < 2; i++) 
            {
                bActionSync[i] = false;
            }
            
            m_ApplyOption =
            {
                iCurDevice:0,
                bActionSync: bActionSync
            };

        //-------------SpecEffects---------------------
        if (_this.SpecEffects == undefined)
        {
            _this.SpecEffects = new SpecEffects.SpecEffects();
        }   
        //-------------CustomKeyEffects---------------------
        if (_this.CustomKeyEffects == undefined)
        {
            _this.CustomKeyEffects = new CustomKeyEffects.SpecEffects();
        }   
        //-------------InitDevice Test ---------------------

        if (_this.hiddevice != undefined)
        {
            _this.InitDevice();
        }
        _this.ReadSyncEffectDB();//Only For DarkProject

        var ObjSync = {
            iMode: 1,
            bStart: 1
        };
        _this.SwitchSyncLEDPreview(ObjSync);
        //-------------InitDevice---------------------

                   
        } catch (ex) {
            env.log('Interface Error', 'ProtocolInterface', `ex:${ex.message}`);
        }
    }
    
    //初始化设备列表
    ProtocolInterface.prototype.InitDevice = function (callback) {

        env.log('Interface', 'InitDevice', ' begin.');

        var DeviceId_Turing = 0;
        if (InitDeviceFlag[0] == 0)
        {            
            DeviceId_Turing = _this.hiddevice.FindDevice(0xffc2,0x04,iVID_Turing, iPID_Turing);
            if(DeviceId_Turing != 0) 
               InitDeviceFlag[0] = true;
            
            //InitDeviceFlag = _this.hiddevice.FindDevice(0,iVID, iPID,0xff01,0x01);
        } 
        
        //--------------------------------------------TURING
        try {
            setTimeout(function () {
                if (InitDeviceFlag[0] == true) {
                    if(DeviceId_Turing > 0)  _this.DeviceApi_Turing.SetDeviceId(DeviceId_Turing);
                    
                    var Obj3 = {
                        bPlug: InitDeviceFlag[0]
                    };
                    

                    if (env.isWindows) {
                        //open ep3 channel
                        var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00,iVID_Turing,iPID_Turing, _this.HIDEP2Data_Turing);
                        env.log('Interface', 'Init DeviceDataCallback : ', rtn);
                   
                        _this.DeviceApi_Turing.DevicePlug(Obj3);
                    }
                    else
                    {
                        var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00,iVID_Turing,iPID_Turing, _this.HIDEP2Data_Turing);
                        _this.DeviceApi_Turing.DevicePlug(Obj3);
                    }
                    //----------------GetDeviceProfieID--------------
                    _this.DeviceApi_Turing.ReadFWVersion();
                    setTimeout(function () {
                       _this.DeviceApi_Turing.GetDeviceProfieID().then(function () {
                           
                           
                       });
                    }, 2000);
                    //----------GetDeviceProfieID--------------

                    // //-------Device Plug-------------
                    // var Obj3 = {
                    //     iDevice: 0,
                    //     bPlug: InitDeviceFlag[0]
                    // };
                    // _this.Deviceswitch(Obj3);
                    // //-------Device Plug-------------

                }

                
                //-------Emit-------------
                var Obj2 = {
                    Type: funcVar.FuncType.Device,
                    Func: evtType.RefreshDevice,
                    Param: InitDeviceFlag
                };
                _this.emit(evtType.ProtocolMessage, Obj2);

            }, 2000);
        } catch (ex) {
            env.log('ProtocolInterface Error', 'InitDevice', err.message)
        }


        //-----------StartSyncEffect--------------
        
        //_this.SetCustomLEDData(0);
        
        // var ObjSync = {
        //     bAutoSwitch: false,
        //     bStart: 2
        // };
        // _this.SwitchSyncLEDPreview(ObjSync);
        //------------StartSyncEffect-----------
        
        
};

    //关闭所有设备
    ProtocolInterface.prototype.CloseAllDevice = function (callback) {

        return new Promise(function (resolve) {

            try {
                env.log('Interface', 'CloseAllDevice', ` Begin Close Device `);
                
                // for (let i = 1; i < 99999; i++) { // stop all runing program
                //     _this.clearInterval(i);
                // }
                //-----------StartSyncEffect------------
                var ObjSync = {
                    iMode: 0,
                    bStart: 1
                };
                _this.SwitchSyncLEDPreview(ObjSync);
                //------------StartSyncEffect-----------
                
                setTimeout(function () {
                    Promise.all([_this.DeviceApi_Turing.CloseDevice()]).then(function () {
                        resolve(0);
                    }, function () {
                        env.log('Interface Error', 'CloseAllDevice', ` Close HidDevice fail `);
                        resolve(0);
                    });
                }, 100);
                
            } catch (ex) {
                env.log('Interface Error', 'CloseAllDevice', `ex:${ex.message}`);
                resolve(0);
            }
        });

    };

    ProtocolInterface.prototype.Deviceswitch = function (Obj) {
        var bPlug = Obj.bPlug;
        var InitDeviceArr = []; 
        var iDevicenum = 1;
        InitDeviceArr[0] = InitDeviceFlag[0];
        if (bPlug) //Switch Plug
        {
            m_ApplyOption.iCurDevice = Obj.iDevice;
                
            var ObjDevice = {
                iDevice: m_ApplyOption.iCurDevice,
                bPlug: InitDeviceArr[m_ApplyOption.iCurDevice]
            };
            var Obj2 = {
                Type: funcVar.FuncType.Device,
                Func: evtType.SwitchDevice,
                Param: ObjDevice
            };
            _this.emit(evtType.ProtocolMessage, Obj2);
            
            // //-----------StartSyncEffect------------
            // var ObjSync = {
            //     bAutoSwitch: false,
            //     bStart: true
            // };
            // _this.SwitchSyncLEDPreview(ObjSync);
            // //------------StartSyncEffect-----------
        }

        for (let i = 0; i < iDevicenum; i++) {
            if (InitDeviceArr[i] == true && !bPlug) //Switch
            {
                m_ApplyOption.iCurDevice = i;
                
                var ObjDevice = {
                    iDevice: m_ApplyOption.iCurDevice,
                    bPlug: InitDeviceArr[i]
                };
                var Obj2 = {
                    Type: funcVar.FuncType.Device,
                    Func: evtType.SwitchDevice,
                    Param: ObjDevice
                };
                _this.emit(evtType.ProtocolMessage, Obj2);
                
                break;
            } 
            else if (InitDeviceArr[i] == false && !bPlug && i == iDevicenum-1) //No device
            {
                //m_ApplyOption.iCurDevice = i;
                var ObjDevice = {
                    iDevice: m_ApplyOption.iCurDevice,
                    bPlug: InitDeviceArr[i]
                };
                var Obj2 = {
                    Type: funcVar.FuncType.Device,
                    Func: evtType.SwitchDevice,
                    Param: ObjDevice
                };
                // //-----------StartSyncEffect--------------
                // var ObjSync = {
                //     bAutoSwitch: false,
                //     bStart: false
                // };
                // _this.SwitchSyncLEDPreview(ObjSync);
                // //------------StartSyncEffect-----------
                _this.emit(evtType.ProtocolMessage, Obj2);
                break;
            }             
        }
    }
    

    ProtocolInterface.prototype.HIDDevicePnp = function (Obj) {
        env.log('Interface', 'HIDDevicePnp', JSON.stringify(Obj));
        if (Obj.vid == iVID_Turing && Obj.pid == iPID_Turing && Obj.status == 1) {//Devece Turing Plug
            if (InitDeviceFlag[0] == false) {
             
                var looptime = 0;
                var DeviceFlags = setInterval(function () {

                    DeviceId_Turing = _this.hiddevice.FindDevice(0xffc2,0x04,iVID_Turing, iPID_Turing);
                    if(DeviceId_Turing > 0) 
                    {
                        _this.DeviceApi_Turing.SetDeviceId(DeviceId_Turing);
                        InitDeviceFlag[0] = true;
                    }

                    //InitDeviceFlag = true;

                    env.log('Interface', 'FindDevice', InitDeviceFlag[0]);
                    if (InitDeviceFlag[0]) 
                    {                              
                        if (env.isWindows) 
                        {
                            var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00,iVID_Turing,iPID_Turing, _this.HIDEP2Data_Turing);
                            //env.log('Interface', 'HIDDevicePnp DeviceDataCallback : ', rtn);
                        }                 
                        else 
                        {
                            var rtn = _this.hiddevice.DeviceDataCallback(0xff00, 0xff00,iVID_Turing,iPID_Turing, _this.HIDEP2Data_Turing);
                        }
                        
                        var Obj3 = {
                            iDevice: 0,
                            bPlug: InitDeviceFlag[0]
                        };
                        _this.DeviceApi_Turing.DevicePlug(Obj3);

                        var Obj2 = 
                        {
                            Type: funcVar.FuncType.System,
                            Func: evtType.RefreshDevice,
                            Param: InitDeviceFlag
                        };
                        _this.emit(evtType.ProtocolMessage, Obj2);
                        
                        _this.DeviceApi_Turing.ReadFWVersion();
                        //----------------GetDeviceProfieID--------------
                        setTimeout(function () {
                            _this.DeviceApi_Turing.GetDeviceProfieID().then(function () 
                            {

                            });
                        }, 2000);
                        //----------------GetDeviceProfieID--------------
                        
                        clearInterval(DeviceFlags);
                        DeviceFlags = undefined;
                    }

                    if (looptime > 5) 
                    {
                        clearInterval(DeviceFlags);
                        DeviceFlags = undefined;
                        if (InitDeviceFlag[0] == false)
                            env.log('Interface Error', 'HIDDevicePnp', 'init fail');
                    }

                    looptime++;
                }, 3000);

            }
        } 


        else if (Obj.vid == iVID_Turing && Obj.pid == iPID_Turing && Obj.status == 0) {//Devece 1 UnPlug
            InitDeviceFlag[0] = false;
            var Obj2 = {
                Type: funcVar.FuncType.System,
                Func: evtType.RefreshDevice,
                Param: InitDeviceFlag
            };

            _this.emit(evtType.ProtocolMessage, Obj2);
            //_this.DeviceApi = undefined;
            
            
            //-------Device Unplug-------------
            var Obj3 = {
                iDevice: 0,
                bPlug: InitDeviceFlag[0]
            };
            _this.DeviceApi_Turing.DevicePlug(Obj3);
            //_this.Deviceswitch(Obj3);
            //-------Device Unplug-------------
            
                        
        }
        //env.log('Interface', '_this.DeviceApi', 'InitDeviceFlag 0 :' , InitDeviceFlag[0]);
    }



    ProtocolInterface.prototype.DebugCallback = function (Obj) {
        env.log('Interface', 'DebugCallback', JSON.stringify(Obj));

    }

    ProtocolInterface.prototype.SyncProgram_Callback = function (Obj) {
        env.log('Interface', 'SyncProgram_Callback', JSON.stringify(Obj));

        //var iProfile = Obj.Profile;
        var Filename = Obj.Filename;
        
        _thisDevice_Turing.GetSyncIDFromName(Filename).then(function (SyncIndexID) 
        {
            if (SyncIndexID != -1) 
            {
                // var ObjSync = {
                //     iMode: 1,
                //     bStart: 0
                // };
                // _this.SwitchSyncLEDPreview(ObjSync);
                _thisDevice_Turing.SetSetProfileFromID(SyncIndexID).then(function (iProfile) 
                {

                    //Async
                    var Obj2 = {
                        Type: funcVar.FuncType.Device,
                        Func: evtType.SwitchProfile,
                        Param: {Profile:iProfile}
                    };
                    _this.emit(evtType.ProtocolMessage, Obj2);
                });
                //Sync
            }
        });
            
    }
    ProtocolInterface.prototype.HIDEP2Data_Turing = function (Obj) {
        // env.log('Interface', 'HIDEP2Data', JSON.stringify(Obj));
        if (_this.DeviceApi_Turing.GetFirmwareStats() == true) 
        {
            return;
        }

        if (Obj[0]== 0x04 && Obj[1]== 0xf1 && Obj[2]== 0xf2) //EP2 Input
        {
            var iKey = Obj[3] * 6 + Obj[4];
            var csKey =  _this.DeviceApi_Turing.GetKeyName(iKey);
            var iPress =  Obj[5];

            if (iPress) {
                
                var ObjEvent = {
                    Type: m_DeviceName[0],//Turing
                    Keycode: csKey,
                };
    
                _this.SpecEffects.SyncLEDEvent(ObjEvent).then(function () {
                });
            }
        }
        else if (Obj[0]== 0x04 && Obj[1]== 0xe1 && Obj[2]== 0x01) //EP2 Instant Switch Profile
        {
            
            _this.DeviceApi_Turing.SetSyncProgramID(-1);
            var iProfile = m_DeviceProfile.indexOf(Obj[3]);
                        
            var Obj2 = {
                Type: funcVar.FuncType.Device,
                Func: evtType.SwitchProfile,
                Param: {Profile:iProfile}
            };
            _this.emit(evtType.ProtocolMessage, Obj2);
        }
        // else if (Obj[0]== 0x04 && Obj[1] == 0xf8 && Obj[2] == 0x81 ) //EP2 GetDeviceProfieID
        // {
            
        //     var iProfile = m_DeviceProfile.indexOf(EP2Data_Turing[0]);
            
        //     var Obj2 = {
        //         Type: funcVar.FuncType.Device,
        //         Func: evtType.SwitchProfile,
        //         Param: {Profile:iProfile}
        //     };
        //     //_this.emit(evtType.ProtocolMessage, Obj2);
        // }
        
        else if (Obj[0]== 0x04 && Obj[1]== 0xe1 && Obj[2]== 0x9) //EP2 Switch Effect 0~4
        {
            var iEffect = Obj[3];
            
            let ObjMode = {
                iMode: 0,//0:Off 1:Ap Mode 2:Custom Preview
                bStart: 0//0:Off 1:On
            }
            _this.SwitchLEDEffect(ObjMode).then(function () {

                //resolve("SetLEDPreview Done");
            });
            let ObjEffect = {
                iEffect: iEffect
            }
            _this.DeviceApi_Turing.RefreshCurrentEffect(ObjEffect);
        }
        else if (Obj[0]== 0x04 && Obj[1]== 0xe1 && Obj[2]== 0x8) //EP2 Switch Effect 6~10
        {
            var iEffect = Obj[3];
            
            let ObjMode = {
                iMode: 0,//0:Off 1:Ap Mode 2:Custom Preview
                bStart: 0//0:Off 1:On
            }
            _this.SwitchLEDEffect(ObjMode).then(function () {

                //resolve("SetLEDPreview Done");
            }); 
            let ObjEffect = {
                iEffect: iEffect
            }
            _this.DeviceApi_Turing.RefreshCurrentEffect(ObjEffect);

        }
        else if (Obj[0]== 0x04 && Obj[1]== 0xe1 && Obj[2]== 0x11) //EP2 Switch Custom Effect 
        {
            var iCusEffect = Obj[3];
            
            let ObjMode = {
                iMode: 0,//0:Off 1:Ap Mode 2:Custom Preview
                bStart: 0//0:Off 1:On
            }
            _this.SwitchLEDEffect(ObjMode).then(function () {

                //resolve("SetLEDPreview Done");
            });
        }
        else if (Obj[0]== 0x04 && Obj[1]== 0xe1 && Obj[2]== 0x12) //EP2 Switch Custom Effect 
        {
            var iCusEffect = Obj[3];
            
            let ObjMode = {
                iMode: 0,//0:Off 1:Ap Mode 2:Custom Preview
                bStart: 0//0:Off 1:On
            }
            _this.SwitchLEDEffect(ObjMode).then(function () {

                //resolve("SetLEDPreview Done");
            });
        }
        else if (Obj[0]== 0x04 ) //EP2 Data
        {
            _this.DeviceApi_Turing.HIDEP2Data_Turing(Obj);
            // EP2Data_Turing = new Array(3).fill(0);
            // EP2Data_Turing[0] = Obj[1];
            // EP2Data_Turing[1] = Obj[2];
        }
    } 

    ProtocolInterface.prototype.KeyDataCallback = function (Obj) {
        // env.log('Interface','KeyData',JSON.stringify(Obj));

        var Obj2={
            Type : funcVar.FuncType.System,
            SN : null,
            Func : evtType.KeyDataCallback,
            Param : Obj
        };
        _this.emit(evtType.ProtocolMessage, Obj2);

    }

    //Application Event callback
    ProtocolInterface.prototype.AppEventCallback = function (Obj) {
        env.log('Interface','AppEventCallback',JSON.stringify(Obj));
        if(appFullPath == undefined)
            appFullPath = Obj;
        if(appFullPath != Obj){
            appFullPath = Obj;
            var Obj2={
                Type : funcVar.FuncType.System,
                SN : null,
                Func : evtType.AppChanged,
                Param : Obj
            };
            _this.emit(evtType.ProtocolMessage, Obj2);
        }
    }

    ProtocolInterface.prototype.OnProtocolMessage = function (Obj) {
        _this.emit(evtType.ProtocolMessage, Obj);
    }



    //运行函数
    ProtocolInterface.prototype.RunFunction = function (Obj, callback) {
        try {
            // env.log(env.level.DEBUG,'Interface','RunFunction',JSON.stringify(Obj)); 
            if (!_this.CheckParam(Obj)) {
                callback('Error', 'ProtocolInterface.RunFunction');
                return;
            }
            if (Obj.Func == funcVar.FuncName.InitDevice) {
                _this.InitDevice(callback);
                return;
            }
            //-----------------------------------
            else if (Obj.Func == funcVar.FuncName.ChangeWindowSize) {
                var options = {
                    Type: funcVar.FuncType.System,
                    Func: evtType.ChangeWindowSize,
                    Param: Obj.Param
                }
                _this.emit(evtType.ProtocolMessage, options);
                return;
            }  
            else if (Obj.Func == funcVar.FuncName.ShowWindow) {
                var options = {
                    Type: funcVar.FuncType.System,
                    Func: evtType.ShowWindow,
                    Param: Obj.Param
                }
                _this.emit(evtType.ProtocolMessage, options);
                return;
            } 
            else if (Obj.Func == funcVar.FuncName.SendKey) {
                _this.SendKey(Obj.Param);
            }
            else if (Obj.Func == funcVar.FuncName.QuitApp) {
                var options = {
                    Type: funcVar.FuncType.System,
                    Func: evtType.QuitApp,
                    Param: Obj.Param
                }
                _this.emit(evtType.ProtocolMessage, options);
                return;
            }
            else if (Obj.Type == funcVar.FuncType.System) 
            {
                var fn = _this[Obj.Func];
                fn(Obj.Param).then(function (data) {
                    callback(data);
                });
                return;
            }
            

            switch (Obj.Type) {
                case funcVar.FuncType.System:
                    _this.SystemApi.RunFunction(Obj, callback);
                    break;
                case funcVar.FuncType.Device:
                                    
                    switch (Obj.Param.iDevice) {
                        case 0://M19
                            _this.DeviceApi_Turing.RunFunction(Obj, callback);
                            break;
                        case 99:
                            _this.DeviceApi_Turing.RunFunction(Obj, callback);
                            break;
                    
                        default:
                            callback('DeviceApi RunFunction Error', Obj.Type);
                            return;
                    }
                    break;

                default:
                    callback('InterFace RunFun Error', Obj.Type);
                    return;
            }
        } catch (ex) {
            env.log('Interface Error', 'RunFunction', ` ex:${ex.message}`);
        }
    };

    ProtocolInterface.prototype.ReadAllDeviceDB = function (Obj) {
        env.log('Interface', 'ReadAllDeviceDB', JSON.stringify(Obj));
        
        return new Promise(function (resolve) {

            var apmodesetting = {
                iDevice: Obj.iDevice
            }
            var allDB = [];
            
            _this.DeviceApi_Turing.ReadAllDB(apmodesetting).then(function(Doc1) {
                
                resolve(allDB);
            });


            // resolve(callback(allDB));
            // resolve("ExportProfile Done");
        });

    };
    //检查参数正确性
    ProtocolInterface.prototype.CheckParam = function (Obj) {
        if (Obj === null || Obj === undefined || typeof Obj !== 'object')
            return false;
        // if (!Obj.hasOwnProperty('Type'))
        // 	return false;
        if (!Obj.hasOwnProperty('Type') || !Obj.hasOwnProperty('Func') || !Obj.hasOwnProperty('Param'))
            return false
        if (Obj.Type === null || Obj.Type === undefined || typeof Obj.Type !== 'number')
            return false;
        return true;
    };

    ProtocolInterface.prototype.SetLEDPreview = function (Obj) {
        
        return new Promise(function (resolve) {
            
            if (m_iTimerCustomLED != null) 
            {
                SetCustomLEDTojs(Obj.CustomDataObj).then(function () {

                    resolve("SetLEDPreview Done");
                });

            }
            else //Open Custom Preview
            {
                clearInterval(m_iTimerAllLED);
                m_iTimerAllLED = null;
                m_iTimerCustomLED = setInterval(OnTimerCustomKeyLED, 40);
                
                var ObjEffect = {
                    iLEDMode: 15
                };
                _this.DeviceApi_Turing.SetLEDEffect(ObjEffect);
                
                SetCustomLEDTojs(Obj.CustomDataObj).then(function () {

                    resolve("SetLEDPreview Done");
                });
            }
        
        });

    };
    ProtocolInterface.prototype.SwitchSyncLEDPreview = function (Obj) {
        
        return new Promise(function (resolve) {
        
            env.log('Interface', 'SwitchSyncLEDPreview', ' bStart:' + JSON.stringify(Obj.bStart));
      
            if (Obj.iMode == 1) 
            {
                m_bBlockLED2Front = false;
                if (Obj.bStart == 0) 
                {
                    clearInterval(m_iTimerAllLED);
                    m_iTimerAllLED = null;
                }
                else if (Obj.bStart == 1 && m_iTimerAllLED == null) 
                {
                    clearInterval(m_iTimerAllLED);
                    m_iTimerAllLED = null;
                    m_iTimerAllLED = setInterval(OnTimerAllLED, 40);
                }  
                else if (Obj.bStart == 2) 
                {
                    m_bBlockLED2Front = true;
                }

            }
            else if (Obj.bStart == 2) 
            {
                clearInterval(m_iTimerCustomLED);
                m_iTimerCustomLED = null;
                if (Obj.iMode == 1 && m_iTimerAllLED == null) 
                {
                    m_iTimerCustomLED = setInterval(OnTimerCustomKeyLED, 40);
                    
                var ObjEffect = {
                    iLEDMode: 15
                };
                _this.DeviceApi_Turing.SetLEDEffect(ObjEffect);
                }
            }
            else if (Obj.iMode == 0) 
            {
                clearInterval(m_iTimerAllLED);
                m_iTimerAllLED = null;
                clearInterval(m_iTimerCustomLED);
                m_iTimerCustomLED = null;
            }
                
            resolve("SwitchSyncLEDPreview Done");
        });

    };

    function MakeDataInRange(data, Max, Min) 
    {return data = Math.max( Math.min(data, Max), Min);};


    ProtocolInterface.prototype.SetDeviceBtnAxis = function (Obj) {

        _this.SpecEffects.SetDeviceBtnAxis(Obj);

    }

    function hexToRgb(InputData) {
        try {
    
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(InputData);
            console.log("hexToRgbResult", [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]);
            return result ?              
            {
                color:{
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16)
                } 
            }
            //[parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
            : null;
        }
        catch{
            return 1;
        }
    }
    
    function SetCustomLEDTojs(Obj) 
    {
        var MatrixColorMode = Obj.matrix_ColorMode;
        var MatrixFrames = Obj.matrix_frames;

        var ObjFrameArray = []
        var ObjCustomLEDData  =
        {
            Blend_mode: "overlap",
            EffectLibrary:[],
        };

        var m_EffectName = ['Cycle','Breathing','Static','Breathing'];
        var iCustomLED = MatrixColorMode.length;
        var EffectArray = [2,0,1,1];
        var GradientArray = [false,true,false,false];
        if (iCustomLED == 0) 
        {
            var frame_selection_range = new Array(62).fill(true);//Select All false
            
            let deviceselects = [];
            deviceselects[0] = frame_selection_range;
            var EffectLibrary = { 
                name: 'Static',
                Effect:2,
                gap: 200,
                speed: 1,

                opacity:1,
                check:true,bandwidth: 8000,
                gradient: true,
                canvasCenterX: 0,
                canvasCenterY: 0,
                GradientArray:[{color:{R:0,G:0,B:0}, percent:0}],
                deviceselects:deviceselects};
            ObjCustomLEDData.EffectLibrary.push(EffectLibrary);

            ObjCustomLEDData.DeviceAxis = [{X: 0, Y: 0}];
            Promise.all([_this.CustomKeyEffects.SetSyncLEDData(ObjCustomLEDData), _this.CustomKeyEffects.SetCustomFrameData(ObjFrameArray)]);
            return;
        }

        for (var iColorMode = 0; iColorMode < iCustomLED; iColorMode++) 
        {
            var Speed = (255-parseInt(MatrixColorMode[iColorMode].speed))/10;
            var Breath_Extinguish = parseInt(MatrixColorMode[iColorMode].speed2);

            let deviceselects = [];
            deviceselects[0] = MatrixColorMode[iColorMode].frame_selection_range;
            var EffectLibrary = { 
                name: m_EffectName[EffectArray[MatrixColorMode[iColorMode].colorMode]],
                Effect:EffectArray[MatrixColorMode[iColorMode].colorMode],
                gap: Breath_Extinguish*20,
                speed: Speed,

                opacity:1,
                check:true,bandwidth: 8000,
                gradient: GradientArray[MatrixColorMode[iColorMode].colorMode],
                canvasCenterX: 0,
                canvasCenterY: 0,
                GradientArray:[],
                deviceselects:deviceselects};
            ObjCustomLEDData.EffectLibrary.push(EffectLibrary);
        }
        
        for (var iColorMode = 0; iColorMode < iCustomLED; iColorMode++) 
        {
            let GradientArray = [];
            if (MatrixColorMode[iColorMode].colorMode == 0
                || MatrixColorMode[iColorMode].colorMode == 2)//Static Breath
            {
                var Color = hexToRgb(MatrixColorMode[iColorMode].color)
                
                var Gradient ={color:Color.color, percent:0};
                GradientArray.push(Gradient);
            } 
            else if (MatrixColorMode[iColorMode].colorMode == 1)//Cycle
            {
                var ColorClcle =["#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"];

                var ColorStage = ColorClcle.indexOf(MatrixColorMode[iColorMode].color);
                if (ColorStage == -1) 
                    ColorStage = 0;
                
                var DefGradientArray = [
                    {color:{R:255,G:0,B:0} , percent:0},
                    {color:{R:255,G:255,B:0} , percent:16},
                    {color:{R:0,G:255,B:0} , percent:32},
                    {color:{R:0,G:255,B:255} , percent:48},
                    {color:{R:0,G:0,B:255} , percent:64},
                    {color:{R:255,G:0,B:255} , percent:80},
                    {color:{R:255,G:255,B:255} , percent:100}
                ];
                
                for (var i = 0; i < 7; i++) 
                {
                    var Gradient ={color:DefGradientArray[(i+ColorStage)%7].color, percent:i*16};
                    GradientArray.push(Gradient);
                }
            } 
            else 
            {
                GradientArray = [
                    {color:{R:255,G:0,B:0} , percent:0},
                    {color:{R:255,G:255,B:0} , percent:20},
                    {color:{R:0,G:255,B:0} , percent:40},
                    {color:{R:0,G:255,B:255} , percent:60},
                    {color:{R:0,G:0,B:255} , percent:80},
                    {color:{R:255,G:0,B:255} , percent:100},
                ];
                // GradientArray = [
                //     {color:{R:255,G:0,B:0} , percent:0},
                //     {color:{R:255,G:128,B:0} , percent:20},
                //     {color:{R:128,G:255,B:0} , percent:30},
                //     {color:{R:0,G:255,B:0} , percent:40},
                //     {color:{R:0,G:255,B:255} , percent:50},
                //     {color:{R:0,G:0,B:255} , percent:60},
                //     {color:{R:128,G:0,B:255} , percent:70},
                //     {color:{R:255,G:0,B:255} , percent:80},
                //     {color:{R:255,G:0,B:128} , percent:100},
                // ];
            }
            ObjCustomLEDData.EffectLibrary[iColorMode].GradientArray = GradientArray;
        }
        ObjCustomLEDData.DeviceAxis = [{X: 0, Y: 0}];

        //--------------------------------
        var iFrameArray = MatrixFrames.length;
        for (var i = 0; i < MatrixFrames.length; i++) 
        {
            var frame_selection_range = MatrixFrames[i].frame_selection_range;

            var FrameArray = {Frameselects:frame_selection_range , Frametimes:parseInt(MatrixFrames[i].frame_time)};
            ObjFrameArray.push(FrameArray);
        }
           
        //--------------------------------
        
        return new Promise(function (resolve) {
            
            Promise.all([_this.CustomKeyEffects.SetSyncLEDData(ObjCustomLEDData), _this.CustomKeyEffects.SetCustomFrameData(ObjFrameArray)]).then(function () {
                
                resolve("SetCustomLEDTojs Done");
            }, function () {
                env.log('Interface Error', 'SetCustomLEDTojs', ` SetCustomLEDTojs fail `);
                resolve(0);
            });


        });
    }
    
    ProtocolInterface.prototype.SwitchLEDEffect = function (Obj) {
        //env.log('Interface', 'SetSyncLEDData', JSON.stringify(Obj));
        
        var ObjSync = {
            iMode: Obj.iMode,
            bStart: Obj.bStart
        };
        return new Promise(function (resolve) {
            
            _this.SwitchSyncLEDPreview(ObjSync).then(function () {
                    
                resolve("SwitchLEDEffect Done");
            });
        
        });
        // return new Promise(function (resolve) {
            
        //     SetCustomLEDTojs(Obj).then(function () {

        //         _this.DeviceApi_Turing.SetCustomLED(Obj).then(function () {
                    
        //             resolve("SetCustomLEDData Done");
        //         });
        //     });

        // });
    };
    
    function SetSyncTojs(Obj) 
    {
        
        var ObjSyncData  = JSON.parse(JSON.stringify(Obj))  
        //var ObjSyncData = $.extend(true, {}, Obj); //使用 jquery.extend
        //var ObjSyncData = jQuery.extend({}, Obj);
        

        var m_EffectName = ['Wave','ConicBand','Spiral','Cycle','LinearWave','Ripple','Breathing','Rain','Fire','Trigger','AudioCap','Static'];

        let deviceselects = [];
        deviceselects[0] = new Array(61).fill(true);//Select All false
        
        for (var i = 0; i < ObjSyncData.EffectLibrary.length; i++) 
        {
            ObjSyncData.EffectLibrary[i].Effect = m_EffectName.indexOf(ObjSyncData.EffectLibrary[i].name);
            let Color_quantity = ObjSyncData.EffectLibrary[i].color_quantity;
            if (Color_quantity < 1) {
                Color_quantity = ObjSyncData.EffectLibrary[i].color.length;
            }
            let GradientArray = [];
            for (var j = 0; j < Color_quantity; j++)  
            {
                var Gradient = hexToRgb(ObjSyncData.EffectLibrary[i].color[j])
                
                Gradient.percent=100/(Color_quantity-1)*j;
                GradientArray.push(Gradient);
                
            }
            // let GradientArray = [
            //     {color:{R:255,G:0,B:0} , percent:0},
            //     {color:{R:255,G:128,B:0} , percent:20},
            //     {color:{R:128,G:255,B:0} , percent:30},
            //     {color:{R:0,G:255,B:0} , percent:40},
            //     {color:{R:0,G:255,B:255} , percent:50},
            //     {color:{R:0,G:0,B:255} , percent:60},
            //     {color:{R:128,G:0,B:255} , percent:70},
            //     {color:{R:255,G:0,B:255} , percent:80},
            //     {color:{R:255,G:0,B:128} , percent:100},
            // ];
            ObjSyncData.EffectLibrary[i].opacity = ObjSyncData.EffectLibrary[i].opacity/100;
            ObjSyncData.EffectLibrary[i].bandwidth = MakeDataInRange(ObjSyncData.EffectLibrary[i].bandwidth,1000,50);
            ObjSyncData.EffectLibrary[i].fire = ObjSyncData.EffectLibrary[i].fire/10;
            ObjSyncData.EffectLibrary[i].GradientArray = GradientArray;
            //
            var frame_selection_range = ObjSyncData.EffectLibrary[i].frame_selection_range;
            ObjSyncData.EffectLibrary[i].deviceselects = [];
            ObjSyncData.EffectLibrary[i].deviceselects[0]= frame_selection_range;
            //
        }
        ObjSyncData.DeviceAxis = [{X: 0, Y: 0}];
        
        return new Promise(function (resolve) {
            
            _this.SpecEffects.SetSyncLEDData(ObjSyncData).then(function () {

                resolve("SetSyncTojs Done");
            });

        });
    }
    
    ProtocolInterface.prototype.SetSyncLEDData = function (Obj) {
        //env.log('Interface', 'SetSyncLEDData', JSON.stringify(Obj));
        
        if (!m_bSetSyncDB) {
            m_bSetSyncDB = true;
            setTimeout(function () {
            
            	_this.SetSyncEffectDB(Obj)
                m_bSetSyncDB = false;
            
            }, 1000);
        }
        
        var ObjSync = {
            iMode: 1,
            bStart: 1
        };
        _this.SwitchSyncLEDPreview(ObjSync);
        
        return new Promise(function (resolve) {
            
            SetSyncTojs(Obj).then(function () {

                resolve("SetSyncLEDData Done");
            });

        });

    };

    function NumTo16Decimal(rgb) {//HEX色碼
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    function rgbToHex(r, g, b) {
        var red = NumTo16Decimal(parseInt(r,10));
        var green = NumTo16Decimal(parseInt(g,10));
        var blue = NumTo16Decimal(parseInt(b,10));
        return "#"+red + green + blue;
    
    };    
    function OnTimerCustomKeyLED()
    {
        _this.CustomKeyEffects.GetRenderColors().then(function (Data) {
            
            var DataKey = Data[0];

            var DataHex = new Array(DataKey.length);
            var buf = new Array(432);
                        
            for (let i = 0; i < DataKey.length; i++) //For Example:50Keys
            {
              buf[0+i] = DataKey[i][0];//R
              buf[144+i] = DataKey[i][1];//G
              buf[288+i] = DataKey[i][2];//B

              DataHex[i] = rgbToHex(DataKey[i][0],DataKey[i][1],DataKey[i][2]);
            }

            //-----------emit-------------------
            
            if (!m_bBlockLED2Front) 
            {
                var Obj2 = {
                    Type: funcVar.FuncType.Device,
                    Func: evtType.SendCustomLED,
                    Param: {iSyncDevice:99,Data:DataHex}
                };
                _this.emit(evtType.ProtocolMessage, Obj2);
            }

            
        });
    }


    function OnTimerAllLED()
    {
        _this.SpecEffects.GetRenderColors().then(function (Data) {
            
            var DataKey = Data[0];

            var DataHex = new Array(DataKey.length);
            var buf = new Array(432);
                        
            for (let i = 0; i < DataKey.length; i++) //For Example:50Keys
            {
              buf[0+i] = DataKey[i][0];//R
              buf[144+i] = DataKey[i][1];//G
              buf[288+i] = DataKey[i][2];//B

              DataHex[i] = rgbToHex(DataKey[i][0],DataKey[i][1],DataKey[i][2]);
            }

            var Obj = {
              Buffer:  buf
            }
            _this.DeviceApi_Turing.SetLEDMatrix(Obj);

            //-----------emit-------------------

            
            var Obj2 = {
                Type: funcVar.FuncType.Device,
                Func: evtType.SendSyncLED,
                Param: {iSyncDevice:99,Data:DataHex}
            };
            _this.emit(evtType.ProtocolMessage, Obj2);

            
        });
    }
    //--------------------寫入SyncEffectDB值-------------------------

    
    ProtocolInterface.prototype.SetSyncEffectDB = function (Obj) {
        
        var path = require('path');
        var exePath = path.resolve(__dirname, '../../../'); 
        //var AppDataPath = exePath+"\\data\\M20\\";
        var AppCommonDataPath = exePath+"\\data\\";
        var AppDataPath = env.appData+"\\";
        
        m_bSetDevice = true;//SETDB
        
        
        return new Promise(function (resolve) {
            //------------Config---------------
            var Config_info = Obj;

            AppDataPath = env.appData+"\\SyncEffect.JsonDB";
            _this.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                _this.JsonDB.SetProfile(AppDataPath,Config_info).then((doc1) => 
                {
                    resolve(0);
                });
            });
                
                // _this.AppDB.getProfile(AppDataPath+"SyncEffect",0).then((doc) => {
                //     if (!doc[0]) 
                //     {    
                //         _this.AppDB.AddProfile(AppDataPath+"SyncEffect",Config_info).then((doc) => {
                //         })
                //     }
                //     else
                //     {
                //         var iId;
                //         iId = doc[0].id;
                //         _this.AppDB.UpdateProfile(AppDataPath+"SyncEffect",iId,Config_info).then((doc) => {
                //         })
                //     }
                //     resolve(0);
                // })

        });
    };
    //--------------------讀取SyncEffectDB值-------------------------

    ProtocolInterface.prototype.ReadSyncEffectDB = function (Obj,callback) {
        var SyncEffect ;
        
        var path = require('path');
        var exePath = path.resolve(__dirname, '../../../'); 
        //var AppDataPath = exePath+"\\data\\M20\\";
        var AppCommonDataPath = exePath+"\\data\\";
        var AppDataPath = env.appData+"\\";
        
        return new Promise(function (resolve) {
            
            AppDataPath = env.appData+"\\SyncEffect.JsonDB";
            _this.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (doc.EffectLibrary != undefined) 
                {
                    SetSyncTojs(doc);
                    resolve(doc.EffectLibrary);
                }
                else
                {
                    resolve(undefined);
                }
            
            });  
            //------------Config---------------
            // _this.AppDB.getAllProfile(AppDataPath+"SyncEffect").then((doc0) => {
            //     if (!doc0[0]) 
            //     {
            //     }
            //     else
            //     {
                    
			// 	//-----------Synceffect---------------
            //         SyncEffect =
            //         {
            //             //Blend_mode:doc0[0].Blend_mode,
            //             EffectLibrary:doc0[0].EffectLibrary
            //             //DeviceAxis: doc0[0].DeviceAxis
            //         };
            //         //SyncEffect = doc0[0];
            //     }
                
            //     SetSyncTojs(SyncEffect).then(function () {

            //         resolve(SyncEffect.EffectLibrary);
            //     });
                
                
            // })
        });

    };
    //虛擬送鍵盤值
    ProtocolInterface.prototype.SendKey = function (Obj) {
        // env.log('Interface', 'SendKey', JSON.stringify(Obj));
        _this.hiddevice.RunVirtualKey(Obj.ModifyKey, Obj.VirtualKey);
    };

    ProtocolInterface.prototype.ExportProfile = function (Obj) {
        env.log('Interface', 'ExportProfile', JSON.stringify(Obj));
        
        return new Promise(function (resolve) {
            fs.writeFileSync(Obj.Path, JSON.stringify(Obj.Data, null, "\t"));    
        
            resolve("ExportProfile Done");
        });

    };
    ProtocolInterface.prototype.ImportProfile = function (Obj) {
        env.log('Interface', 'ImportProfile', JSON.stringify(Obj));
        // var options;
        //var fs = require('fs');
        var Path = Obj.Path;
        
        var Data;
        return new Promise(function (resolve) {
            fs.readFile(Path,'utf8', function (err,data){
                if (err)throw err;
                Data = JSON.parse(data);

                resolve(Data);            
            });

        });
    };

    

    ProtocolInterface.prototype.SetOptionDB = function (Obj,callback) {
        //env.log('Interface', 'SetAllDB', JSON.stringify(Obj));
        
        return new Promise(function (resolve) {
            //------------Config---------------
            var ApplyOption = Obj.ApplyOption;

                _this.AppDB.getProfile("Option",0).then((doc) => {
                    if (!doc[0]) 
                    {    
                        _this.AppDB.AddProfile("Option",ApplyOption).then((doc) => {
                            resolve("SetOptionDB Done");
                        })
                    }
                    else
                    {
                        var iId;
                        iId = doc[0].id;
                        _this.AppDB.UpdateProfile("Option",iId,ApplyOption).then((doc) => {
                            resolve("SetOptionDB Done");
                        })
                    }
                })


        });
    
    };
        
    
    ProtocolInterface.prototype.ReadOptionDB = function (Obj,callback) {
        //env.log('ProtocolInterface', 'ReadAllDB', JSON.stringify(Obj));
        
        return new Promise(function (resolve) {
            
            _this.AppDB.getAllProfile("Option").then((doc0) => {

                if (!doc0[0]) 
                {
                }
                else
                {
                    var ApplyOption =
                    {
                        iCurDevice:doc0[0].iCurDevice,
                        bActionSync: doc0[0].bActionSync
                    };
                    m_ApplyOption = ApplyOption;
                    resolve(ApplyOption);
                }
            });
        });
    
    };
    
    ProtocolInterface.prototype.EmitText = function (Obj) {

        _this.emit(evtType.ProtocolMessage, Obj);

    };

    ProtocolInterface.prototype.ReadAllReleasenote = function (Obj) {
        
        var langNum = 4;
        var Data = [];

        return new Promise(function (resolve, reject) 
        {
            (function ReadReleasenote(i){
                
                if (i < langNum)
                {
                    var iLang  = i+1;
                    var ReleasenotePath = env.appRoot+"\\FWUpdate\\Releasenote_lang" + iLang +".txt";
                    
                    fs.exists(ReleasenotePath, function (bexists) 
                    {
                        if (bexists) 
                        {
                            fs.readFile(ReleasenotePath,'utf8', function (err,data){
                                if (err)throw err;
                                Data.push(data);
                            
                                ReadReleasenote(i+1);
                            });
                        } 
                        else 
                        {
                            ReadReleasenote(i+1);
                        }
                    
                    });
                }
                else
                {
                    resolve(Data);
                }
    
            })(0);
        });


    };

    // //在关机，登出，登入时需要重新刷新HID设备
    // ProtocolInterface.prototype.OnSessionChange = function (changeType) {        
    //     env.log(env.level.DEBUG,'Interface','OnSessionChange',`Begin.`);
    //     try{
    //         if (env.isLessThenWin81){
    //             if(changeType === 0x2 || changeType === 0x4 || changeType === 0x6 || changeType === 0x8){
    // 				_this.CloseAllDevice();
    // 			}
    //             if (!_this.IsRefreshDevice){
    //                 clearTimeout(_this.RefreshDeviceWaitNextEventTimeoutId);
    //                 _this.RefreshAllDevice(3500);
    //             }
    //             env.log('Interface','OnSessionChange',`Send RefreshDevice event to UI`);                
    //         }
    //     }catch(ex){
    //         env.log(env.level.ERROR,'Interface','OnSessionChange',`ex :${ex.message}.`);
    //         _this.IsRefreshDevice = false;
    //     }
    // };



    //支援机种
    ProtocolInterface.prototype.SupportDevice = undefined;

    //是否拔插时正刷新设备列表
    ProtocolInterface.prototype.IsRefreshDevice = false;

    ProtocolInterface.prototype.AppDB = false;

    //当前最前程序路径
    // ProtocolInterface.prototype.ForegroundAppPath = undefined;

    return ProtocolInterface;
})(events.EventEmitter);

exports.ProtocolInterfaceClass = ProtocolInterface;