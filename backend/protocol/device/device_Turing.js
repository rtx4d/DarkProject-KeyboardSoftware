var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var events = require('events');
var fs = require('fs');
var env = require('../../others/env');
var funcVar = require('../../others/FunctionVariable');
var evtType = require('../../others/EventVariable').EventTypes;

var ConstArray = require('../../others/ConstantArray');
var exec = require('child_process').exec;//execFile->exec

var AppObj = require("../../dbapi/AppDB");
var JsonDBObj = require("../../dbapi/JsonDB");
//var HID = require('node-hid');
var openurl = require('electron').shell;

'use strict';

//------------------------------
var m_NewFWVersion = 0;

var m_iColorR;
var m_iColorG;
var m_iColorB;
var m_iBrightness;
var m_bBrightness;
var m_timerAudioMode = {};//Timer For Function

var m_bOpen = 0;//Marixtable 128
var g_DeviceID = 1;

var m_bSetDevice = false;//SET DB

var m_bSetHWDevice = false;
var m_bFirmwareUpdate = false;
//------------------------------
var m_ApplyConfig ;
var m_MacroConfig = [];
var m_CustomDataConfig = [];

var m_SyncProgramData = [];

var m_SyncIndexID = -1;

var m_DeviceProfile = [1,2,3,4];

var m_iCustomLEDNum = 0;

var iPID_Turing = 0x2061;
var iVID_Turing = 0x195D;

var Device_KeyMatrixNum = 102;//KD3-KeyMatrixNumber

var m_CombineKeys = [
    {FuncKeyCode:"KRset2",Matrix_key:"plus"},//Intensity_UP
    {FuncKeyCode:"KRset1",Matrix_key:"minus"},//Intensity_Down
    {FuncKeyCode:"KRset6",Matrix_key:"up"},//LED Speed Increse
    {FuncKeyCode:"KRset5",Matrix_key:"down"},//LED Speed Decrese
    //{FuncKeyCode:"KRset10",Matrix_key:"win"},//FNX(FN Lock)
    {FuncKeyCode:"KRset11",Matrix_key:"f8"},//LED_ON_OFF

    //{FuncKeyCode:"KRset7",Matrix_key:"z"},//BT1
    //{FuncKeyCode:"KRset8",Matrix_key:"x"},//BT2
    //{FuncKeyCode:"KRset9",Matrix_key:"c"},//BT3
    //{FuncKeyCode:"KRset4",Matrix_key:"k29"},//LED Mode Up
    //{FuncKeyCode:"KRset3",Matrix_key:"rqu"},//Coustom_Mode_Change
    //{FuncKeyCode:"KRset12",Matrix_key:"enter"},//Endurance-mode
    // {FuncKeyCode:"",Matrix_key:""},//


];
var iEP2DataType = 0;
var m_iDeviceEffect = 0;
var m_iDeviceReportRate = 0;

//------------------------------
var Matrix_LEDCode_DarkProject = [];//Marixtable DarkProject-KD3
Matrix_LEDCode_DarkProject = [  
 ""      , "period"  , "tab"   , "caps" , "lshift" , "lctrl" , 
 "esc"   ,  "n1"     , "q"     , "a"    , "tab"    , "win"    , 
 "f1"    ,  "n2"     , "w"     , "s"    , "z"      , "lalt"   , 
 "f2"    ,  "n3"     , "e"     , "d"    , "x"      ,  ""      , 
 "f3"    ,  "n4"     , "r"     , "f"    , "c"      ,  ""      , 
 "f4"    ,  "n5"     , "t"     , "g"    , "v"      ,  "space" , 
 "f5"    ,  "n6"     , "y"     , "h"    , "b"      ,  ""      , 
 "f6"    ,  "n7"     , "u"     , "j"    , "n"      ,  ""      , 
 "f7"    ,  "n8"     , "i"     , "k"    , "m"      ,  "ralt"  , 
 "f8"    ,  "n9"     , "o"     , "l"    , "comma"  ,  "fn"    , 
 "f9"    ,  "n0"     , "p"     , "sem"  , "dot"    ,  "book"  ,
 "f10"   ,  "minus"  , "lqu"   , "quo"  , "qmark"  ,  ""      ,
 "f11"   ,  "plus"   , "rqu"   , ""     , ""       ,  "rctrl" ,
 "f12"   ,  "bksp"   , "k29"   , "enter", "rshift" ,  ""      ,
 "print" ,  "insert" ,"delete" , ""     , ""       ,  "left"  ,
 "scroll",  "home"   , "end"   , ""     , "up"     ,  "down"  ,
 "pause" ,  "pup"    , "pdown" , ""     , ""       ,  "right" ,
 
];
// var Matrix_LEDCode_DarkProject = [];//Marixtable DarkProject-KD3
// Matrix_LEDCode_DarkProject = [  
//  ""      , "period"  , "tab"   , "caps" , "lshift" , "lctrl" , 
//  "esc"   ,  "n1"     , "q"     , "a"    , "tab"    , "win"    , 
//  "f1"    ,  "n2"     , "w"     , "s"    , "z"      , "lalt"   , 
//  "f2"    ,  "n3"     , "e"     , "d"    , "x"      ,  ""      , 
//  "f3"    ,  "n4"     , "r"     , "f"    , "c"      ,  ""      , 
//  "f4"    ,  "n5"     , "t"     , "g"    , "v"      ,  "space" , 
//  "f5"    ,  "n6"     , "y"     , "h"    , "b"      ,  ""      , 
//  "f6"    ,  "n7"     , "u"     , "j"    , "n"      ,  ""      , 
//  "f7"    ,  "n8"     , "i"     , "k"    , "m"      ,  "ralt"  , 
//  "f8"    ,  "n9"     , "o"     , "l"    , "comma"  ,  "fn"    , 
//  "f9"    ,  "n0"     , "p"     , "sem"  , "dot"    ,  "book"  ,
//  "f10"   ,  "minus"  , "lqu"   , "quo"  , "qmark"  ,  ""      ,
//  "f11"   ,  "plus"   , "rqu"   , ""     , ""       ,  "rctrl" ,
//  "f12"   ,  "bksp"   , "k29"   , "enter", "rshift" ,  ""      ,
//  "print" ,  "insert" ,"delete" , ""     , ""       ,  "left"  ,
//  "scroll",  "home"   , "end"   , ""     , "up"     ,  "down"  ,
//  "pause" ,  "pup"    , "pdown" , ""     , ""       ,  "right" ,
//  ""      , "numlock" , "num7"  , "num4" , "num1"   ,  "num0"  ,
//  ""      ,"numdivide", "num8"  , "num5" , "num2"   ,  "num0"  ,
//  ""      ,"nummulti" , "num9"  , "num6" , "num3"   ,  "numdot",
//  ""      ,"numminus" ,"numplus", ""     ,"numenter",  ""      ,
 
// ];

//-------------------------------

// var Matrix_LED =  ["esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
//                    "period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" , "numlock","numdivide" ,"nummulti" , "numminus",
//                    "tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown", "num7", "num8"   , "num9"     , "numplus" ,
//                    "caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" , "num4"  , "num5"  , "num6" ,
//                    "lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    , "num1"  , "num2" , "num3","numenter",
//                    "lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" , "num0"  ,"numdot",
//                    ];

//For KD3
var Matrix_LED =  ["esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
                   "period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" , 
                   "tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown",
                   "caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" ,
                   "lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    , 
                   "lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" , 
                   ];

//----------------------------------------------------------------------------
//For KD1
// var Matrix_key =  ["esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
//                    "period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" , "numlock","numdivide" ,"nummulti" , "numminus",
//                    "tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown", "num7", "num8"   , "num9"     , "numplus" ,
//                    "caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" , "num4"  , "num5"  , "num6" ,
//                    "lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    , "num1"  , "num2" , "num3","numenter",
//                    "lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" , "num0"  ,"numdot",
//                    ];
//For KD3
var Matrix_key =  ["esc"   , "f1"  , "f2" , "f3" , "f4"  , "f5"  , "f6"  , "f7"  , "f8"  , "f9" , "f10" , "f11" , "f12" , "print", "scroll", "pause" ,
"period", "n1"  , "n2" , "n3" , "n4"  , "n5"  , "n6"  , "n7"  , "n8" , "n9"  , "n0"  ,"minus", "plus","bksp"  , "insert", "home" , "pup" ,
"tab"   , "q"   , "w"  , "e"  , "r"   , "t"   , "y"   , "u"   , "i"  , "o"   , "p"   , "lqu" , "rqu" , "k29"  , "delete", "end"   , "pdown",
"caps"  , "a"   , "s"  , "d"  , "f"   , "g"   , "h"   , "j"   , "k"  , "l"   , "sem" , "quo" ,"enter" ,
"lshift", "z"  , "x"  , "c"   , "v"   , "b"   , "n"   , "m"  ,"comma","dot"  ,"qmark","rshift", "up"    ,
"lctrl" , "win" ,"lalt","space","ralt", "fn"  ,"book" ,"rctrl", "left", "down" , "right" ,
];
var KeyMatrix_Default = //KeyMatrix For KD3-87
[ 
    0x00 ,0x35 ,0x2b ,0x39 ,0xe1 ,0xe0 ,0x29 ,0x1e ,0x14 ,0x04 ,0x00 ,0xe3 ,
    0x3a ,0x1f ,0x1a ,0x16 ,0x1d ,0xe2 ,0x3b ,0x20 ,0x08 ,0x07 ,0x1b ,0x00 ,0x3c ,0x21 ,0x15 ,0x09,
    0x06 ,0x00 ,0x3d ,0x22 ,0x17 ,0x0a ,0x19 ,0x2c ,0x3e ,0x23 ,0x1c ,0x0b ,0x05 ,0x00 ,0x3f ,0x24,
    0x18 ,0x0d ,0x11 ,0x00 ,0x40 ,0x25 ,0x0c ,0x0e ,0x10 ,0xe6 ,0x41 ,0x26 ,0x12 ,0x0f ,0x36 ,0xac,
    0x42 ,0x27 ,0x13 ,0x33 ,0x37 ,0x65 ,0x43 ,0x2d ,0x2f ,0x34 ,0x38 ,0x00 ,0x44 ,0x2e ,0x30 ,0x00,
    0x00 ,0xe4 ,0x45 ,0x2a ,0x31 ,0x28 ,0xe5 ,0x00 ,0x46 ,0x49 ,0x4c ,0x00 ,0x00 ,0x50 ,0x47 ,0x4a,
    0x4d ,0x00 ,0x52 ,0x51 ,0x48 ,0x4b ,0x4e ,0x00 ,0x00 ,0x4f ,0x00 ,0x29 ,0x2b ,0x39 ,0xe1 ,0xe0,
    0x29 ,0x1e ,0x14 ,0x04 ,0x00 ,0xb1 ,0xad ,0x1f ,0x1a ,0x16 ,0x1d ,0xe2 ,0xae ,0x3b ,0x08 ,0x07,
    0x1b ,0x00 ,0xaf ,0xb0 ,0x15 ,0x09 ,0x06 ,0x00 ,0xb0 ,0x22 ,0x17 ,0x0a ,0x19 ,0x2c ,0xb7 ,0x23,
    0x1c ,0x0b ,0x05 ,0x00 ,0xb8 ,0x24 ,0x18 ,0x0d ,0x11 ,0x00 ,0xb6 ,0x25 ,0x0c ,0x0e ,0x10 ,0xe6,
    0xb5 ,0x26 ,0x12 ,0x0f ,0x36 ,0xac ,0x42 ,0x27 ,0x13 ,0x33 ,0x37 ,0x65 ,0x43 ,0xd7 ,0x2f ,0x34,
    0x38 ,0x00 ,0x44 ,0xd6 ,0xf8 ,0x00 ,0x00 ,0xe4 ,0x45 ,0x2a ,0x31 ,0x28 ,0xe5 ,0x00 ,0x46 ,0xa7,
    0xa9 ,0x00 ,0x00 ,0x50 ,0x47 ,0xa8 ,0xa6 ,0x00 ,0xdf ,0xde ,0xba ,0xab ,0xaa ,0x00 ,0x00 ,0x4f,
];    
var Profileinfo_Default =  
[   0x00 ,0x00 ,0x00 ,0x00 ,0x14 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x20 ,
    0x05 ,0x05 ,0x3c ,0x64 ,0x32 ,0x32 ,0x32 ,0x32 ,0x1e ,0x1e ,0x1e ,0x00 ,0x01 ,0x01 ,0x01 ,0x00,
    0x01 ,0x01 ,0x01 ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0xff ,0xff,
    0xff ,0x00 ,0x00 ,0x00 ,0x00 ,0xff ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff,
    0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff,
    0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0xff ,0xff ,0xbd ,0x7e ,0x3f,
    0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x3f ,0x7e ,0xbd ,0xff ,0xff ,0xff,
    0xff ,0xff ,0xff ,0xff ,0xff ,0xff ,0xbd ,0x7e ,0x3f ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00,
    0x00 ,0x00 ,0x00 ,0x3f ,0x7e ,0xbd ,0xff ,0xff ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0x00 ,0x00,

];
// var Profileinfo_Default =  
// [   0x00 ,0x01 ,0x00 ,0x00 ,0x14 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x20,
//     0x05 ,0x05 ,0x3c ,0x64 ,0x32 ,0x32 ,0x32 ,0x32 ,0x1e ,0x1e ,0x1e ,0x00 ,0x01 ,0x01 ,0x01 ,0x00,
//     0x01 ,0x01 ,0x01 ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0xff ,0xff,
//     0xff ,0x00 ,0x00 ,0x00 ,0x00 ,0xff ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff,
//     0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff,
//     0xff ,0xff ,0x00 ,0x00 ,0x00 ,0xff ,0x00 ,0x00 ,0xff ,0xff ,0xff ,0xff ,0xff ,0xbd ,0x7e ,0x3f,
//     0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x3f ,0x7e ,0xbd ,0xff ,0xff ,0xff ,0xff ,0xff ,0xff,
//     0xff ,0xff ,0xff ,0xbd ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x3f ,0x7e ,0xbd,
//     0xff ,0xff ,0xff ,0xff ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0x00 ,0xf8 ,0x82

// ];
//----------------------------------------------------------------------------

function Sleep(ms) {
    // return new Promise(resolve => setTimeout(resolve, ms));

    return new Promise(function (resolve, reject) {
        setTimeout(function(){
            try{
                resolve(rtnData);
            }catch(err){
                resolve(err);
            }
        },ms);
    });
 }

var DeviceApi_Turing = function(EmitAPI,hid,AudioControl,VirtualKey,SyncProgram) {
        try{
            _thisDevice_Turing = this;
            _thisDevice_Turing.EmitAPI = EmitAPI;

            _thisDevice_Turing.hiddevice = hid;
            //----------------AudioControl-------------------
            _thisDevice_Turing.AudioControl = AudioControl;
            //----------------VirtualKey-------------------
            _thisDevice_Turing.VirtualKey = VirtualKey;
            _thisDevice_Turing.SyncProgram = SyncProgram;

            env.log("DeviceApi","DeviceApi_Turing","New DeviceApi INSTANCE");
            
            _thisDevice_Turing.AppDB = new AppObj.AppDB();
            _thisDevice_Turing.JsonDB = new JsonDBObj.JsonDB();
            
            
        }catch(ex){
            env.log("DeviceApi Error","DeviceApi_Turing",`ex${ex.message}`);
        }
    }

    DeviceApi_Turing.prototype.SetDeviceId = function (Obj,callback) {
        var DeviceId  = Obj;
        return new Promise(function (resolve, reject) {              
            //clearInterval(m_timerAudioMode);
            g_DeviceID = DeviceId;
            resolve(0);              
        });

    };
    
    DeviceApi_Turing.prototype.DevicePlug = function (Obj,callback) {
    
        var bPlug=Obj.bPlug;

        if (bPlug) 
        {
            _thisDevice_Turing.SendEnableEP2().then(function() {
                _thisDevice_Turing.GetDeviceType().then(function() {
                    if (iDeviceType == 0x01) {//KD3-87
                            iDeviceType = 0;
                            m_bOpen = bPlug;
                            env.log('Device: 51U68','Plug: ',bPlug);
                            callback(bPlug);
                    }
                    else
                    {
                        m_bOpen = false;
                        bPlug = false;
                        env.log('Device: 51U68','Not This Device',bPlug);
                        callback(bPlug);
                    }
                });
            });
        }
        else
        {
            m_bOpen = bPlug;
            env.log('Device: 51U68','Plug: ',bPlug);
            callback(bPlug);
        }
                
    };

    DeviceApi_Turing.prototype.CloseDevice = function (callback) {
    
        try{
            return new Promise(function (resolve) {
                if (m_bOpen) 
                {
                    var curprofile = m_iCurProfile;
                    var profile2 = (m_iCurProfile+1)%4;
                    var ObjProfile = {
                        Profile: profile2
                    };                    
                    _thisDevice_Turing.SetProfile(ObjProfile,function (){
                        ObjProfile.Profile = curprofile;
                        _thisDevice_Turing.SetProfile(ObjProfile,function (){
                            resolve();
                        });

                    });

                } 
                else 
                {
                    resolve();
                }
            });

         }catch(err){
             env.log("DeviceApi Error","SetFeatureReport",`ex:${err.message}`);
             resolve(err);
         }
        var bOff=Obj.bOff;

        m_bSetDevice = bOff;
    };

    DeviceApi_Turing.prototype.GetKeyValue = function (obj) {
       
        var iKey = 0;
        var iIndex=obj;

        var iKey =  Matrix_key.indexOf(Matrix_LEDCode_DarkProject[obj]);
            
        return iKey;
        // _thisDevice_Turing.GetFeatureReport();
    }
    
    DeviceApi_Turing.prototype.GetKeyName = function (obj) {
       
        var iKey = 0;
        var iIndex=obj;

        var iKey =  Matrix_key.indexOf(Matrix_LEDCode_DarkProject[iIndex]);

        return Matrix_key[iKey];
        // _thisDevice.GetFeatureReport();
    }
    
    
    DeviceApi_Turing.prototype.LaunchProgram = function (iKey,callback) {

        var Temp_button_info = m_ApplyConfig.profile_info[0].button_info[iKey];

        
        switch (Temp_button_info.status) {
            case 4://Launch Program
                if (Temp_button_info.LaunchProgram.switch) //Program
                {
                    _thisDevice_Turing.RunApplication(Temp_button_info.LaunchProgram.program);

                } 
                else //WebSite
                {
                    _thisDevice_Turing.RunWebSite(Temp_button_info.LaunchProgram.website);
                }

                break;
            case 5://Multimedia
            
                if (Temp_button_info.Multimedia == 3) //MicUp
                {
                    _thisDevice_Turing.AudioControl.MicrophoneUp();
                } 
                else if (Temp_button_info.Multimedia == 4) //MicDown
                {
                    _thisDevice_Turing.AudioControl.MicrophoneDown();
                } 
                else if (Temp_button_info.Multimedia == 5) //MuteMic
                {
                    // var bMuteMic = _thisDevice.AudioControl.GetMicrophoneMute(0);
                    // _thisDevice.AudioControl.SetMicrophoneMute(!bMuteMic);
                    _thisDevice_Turing.AudioControl.MicrophoneMute();
                } 
                else if (Temp_button_info.Multimedia == 6) //MuteAll
                {
                    _thisDevice_Turing.AudioControl.SpeakerMute();
                    _thisDevice_Turing.AudioControl.MicrophoneMute();
                } 

                break;
            case 6://Windows Shortcut
                if (Temp_button_info.WindowsShortcuts == 1) //Mspaint
                {
                    _thisDevice_Turing.RunApplication("C:\\Windows\\System32\\mspaint.exe",callback);
                } 
                else if (Temp_button_info.WindowsShortcuts == 2) //Notepad
                {
                    _thisDevice_Turing.RunApplication("C:\\Windows\\System32\\notepad.exe",callback);
                } 
                else if (Temp_button_info.WindowsShortcuts == 3) //SnippingTool
                {
                    _thisDevice_Turing.RunApplication("C:\\Windows\\System32\\SnippingTool.exe",callback);
                } 
                break;
            case 7://Text

                break;
            case 9://Switch Effect

                break;

            default:
                break;
        }


    }

    DeviceApi_Turing.prototype.RunFunction = function (Obj,callback) {
    	try{
            // env.log('DeviceApi','RunFunction',`Function:${Obj.Func}`);
	    	if (Obj.Type !== funcVar.FuncType.Device)
	    		throw new Error('Type must be Device.');

	    	var fn = _thisDevice_Turing[Obj.Func];

	    	if (fn === undefined || !funcVar.FuncName.hasOwnProperty(Obj.Func))
	    		throw new Error(`Func error of ${Obj.Func}`);
	    	fn(Obj.Param, callback);
	    }catch(ex){
            env.log('DeviceApi','RunFunction',`DeviceApi.RunFunction error : ${ex.message}.`);
	    	callback(errCode.ValidateError, ex);
	    }
    };



    DeviceApi_Turing.prototype.GetFeatureReport = function () {
        var Data = new Buffer(new Array(264));
        Data[0] = 0x07;

        return new Promise(function (resolve, reject) {
            setTimeout(function(){
                try{
                    var rtnData = _thisDevice_Turing.hiddevice.GetFeatureReport(g_DeviceID,0x07, 264);

                    env.log('DeviceApi GetFeatureReport','GetFeatureReport',JSON.stringify(rtnData));
                    resolve(rtnData);

                }catch(err){
                    env.log("DeviceApi GetFeatureReport","GetFeatureReport",`ex:${err.message}`);
                    resolve(-1);
                }
            },10);
        });
    }

    
    DeviceApi_Turing.prototype.InitialConfig = function () 
    {
        var button_info = [];
        for (let i = 0; i < 114; i++) {

            button_info[i] = {
                status: 0,    //0~9
                Macro: {name:'Macro1',PlaybackOption:0,times:2},  //Device0:G12ULP  1: 128Pin
                Keyboardfunction: funcVar.FuncKeyCode.indexOf(Matrix_key[i]),
                Mousefunction: 1,
                LaunctProgram: {switch: 0,program:'',website:''},
                Multimedia: 0,
                WindowsShortcuts: 0,
                Text: '',
                SwitchProfile: {name:'profile1',ProfileCycle:0},
                SwitchEffect: {name:'Spectrum Effect 1',LightingCycle:0}
            };
            
        }
        var profile_info = [];
        for (let i = 0; i < 4; i++) {

            profile_info[i] = {
                Profile_Name:'profile1',

                button_info:button_info
            }
        }
        
        m_ApplyConfig =
        {
            bPlug:0,
            profile_info: profile_info
        };

    }
    
    DeviceApi_Turing.prototype.InitialMacro = function () 
    {
        var Keymap_Event = [];
        for (let i = 0; i < 80; i++) {

            Keymap_Event[i] = {
                bKeyDown: 0,    //0 if up, 1 if down
                byDelay: 0,     //Delay Time
                byKeyCode: 0x00 //key code
            };
            
        }

        m_MacroConfig[0] =
        {
            Macroname:'Macro1',
            Keymap_Event: Keymap_Event
        };
    }
    
    DeviceApi_Turing.prototype.RefreshCurrentEffect = function (Obj) 
    {
        m_iDeviceEffect = Obj.iEffect;
    }

    DeviceApi_Turing.prototype.RunApplication = function(obj,callback){
        env.log('DeviceApi RunApplication','RunApplication',JSON.stringify(obj))
        if(env.isWindows){
           openurl.openExternal(obj);
            // exec(obj,function(err,data){
            //     // if(err)
            //     //     callback(err)
            //     // else
            //     //     callback(true);
            // })
        }else{
            obj = 'open -nF '+obj
            exec(obj,{shell: '/bin/bash'},function(err,data){
                // if(err)
                //     callback(err)
                // else
                //     callback(true);
            })
        }
    }
    
    DeviceApi_Turing.prototype.RunWebSite = function(obj,callback){
        env.log('DeviceApi RunWebSite','RunWebSite',JSON.stringify(obj))
        if(env.isWindows){
            //openWebSite(obj);
           openurl.openExternal(obj);
        }
        else
        {
            
        }
    }

    DeviceApi_Turing.prototype.SetSyncProgram = function (obj, callback) 
    {
        //return new Promise(function (resolve) {
            var ObjSyncData = obj.ObjSyncData;
            // [
            //     {
            //         iProfile: 0,
            //         Program: "AnyDesk.exe",
            //         bSleep:false,
            //         bWinlock:false,
            //         bSwap:false,
            //     }
            // ]
            m_SyncProgramData = ObjSyncData;
            var SyncData = [];

            for (let index = 0; index < ObjSyncData.length; index++) {
                var Program = ObjSyncData[index].associatePath;
                SyncData.push(Program);
            }

            _thisDevice_Turing.SyncProgram.SyncProgram(0,SyncData);
            
            _thisDevice_Turing.SetSyncProgramID(-1);
            callback("SetSyncProgram Done");
    }

    DeviceApi_Turing.prototype.SetSyncProgramID = function (obj) 
    {
        return new Promise(function (resolve) {
            m_SyncIndexID = obj;
            resolve(m_SyncIndexID);
        });
    }
    DeviceApi_Turing.prototype.GetSyncIDFromName = function (obj) 
    {
        var Filename = obj;
        var iIndex = -1;
        
        for (let i = 0; i < m_SyncProgramData.length; i++) 
        {
            if (Filename == m_SyncProgramData[i].associatePath) 
            {
                iIndex =i;
                break;
            }
        }
        return new Promise(function (resolve) {
            if (iIndex != m_SyncIndexID) 
            {
                resolve(iIndex);
            } 
            else 
            {
                resolve(-1);
            }
        });
    }
    DeviceApi_Turing.prototype.SetSetProfileFromID = function (obj) 
    {
        m_SyncIndexID = obj;
        var SyncProgramData = m_SyncProgramData[m_SyncIndexID];

        return new Promise(function (resolve) {
            
            var ObjProfile = {Profile:SyncProgramData.assignKeyboardProfile};
            _thisDevice_Turing.SetProfileforBack(ObjProfile).then(function () 
            {
                resolve(ObjProfile.Profile);
            });
        });
    }
    DeviceApi_Turing.prototype.SetSleepAndDir = function (obj) 
    {
        var SyncProgramData = obj.SyncProgramData;
        var iProfile=obj.iProfile;

        var ihibernateTime = 6000;
        switch (SyncProgramData.hibernateTime) {
            case 0://1 Minutes
                ihibernateTime = 6000;
            break;
            case 1://3 Minutes
                ihibernateTime = 18000;
            break;
            case 3://5 Minutes
                ihibernateTime = 30000;
            break;
            case 4://10 Minutes
                ihibernateTime = 60000;
            break;
        }

        return new Promise(function (resolve) {
            
            var ObjSleepAndDir = {
                Profile:iProfile,
                Sleep:SyncProgramData.hibernate,
                SleepTime:ihibernateTime,
                Direction:SyncProgramData.directionSwitch,
                WinLock:SyncProgramData.winLock
            };
            _thisDevice_Turing.SetDeviceSleepAndDir(ObjSleepAndDir).then(function () 
            {
                resolve(0);
            });

        });
    }
    DeviceApi_Turing.prototype.SetDeviceSleepAndDir = function (obj) {
       
        var iProfile=obj.Profile;
        var bSleep=obj.Sleep;
        var iSleepTime=obj.SleepTime;
        var bDirection=obj.Direction;
        var bWinLock=obj.WinLock;
        if (m_bOpen == 0)
        {
            return;
        }

        var Data = new Buffer(new Array(264));
        Data[0] = 0x08;
        Data[1] = 0x0B;
        Data[2] = m_DeviceProfile[iProfile]; //Profile
        Data[4+0] = !bSleep; //Sleep_Flag
        Data[4+1] = parseInt(iSleepTime,10) >> 0x08; //Sleep_Flag_HIByte
        Data[4+2] = parseInt(iSleepTime,10) & 0xFF; //Sleep_Flag_LOByte
        Data[4+3] = bDirection; //Drrection_Switch
        Data[4+4] = 0; //0:6Key 1:NKey
        Data[4+5] = bWinLock; //WinLock
        
        return new Promise(function (resolve, reject) 
        {
            _thisDevice_Turing.HidWrite(Data,60).then(function () {
                resolve("SleepAndDir Done");
            });
        });
    }
    DeviceApi_Turing.prototype.SetProfileforBack = function (obj) {
       
        var iProfile=obj.Profile;
        if (m_bOpen == 0)
        {
            return;
        }
        m_bSetHWDevice = true;
	m_iCurProfile = iProfile;

        var Data = new Buffer(new Array(264));
        Data[0] = 0x08;
        Data[1] = 0x01;
        Data[2] = m_DeviceProfile[iProfile]; //Profile
        
        return new Promise(function (resolve, reject) 
        {
            _thisDevice_Turing.HidWrite(Data,100).then(function () {
                m_bSetHWDevice = false;
                resolve("SetProfile Done");
            });
        });
    }
    DeviceApi_Turing.prototype.SetProfile = function (obj,callback) {
       
        var iProfile=obj.Profile;
	m_iCurProfile = iProfile;
        env.log('DeviceApi','SetProfile',JSON.stringify(obj));
        if (m_bOpen == 0)
        {
            callback("No Device");
            return;
        }
        m_bSetHWDevice = true;
        m_SyncIndexID = -1;

        _thisDevice_Turing.SetSyncProgramID(-1);

        var Data = new Buffer(new Array(264));

        Data[0] = 0x08;
        Data[1] = 0x01;
        Data[2] = m_DeviceProfile[iProfile]; //Profile
        
        _thisDevice_Turing.HidWrite(Data,100).then(function () {
            m_bSetHWDevice = false;
            callback("SetProfile Done");
        });
    }
        
DeviceApi_Turing.prototype.SetCustomLEDProfile = function (obj, callback) 
{
    // if (m_bOpen == 0)
    // {
    //     callback("No Device");
    //     return;
    // }
    var iProfile = obj.Profile;
    
    var CustomLEDNames = [];
    const fiveDefaultLedCode = obj.KeyAssignment[iProfile].fiveDefaultLedCode;
    
    for(var i = 0; i < fiveDefaultLedCode.length; i++)
    {
        if (fiveDefaultLedCode[i].projectCode != 0) 
        {
            CustomLEDNames.push(fiveDefaultLedCode[i]);
        }
    }
    //------------------------------------
    
    
    (function SetCustomAP1(i){
       
        if (i < CustomLEDNames.length)
        {
            var bCustomLED = false;
            var CustomData;
            for (var j=0;j < m_CustomDataConfig.length;j++)
            {
                if (CustomLEDNames[i].projectCode ==  m_CustomDataConfig[j].projectCode) 
                {
                    CustomData = m_CustomDataConfig[j];
                    bCustomLED = true;

                    break;
                }
            }
            if (bCustomLED) 
            {
                
                CustomData.iProfile = iProfile;
                CustomData.iCustomNum = i;
                _thisDevice_Turing.SetCustomLED(CustomData).then(function () {

                    SetCustomAP1(i+1);
                });
            } 
            

        }
        else
        {
            var ObjEffect = {
                iProfile:iProfile,
                iLEDMode: 15,
                iCustomLEDNum: CustomLEDNames.length
            };
            _thisDevice_Turing.SetLEDEffect(ObjEffect).then(function () 
            {
                callback("SetCustomLEDProfile Done");
            });
        } 
        
    })(0);

    //------------------------------------
}

DeviceApi_Turing.prototype.SetCustomLEDAssignment = function (obj) 
{
    var iProfile = obj.iProfile;
    var KeyAssignment = obj.KeyAssignment;
    
    var CustomLEDNames = [];
    //--------------------------------------
    var Data = new Buffer(new Array(264));
    var bCustomLED = false;
    var iCustomLEDCount = 0;

    var targetArr=KeyAssignment.assignedKeyboardKeys[0];
    for(var i = 0; i < targetArr.length; i++)
    {          
        if (targetArr[i].projectCode != 0 && iCustomLEDCount<11) //Custom Assign
        {
            bCustomLED = true;
            CustomLEDNames.push(targetArr[i].projectCode);
              
            var iIndex =  Matrix_LEDCode_DarkProject.indexOf(Matrix_key[i]);
            Data[4+iIndex] = iCustomLEDCount+5;
            iCustomLEDCount++;
        }
    }


    //--------
    return new Promise(function (resolve, reject) 
    {
        if (!bCustomLED) {
            resolve("SetCustomLEDAssignment Refuse");
            return;
        }

    //------------------------------------
    
    Data[0] = 0x08;
    Data[1] = 0x0c;
    Data[2] = iProfile;
    Data[3] = 0x00;

    _thisDevice_Turing.HidWrite(Data,150).then(function () {
        //------------------------------------
        (function SetCustomAP1(i){
        
            if (i < CustomLEDNames.length)
            {
                var bCustomLED = false;
                var CustomData;
                for (var j=0;j < m_CustomDataConfig.length;j++)
                {
                    if (CustomLEDNames[i] ==  m_CustomDataConfig[j].projectCode) 
                    {
                        CustomData = m_CustomDataConfig[j];
                        bCustomLED = true;

                        break;
                    }
                }
                if (bCustomLED) 
                {

                    CustomData.iProfile = iProfile;
                    CustomData.iCustomNum = i+5;
                    _thisDevice_Turing.SetCustomLED(CustomData).then(function () {

                        SetCustomAP1(i+1);
                    });
                } 
            }
            else
            {
                resolve("SetCustomLEDAssignment Done");
            } 

        })(0);

    });

});
    
}

DeviceApi_Turing.prototype.SetKeyMatrix = function (obj, callback) 
{
    if (m_bOpen == 0)
    {
        callback("No Device");
        return;
    }
    var DataBuffer = Buffer.alloc(252);
    var Buffer1 = Buffer.alloc(252);
    DataBuffer = KeyMatrix_Default.slice();

    var bMacro = false;
    var iCustomLEDCount = 0;
    var iProfile = obj.Profile;
    var bMacroSet = Buffer.alloc(264);
    var iDataLength = Device_KeyMatrixNum;

    var KeyAssignment = obj.KeyAssignment[iProfile];

    // for (var index = 0; index < KeyAssignment.fiveDefaultLedCode.length; index++) {
    //     if (KeyAssignment.fiveDefaultLedCode[index].projectCode != 0) 
    //     {
    //         bCustomLED = true;
    //         break;
    //     }
    // }
    
    m_ApplyConfig.profile_info = obj.KeyAssignment;
    var csAssign,iAssign;
    var targetArr=KeyAssignment.assignedKeyboardKeys[0];
    var targetArr_Fn=KeyAssignment.assignedKeyboardKeys[1];

    for(var i = 0; i < targetArr.length; i++)
    {     
        csAssign = targetArr[i].keyAssignType;
        iAssign = funcVar.FuncKeyCode.indexOf(csAssign);
               
        if (csAssign == "KCombination") //KCombination
        {
            bMacro = true;
            iAssign = 0xb2;
            bMacroSet[i] = 1;
        }
        else if (csAssign == "KMacro") //Macro
        {
            bMacro = true;
            iAssign = 0xb2;
            bMacroSet[i] = 1;
        }
        else if (iAssign <0 || iAssign == 1) 
        {
            continue;
        }
         
        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        {
            if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_key[i])
            {
                DataBuffer[iIndex] = iAssign;
            }
        }
    }
    //--------------FN Keys-----------------
    
    for(var i = 0; i < targetArr_Fn.length; i++)
    {     
        csAssign = targetArr_Fn[i].keyAssignType;
        iAssign = funcVar.FuncKeyCode.indexOf(csAssign);
        

        if (csAssign == "KCombination") //KCombination
        {
            bMacro = true;
            iAssign = 0xb2;
            bMacroSet[i+iDataLength] = 1;
        }
        else if (csAssign == "KMacro") //Macro
        {
            bMacro = true;
            iAssign = 0xb2;
            bMacroSet[i+iDataLength] = 1;
        }
        else if (iAssign <0 || iAssign == 1) 
        {
            continue;
        }
         
        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        {
            if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_key[i])
            {
                DataBuffer[iIndex + Device_KeyMatrixNum] = iAssign;
            }
        }
    }

    
    //-------------Fn CombineKeys Judgment-----------------
    //
    for(var i = 0; i < m_CombineKeys.length; i++)
    {    
        for(var j = 0; j < targetArr_Fn.length; j++)
        {    
            csAssign = targetArr_Fn.keyAssignType;
            var iDefaultKeyNum = Matrix_key.indexOf(m_CombineKeys[i].Matrix_key);
            // {FuncKeyCode:"KRset7",Matrix_key:"z"},//BT1
            if (m_CombineKeys[i].FuncKeyCode == csAssign && targetArr_Fn[iDefaultKeyNum].keyAssignType == "") 
            {
                for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
                {
                    if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_key[iDefaultKeyNum])
                    {
                        DataBuffer[iIndex+Device_KeyMatrixNum] = 0x00;
                        break;
                    }
                }
                break;
            }
        }
    }
    //-------------------------------------
    m_bSetHWDevice = true;
    //-----------Set Report Rate-----------------
    m_iDeviceReportRate = KeyAssignment.reportRateIndex;
    //-------------------------------------
    var ObjSleepAndDir = {
        iProfile: iProfile,
        SyncProgramData: KeyAssignment
    }
    setTimeout(function(){
        _thisDevice_Turing.SetProfileInfo2Device(ObjSleepAndDir).then(function() {
            _thisDevice_Turing.SetSleepAndDir(ObjSleepAndDir).then(function() {
            //-------------------------------------
                var Obj3 = {
                    iProfile: iProfile,
                    DataBuffer: DataBuffer
                }
                _thisDevice_Turing.SendKeyMatrix2Device(Obj3).then(function() {
                    if (bMacro){
                        var ObjCustomLED = {
                            iProfile: iProfile,
                            iCustomLEDCount:iCustomLEDCount,
                            KeyAssignment:KeyAssignment
                        }
                        var ObjMacro = {
                            iProfile: iProfile,
                            bMacroSet:bMacroSet
                        }
                        _thisDevice_Turing.SetMacroKey(ObjMacro).then(function() {
                            _thisDevice_Turing.SetCustomLEDAssignment(ObjCustomLED).then(function() {
                                m_bSetHWDevice = false;
                                callback("SendDevice Done");
                            });
                        });
                    }
                    else{
                        var ObjCustomLED = {
                            iProfile: iProfile,
                            iCustomLEDCount:iCustomLEDCount,
                            KeyAssignment:KeyAssignment
                        }
                        _thisDevice_Turing.SetCustomLEDAssignment(ObjCustomLED).then(function() {
                            m_bSetHWDevice = false;
                            callback("SendDevice Done");
                        });
                    }
                });
            });
        });

    },100);
};

DeviceApi_Turing.prototype.SetMacroKey = function (Obj, callback) 
{
    var iProfile=Obj.iProfile;
    var DataBuffer = Buffer.alloc(264);
    //var iCurKey = Obj.iCurKey;
    var bMacroSet = Obj.bMacroSet;
    var iDataLength = Device_KeyMatrixNum;
    
    return new Promise(function (resolve, reject) 
    {
        (function SetAP1(i){

            if (i < iDataLength*2)//62*2 
            {
                var bMacro = false;

                if (bMacroSet[i] == 1) //Macro
                {
                    for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
                    {
                        if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_key[i%iDataLength] && bMacroSet[i] == 1)
                        {
                            var Data = Buffer.alloc(264);
                            Data[0] = 0x08;
                            Data[1] = 0x05;
                            Data[2] = m_DeviceProfile[iProfile] ; //DataProfile
                            if (i>=iDataLength) 
                            {
                                Data[3] = Device_KeyMatrixNum+iIndex;//Index
                            } 
                            else 
                            {
                                Data[3] = iIndex;//Index
                            }
                        
                            var ObjMacro = {
                                iProfile:iProfile,
                                iKey: i
                            };
                            DataBuffer = _thisDevice_Turing.MacroToData(ObjMacro);
                            env.log('SetMacroKey',i,JSON.stringify(DataBuffer));
                        
                            for (var k = 0; k < 252; k++)
                            {
                                Data[4 + k] = DataBuffer[k];
                            }
                            _thisDevice_Turing.HidWrite(Data,130).then(function() {
                            
                                SetAP1(i + 1);
                            });


                            break;
                        }
                    }
                }
                else//bMacroSet[i] == 0
                {
                    SetAP1(i + 1);
                }

            }
            else
            {
                resolve("Done");
                //callback("Done");
            }


        })(0);
    });
};


DeviceApi_Turing.prototype.MacroToData = function (Obj) 
{
    var iDataLength = Device_KeyMatrixNum;
    var DataBuffer = new Buffer(new Array(264));
    var iKey = Obj.iKey;
    var iProfile = Obj.iProfile;
    var iMacroID,iRepeatTime;
    var bCombination = false;
    var csCombinationKey;
    
    if (iKey>=iDataLength) //Fn
    {
        var targetArr_Fn = m_ApplyConfig.profile_info[iProfile].assignedKeyboardKeys[1];

        if (targetArr_Fn[iKey-iDataLength].keyAssignType == "KCombination") 
        {
            bCombination = true;
            csCombinationKey = targetArr_Fn[iKey-iDataLength].value;
        } 
        else 
        {
            iMacroID = targetArr_Fn[iKey-iDataLength].macroCode;
            iRepeatTime = targetArr_Fn[iKey-iDataLength].macroOptionNumber;
        }
    } 
    else 
    {
        var targetArr = m_ApplyConfig.profile_info[iProfile].assignedKeyboardKeys[0];
        
        if (targetArr[iKey].keyAssignType == "KCombination") 
        {
            bCombination = true;
            csCombinationKey = targetArr[iKey].value;
        } 
        else 
        {
            iMacroID = targetArr[iKey].macroCode;
            iRepeatTime = targetArr[iKey].macroOptionNumber;
        }
    }

    var MacroData = [];
    //-------Search Macro Data----------
    if (bCombination) 
    {
        var csCombKey = [];
        csCombKey = csCombinationKey.split('+');
        var CombKeyCode = [];
        var iIndex = 0;
        
        for (var i=0;i < csCombKey.length;i++)
        {
            for (var j=0;j<ConstArray.customEventCode.length;j++)
            {
                if (ConstArray.customEventCode[j].event_code == csCombKey[i]) 
                {
                    var csKey = ConstArray.customEventCode[j].event_keycode;
                    CombKeyCode[i] = csKey;
                    //break;
                }
            }


        }
        for (var i=0;i < CombKeyCode.length;i++)
        {
            var tmpMacroData =
            {
                bKeyDown:1,
                byDelay:1,
                byKeyCode:CombKeyCode[i]
            }
            MacroData[i] = tmpMacroData;

            tmpMacroData =
            {
                bKeyDown:0,
                byDelay:1,
                byKeyCode:CombKeyCode[i]
            }
            MacroData[CombKeyCode.length*2-1-i] = tmpMacroData;
        }

        iRepeatTime = 1;

        
    } 
    else //Macro
    {
        var iIndex = 0;
        var bMacro = false;
        
        for (var i=0;i < m_MacroConfig.length;i++)
        {
            for (var j=0;j < m_MacroConfig[i].MacroFiletItem.length;j++)
            {
                if (iMacroID ==  m_MacroConfig[i].MacroFiletItem[j].IndexCode) 
                {
                    iIndex = i;
                    MacroData = m_MacroConfig[i].MacroFiletItem[j].Data;
                    bMacro = true;
                    
                    env.log('MacroToData-ID:', iMacroID, MacroData);
                    //MacroData=$.extend(m_MacroConfig[i].MacroFiletItem[j].Data);  
                    break;
                }
    
            }
            if (bMacro) 
            {
                break;
            }
            
        }
        
    }

    //-------Set Macro To Data----------
    DataBuffer[0] = parseInt(iRepeatTime,10) >> 0x08;
    DataBuffer[1] = parseInt(iRepeatTime,10) & 0xFF;
                    
    for (var i=0;i<MacroData.length;i++)
    {
        //Stage:1-1ms
        var iDelay = MacroData[i].byDelay/20;
        if (iDelay<1) 
        {
            iDelay = 1;
        }
        // //Stage:1-1ms
        // var iDelay = MacroData[i].byDelay;
        // if (iDelay<20) 
        // {
        //     iDelay = 20;
        // }

        DataBuffer[2+i*3+0] = iDelay >> 0x08;
        if (MacroData[i].bKeyDown) 
        {
            DataBuffer[2+i*3+0] += 0x80; 
        } 
        DataBuffer[2+i*3+1] = iDelay & 0xFF;
        //DataBuffer[2+i*3+2] = MacroData[i].byKeyCode;
        
        for (var j=0;j<ConstArray.customEventCode.length;j++)
        {
            var iAssign = 0x04;
            if (ConstArray.customEventCode[j].event_keycode == MacroData[i].byKeyCode) 
            {
                var csKey = ConstArray.customEventCode[j].sharedtext;
                iAssign = funcVar.FuncMacroKeyCode.indexOf(csKey);
                break;
            }
        }
        
        DataBuffer[2+i*3+2] = iAssign;
    }
    //-------test----------


    return DataBuffer;

}

DeviceApi_Turing.prototype.SendKeyMatrix2Device = function (Obj, callback) {

    var iProfile=Obj.iProfile;
    var Data = new Buffer(new Array(264));
    var DataBuffer = Obj.DataBuffer;                 
    // //-----------------------------------
    return new Promise(function (resolve, reject) {
        
        if (m_bOpen == 0)
        {
            resolve("No Device");
        }
        else
        {

            
        Data[0] = 0x08;
        Data[1] = 0x03;
        Data[2] = m_DeviceProfile[iProfile]; //DataProfile
        for (var i = 0; i < 256; i++)
        {
            Data[4 + i] = DataBuffer[i];
        }
        _thisDevice_Turing.HidWrite(Data,100).then(function () {
            resolve("SendKeyMatrix2Device Done");
        });
        }
    
    
    });
    //-----------------------------------
};

// DeviceApi_Turing.prototype.SendSwitchAPMode = function (Obj, callback) {
//     var Data = new Buffer(new Array(264));
//     var bSet = 0;
//     if (!Obj) 
//     {
//         bSet = 2;//Stop Ap Mode
//     } 
                 
//     //-----------------------------------
//     return new Promise(function (resolve) {
//        Data[0] = 0x07;
//        Data[1] = 0x16;
//        Data[2] = 0; //DataProfile
//        Data[3] = bSet;
//        //_thisDevice_Turing.SetFeatureReport(0,Data,30).then(function () {
//            resolve("SendSwitchAPMode Done");
//        //}); 
//     });
//     //-----------------------------------
// };

function hexToRgb(InputData) {
    try {

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(InputData);
        console.log("hexToRgbResult", [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]);
        return result ?              
        {
            R: parseInt(result[1], 16),
            G: parseInt(result[2], 16),
            B: parseInt(result[3], 16)
        }
        //[parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ]
        : null;
    }
    catch{
        return 1;
    }
}
//--------------CustomLEDData---------------------------------
DeviceApi_Turing.prototype.SetCustomLED = function (Obj) {
        
    var MatrixColorMode = Obj.matrix_ColorMode;
    var MatrixFrames = Obj.matrix_frames;

    var iProfile=Obj.iProfile;//Profile 1
    var iCustomNum = Obj.iCustomNum;//CustomNum 1

    var DataBuffer = new Buffer(new Array(512));
    var iMatrixLength = Device_KeyMatrixNum;//104KEYS:126

    DataBuffer.fill(0x00, iMatrixLength*0, iMatrixLength*3);//All black
    if (m_bOpen == 0)
    {
        return new Promise(function (resolve, reject) {
            resolve("No Device");
            //env.log("DeviceApi","SetLEDMatrix","No Device");
        });
    }

    //-------------Send Custom Color to Data------------------
    
    for(var iColorMode = 0; iColorMode < MatrixColorMode.length; iColorMode++)
    { 

        var Color = hexToRgb(MatrixColorMode[iColorMode].color);
        if (MatrixColorMode[iColorMode].colorMode == 1)//Cycle
        {
            Color = {R:255,G:255,B:255}
        }
        
        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        { 
            for(var i = 0; i < Matrix_LED.length; i++)
            {
                if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i] && MatrixColorMode[iColorMode].frame_selection_range[i])
                {
                    DataBuffer[iIndex] = Color.R;
                    DataBuffer[iIndex+iMatrixLength*1] = Color.G;
                    DataBuffer[iIndex+iMatrixLength*2] = Color.B;
                    break;
                }
            }
        }

    }
    var ObjColor = {
        iProfile: iProfile,
        iCustomNum: iCustomNum,
        DataBuffer: DataBuffer
    }
    //-------------Send Custom Frame to Data------------------
    
    DataBuffer = new Buffer(new Array(512));
    DataBuffer[0] = MatrixFrames.length;


    for(var iFrame = 0; iFrame < MatrixFrames.length; iFrame++)
    { 
        var Frametime = parseInt(MatrixFrames[iFrame].frame_time);

        DataBuffer[341+iFrame*2+0] = Frametime >> 0x08;
        DataBuffer[341+iFrame*2+1] = Frametime & 0xFF;

        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        { 
            for(var i = 0; i < Matrix_LED.length; i++)
            {
                if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i] && MatrixFrames[iFrame].frame_selection_range[i])
                {
                    //var bFrameSet = MatrixFrames[iFrame].frame_selection_range[i]
                    var iIndexGroup = parseInt(iIndex/6);
                    var iIndexQuotient = iIndex%6;
                    //var iGroupNum = DataBuffer[1+iIndexGroup];
                    DataBuffer[1+iFrame*17+iIndexGroup] |= Math.pow(2,iIndexQuotient);//Binary To Byte By OR method
                    break;
                }
            }
        }
        

    }
    
    var ObjFrame = {
        iProfile: iProfile,
        iCustomNum: iCustomNum,
        DataBuffer: DataBuffer
    }
    //-------------Send Custom Effect to Data------------------
    var EffectArray = [2,0,1,1];
    DataBuffer = new Buffer(new Array(512));
    DataBuffer.fill(2, iMatrixLength*0, iMatrixLength*1);//Static
    for(var iColorMode = 0; iColorMode < MatrixColorMode.length; iColorMode++)
    { 

        var Effect = EffectArray[MatrixColorMode[iColorMode].colorMode];
        var Speed = parseInt(MatrixColorMode[iColorMode].speed);
        var Breath_Extinguish = parseInt(MatrixColorMode[iColorMode].speed2);
        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        { 
            for(var i = 0; i < Matrix_LED.length; i++)
            {
                if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i] && MatrixColorMode[iColorMode].frame_selection_range[i])
                {
                    DataBuffer[iIndex] = Effect;
                    DataBuffer[iIndex+iMatrixLength*1] = Speed;
                    DataBuffer[iIndex+iMatrixLength*2] = Breath_Extinguish;
                    break;
                }
            }
        }
        if (MatrixColorMode[iColorMode].colorMode == 1) //Cycle
        {    
            var ColorClcle =["#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff"]
            var ColorStage = ColorClcle.indexOf(MatrixColorMode[iColorMode].color);
            if (ColorStage == -1) 
            {
                ColorStage = 0;
            }

            //var iKey =  Matrix_key.indexOf(Matrix_LEDCode_DarkProject[obj]);
            for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
            { 
                for(var i = 0; i < Matrix_LED.length; i++)
                {
                    if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i] && MatrixColorMode[iColorMode].frame_selection_range[i])
                    {
                        DataBuffer[iIndex+iMatrixLength*2] = ColorStage;
                        break;
                    }
                }
            }
        }
        else if (MatrixColorMode[iColorMode].colorMode == 2 || MatrixColorMode[iColorMode].colorMode == 3) //Rainbow-Breath Cycle
        {            
            for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
            { 
                for(var i = 0; i < Matrix_LED.length; i++)
                {
                    if (MatrixColorMode[iColorMode].colorMode == 3 && Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i] && MatrixColorMode[iColorMode].frame_selection_range[i])
                    {
                        var iIndexGroup = parseInt(iIndex/6);
                        var iIndexQuotient = iIndex%6;
                        DataBuffer[iMatrixLength*3+iIndexGroup] |= Math.pow(2,iIndexQuotient);//Binary To Byte By OR method
                        break;
                    }
                }
            }
        }
        
    }
    var ObjEffect = {
        iProfile: iProfile,
        iCustomNum: iCustomNum,
        DataBuffer: DataBuffer
    }
    //-------------Send Custom to Device------------------

    return new Promise(function (resolve) {
        
        
        _thisDevice_Turing.SendCustomLEDColor2Device(ObjColor).then(function () {
            _thisDevice_Turing.SendCustomLEDFrame2Device(ObjFrame).then(function () {
                _thisDevice_Turing.SendCustomLEDEffect2Device(ObjEffect).then(function () {
                    resolve(0);
                });
            });
        });

        // Promise.all([_thisDevice_Turing.SendCustomLEDColor2Device(ObjColor),_thisDevice_Turing.SendCustomLEDFrame2Device(ObjFrame),_thisDevice_Turing.SendCustomLEDEffect2Device(ObjEffect)]).then(function () {
        //     resolve(0);
        // }, function () {
        //     env.log('Interface Error', 'CloseAllDevice', ` Close HidDevice fail `);
        //     resolve(0);
        // });
    });
    
}

DeviceApi_Turing.prototype.SendCustomLEDColor2Device = function (Obj) {
    var Data = new Buffer(new Array(264));
    var DataBuffer = new Buffer(new Array(432));
    var iProfile=Obj.iProfile;
    var iCustomNum=Obj.iCustomNum;

    var DataBuffer = Obj.DataBuffer;
                 
    //-----------------------------------
    return new Promise(function (resolve) {
               
       (function SetAp(j) {
            if (j < 2) {
                Data = new Buffer(new Array(264));
                Data[0] = 0x08;
                Data[1] = 0x08;
                Data[2] = m_DeviceProfile[iProfile];
                Data[3] = iCustomNum;
                Data[4] = j; //DataNum

                for (var i = 0; i < 251; i++)
                    Data[5 + i] = DataBuffer[251 * j + i];
                    _thisDevice_Turing.HidWrite(Data,50).then(function () {
                    SetAp(j + 1);
                });
            } else {
                Sleep(100).then(function() {
                   resolve("12");
                });
            }
        })(0);

    });
}
DeviceApi_Turing.prototype.SendCustomLEDFrame2Device = function (Obj) {
    var Data = new Buffer(new Array(264));
    var DataBuffer = new Buffer(new Array(432));
    var iProfile=Obj.iProfile;
    var iCustomNum=Obj.iCustomNum;

    var DataBuffer = Obj.DataBuffer;
                 
    //-----------------------------------
    return new Promise(function (resolve) {
               
        (function SetAp(j) {
            if (j < 2) {
                Data = new Buffer(new Array(264));
                Data[0] = 0x08;
                Data[1] = 0x09;
                Data[2] = m_DeviceProfile[iProfile];
                Data[3] = iCustomNum;
                Data[4] = j; //DataNum

                for (var i = 0; i < 251; i++)
                    Data[5 + i] = DataBuffer[251 * j + i];
                    _thisDevice_Turing.HidWrite(Data,50).then(function () {
                    SetAp(j + 1);
                });
            } else {
                Sleep(100).then(function() {
                   resolve("12");
                });
            }
        })(0);
    });
}
DeviceApi_Turing.prototype.SendCustomLEDEffect2Device = function (Obj) {
    var Data = new Buffer(new Array(264));
    var DataBuffer = new Buffer(new Array(432));
    var iProfile=Obj.iProfile;
    var iCustomNum=Obj.iCustomNum;

    var DataBuffer = Obj.DataBuffer;
                 
    //-----------------------------------
    return new Promise(function (resolve) {
               
       (function SetAp(j) {
           if (j < 2) {
                Data = new Buffer(new Array(264));
                Data[0] = 0x08;
                Data[1] = 0x0a;
                Data[2] = m_DeviceProfile[iProfile];
                Data[3] = iCustomNum;
                Data[4] = j; //DataNum
            
                for (var i = 0; i < 251; i++)
                    Data[5 + i] = DataBuffer[251 * j + i];
                    _thisDevice_Turing.HidWrite(Data,50).then(function () {
                    SetAp(j + 1);
                });
            } else {
                Sleep(100).then(function() {
                   resolve("12");
                });
            }
        })(0);
    });
}
//--------------------------------------------------------------------

   DeviceApi_Turing.prototype.SendLEDData2Device = function (Obj) {
    var Data = new Buffer(new Array(264));
    var DataBuffer = new Buffer(new Array(432));


       var DataBuffer = Obj.DataBuffer;
                 
         // //-----------------------------------

         return new Promise(function (resolve) {
             (function SetAp(j) {
                 if (j < 2) {
                     Data = new Buffer(new Array(264));
                     Data[0] = 0x08;
                     Data[1] = 0x07;
                     Data[3] = j; //Number

                     for (var i = 0; i < 252; i++)
                         Data[4 + i] = DataBuffer[252 * j + i];
                         _thisDevice_Turing.HidWrite(Data,15).then(function () {
                         SetAp(j + 1);
                     });
                 } else {
                     Sleep(30).then(function() {
                        resolve("12");
                     });
                 }
             })(0);
         });
         //-----------------------------------
     }
    DeviceApi_Turing.prototype.SetLEDEffect = function (Obj,callback) 
    {
        var iProfile = Obj.iProfile;//Profile 1
        var Data = new Buffer(new Array(265));
        m_iDeviceEffect = Obj.iLEDMode;
        m_iCustomLEDNum = Obj.iCustomLEDNum;
        
        if (iProfile == undefined)
            iProfile = m_iCurProfile;

        if (Obj.iCustomLEDNum == undefined) {
            var iCustomLEDNum = 0;
            for(var i = 0; i<m_ApplyConfig.profile_info[iProfile].fiveDefaultLedCode.length; i++)
            {
                if (m_ApplyConfig.profile_info[iProfile].fiveDefaultLedCode[i].projectCode!=0)
                    iCustomLEDNum++;
            }
            m_iCustomLEDNum = iCustomLEDNum;
            
        }
        //-----------------------------------
        
        let ObjProfile = {
            iProfile: iProfile
        }

         return new Promise(function (resolve) {
            Sleep(100).then(function() {
                _thisDevice_Turing.SetProfileInfo2Device(ObjProfile).then(function () {
                    resolve("12");
                });
            });

        });
        //-----------------------------------
    }
    DeviceApi_Turing.prototype.SetProfileInfo2Device = function (Obj) {
       
        var iProfile=Obj.iProfile;//
        if (m_bOpen == 0)
        {
            return;
        }

        var Data = new Buffer(new Array(264));
        Data[0] = 0x08;
        Data[1] = 0x02;
        Data[2] = m_DeviceProfile[iProfile]; //Profile
        
        for (var i = 0; i < Profileinfo_Default.length; i++)
        {
             Data[4 + i] = Profileinfo_Default[i];
        }
        //-----------------------------------
        var ReportRateArr = [0,2,4,8];
        Data[4+0] = ReportRateArr[m_iDeviceReportRate]; 

        Data[4+3] = m_iDeviceEffect; 
        
        Data[4+136] = 0; //Coustom_Mode
        if (m_iCustomLEDNum>0)
        {
            Data[4+137] = m_iCustomLEDNum; //Current coustom num
            Data[4+138] = m_iCustomLEDNum; //Total coustom num 1~5
        }
        else
        {
            Data[4+137] = 1; //Current coustom num
            Data[4+138] = 0xff; //Total coustom num 1~5
        }

        //-----------------------------------
        return new Promise(function (resolve, reject) 
        {
            _thisDevice_Turing.HidWrite(Data,50).then(function () {
                resolve("SetProfileInfo Done");
            });
        });
    }
    DeviceApi_Turing.prototype.SetLEDMatrix = function (Obj) {
        
        //_this.AudioCap.CapStart(0);
        var iProfile=1;//Profile 1
        var DataBuffer = new Buffer(new Array(432));

        var iMatrixLength = Device_KeyMatrixNum;//104KEYS:126
        //var iMatrixLength = 102;//87KEYS:102
        if (m_bOpen == 0)
        {
            return new Promise(function (resolve, reject) {
                resolve("No Device");
                //env.log("DeviceApi","SetLEDMatrix","No Device");
            });
        }
        else if (m_bSetDevice || m_bSetHWDevice)
        {
            //env.log("DeviceApi","SetLEDMatrix","Setting Device");
            return;
        }
        
        for(var iIndex = 0; iIndex < Matrix_LEDCode_DarkProject.length; iIndex++)
        { 
            for(var i = 0; i < Matrix_LED.length; i++)
            {
                if (Matrix_LEDCode_DarkProject[iIndex] == Matrix_LED[i])
                {
    
                    DataBuffer[iIndex+iMatrixLength*0] = Obj.Buffer[i];
                    DataBuffer[iIndex+iMatrixLength*1] = Obj.Buffer[i+144];
                    DataBuffer[iIndex+252] = Obj.Buffer[i+144*2];//Number 2-Blue
                    break;
                }
            }
        }

        var Obj3 = {
            iProfile: iProfile,
            DataBuffer: DataBuffer
        }
        return new Promise(function (resolve, reject) {

            if (!m_bSetHWDevice) 
            {
                _thisDevice_Turing.SendLEDData2Device(Obj3).then(function() {

                });
            } 
            // else 
            // {
            // }
        
        });
        
    }

    DeviceApi_Turing.prototype.SendEnableEP2 = function () {
     
        var Data = new Buffer(new Array(264));
    
        Data[0] = 0x08;
        Data[1] = 0x06;
        Data[2] = 1; //Enable

        //var DataBuffer = Obj.DataBuffer;
                     
        // //-----------------------------------   
        return new Promise(function (resolve) {
                    // if(j!=0)
                    
            _thisDevice_Turing.HidWrite(Data,100).then(function () {
                resolve("SendEnableEP2 Done");
            });

        });
        //-----------------------------------

    }
    DeviceApi_Turing.prototype.GetDeviceType = function () {
     
        iEP2DataType = 0xf8;
        var Data = new Buffer(new Array(264));
    
        Data[0] = 0x08;
        Data[1] = 0x20;
        Data[2] = 0x87;
                     
        //-----------------------------------   
        return new Promise(function (resolve) {
                    
            _thisDevice_Turing.HidWrite(Data,200).then(function () {
                resolve("SendEnableEP2 Done");
            });

        });
        //-----------------------------------

    }
    DeviceApi_Turing.prototype.SetFeatureReport = function (buf,iSleep) {
        // env.log("DeviceApi","SetFeatureReport","SetFeatureReport",'777')
        return new Promise(function (resolve, reject) {
            var rtnData = _thisDevice_Turing.hiddevice.SetFeatureReport(1,0x07, 264, buf);
            setTimeout(function(){
                try{
                // var rtnData = _thisDevice_Turing.hiddevice.SetFeatureReport(buf[0], buf.length, buf);

                    //if(rtnData != buf.length)
                    if(rtnData != 264)
                        env.log("DeviceApi SetFeatureReport","SetFeatureReport(error) return data length : ",JSON.stringify(rtnData));

                    resolve(rtnData);
                }catch(err){
                    env.log("DeviceApi Error","SetFeatureReport",`ex:${err.message}`);
                    resolve(err);
                }
            },iSleep);
        });
    }
    DeviceApi_Turing.prototype.HidWrite = function (buf,iSleep) {
        if (m_bFirmwareUpdate) 
        {
            return;
        }
        // env.log("DeviceApi","SetFeatureReport","SetFeatureReport",'777')
        return new Promise(function (resolve, reject) {
            var rtnData = _thisDevice_Turing.hiddevice.SetHidWrite(g_DeviceID,0x08, 256, buf);
            setTimeout(function(){
                try{
                    resolve(rtnData);
                }catch(err){
                    env.log("DeviceApi Error","HidWrite",`ex:${err.message}`);
                    resolve(err);
                }
            },iSleep);
        });
    }
    

    DeviceApi_Turing.prototype.GetDeviceProfieID = function (obj,callback) {
        env.log('DeviceApi','GetDeviceProfieID','GetDeviceProfieID')
        var Data = new Buffer(new Array(264));
        return new Promise(function (resolve, reject) {
            Data[0] = 0x08;
            Data[1] = 0x81;
            iEP2DataType = 0x81;
            m_bSetHWDevice = true;
            
            _thisDevice_Turing.HidWrite(Data,1500).then(function () {
                m_bSetHWDevice = false;
                resolve("GetDeviceProfieID Done");
            });

        });
    }
    
    DeviceApi_Turing.prototype.SetAllDB = function (Obj,callback) 
    {
        m_bSetDevice = true;//SETDB

        //------------Profile DB---------------
        //_thisDevice_Turing.SetProfileDB(Obj.SWprofiles);
        
        Promise.all([ _thisDevice_Turing.SetProfileDB(Obj.SWprofiles),_thisDevice_Turing.SetMacroDB(Obj.MacroObj),
                     _thisDevice_Turing.SetCustomDataDB(Obj.CustomDataObj),_thisDevice_Turing.SetSyncProgDataDB(Obj.ObjSyncData),
                     _thisDevice_Turing.SetDarkProjectDB(Obj.APPConfig)]).then(function () {
            callback("SetAllDB Done");
        }, function () {
            env.log('Interface Error', 'SetAllDB', ` SetAllDB fail `);
            resolve(0);
        });
        
        m_bSetDevice = false;//SETDB


    }
    
    DeviceApi_Turing.prototype.SetProfileDB = function (Obj) 
    {
        if (Obj == undefined) 
        {
            return;
        }
        var profile_info = [];
        var AppDataPath = env.appData+"\\KEMOVE\\Profile";
        
        
        today =new Date();
        var CountTime = today.getTime();

        AppDataPath = env.appData+"\\KEMOVE\\Profile.JsonDB";
        _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
        {
            profile_info = Obj;
            if (!doc[0]) 
            {  
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,profile_info).then((doc1) => 
                {
                    today2 =new Date();
                    var ResultTime = today2.getTime() - CountTime; 

                });
            }
            else
            {
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,profile_info).then((doc1) => 
                {
                    today2 =new Date();
                    var ResultTime = today2.getTime() - CountTime; 
                    
                });
            }
        });

    }
    
    DeviceApi_Turing.prototype.SetMacroDB = function (Obj) 
    {
        if (Obj == undefined) 
        {
            return;
        }
        var AppDataPath = env.appData+"\\KEMOVE\\Macro";

        m_MacroConfig = Obj;

        AppDataPath = env.appData+"\\KEMOVE\\Macro.JsonDB";
        
        today =new Date();
        var CountTime = today.getTime();
        _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
        {
            if (!doc[0]) 
            {  
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_MacroConfig).then((doc1) => 
                {
                    today2 =new Date();
                    var ResultTime = today2.getTime() - CountTime; 

                });
            }
            else
            {
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_MacroConfig).then((doc1) => 
                {
                    today2 =new Date();
                    var ResultTime = today2.getTime() - CountTime; 
                    
                });
            }
        });

    }

    DeviceApi_Turing.prototype.SetCustomDataDB = function (Obj) 
    {
        if (Obj == undefined) 
        {
            return;
        }
        var AppDataPath;

        m_CustomDataConfig = Obj;

        AppDataPath = env.appData+"\\KEMOVE\\CustomData.JsonDB";
        
        _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
        {
            if (!doc[0]) 
            {  
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_CustomDataConfig).then((doc1) => 
                {
                });
            }
            else
            {
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_CustomDataConfig).then((doc1) => 
                {
                });
            }
        });

    }
    DeviceApi_Turing.prototype.SetSyncProgDataDB = function (Obj) 
    {
        if (Obj == undefined) 
        {
            return;
        }
        var AppDataPath;

        m_SyncProgramData = Obj;

        AppDataPath = env.appData+"\\KEMOVE\\SetSyncProg.JsonDB";
        
        _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
        {
            if (!doc[0]) 
            {  
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_SyncProgramData).then((doc1) => 
                {
                });
            }
            else
            {
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,m_SyncProgramData).then((doc1) => 
                {
                });
            }
        });

    }
    DeviceApi_Turing.prototype.SetDarkProjectDB = function (Obj) 
    {
        if (Obj == undefined) 
        {
            return;
        }
        var AppDataPath;

        var DarkProjectData = Obj;

        AppDataPath = env.appData+"\\DarkProject-KD3.JsonDB";
        
        _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
        {
            if (!doc[0]) 
            {  
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,DarkProjectData).then((doc1) => 
                {
                });
            }
            else
            {
                _thisDevice_Turing.JsonDB.SetProfile(AppDataPath,DarkProjectData).then((doc1) => 
                {
                });
            }
        });
    }

    
    
    DeviceApi_Turing.prototype.ReadAllDB = function (Obj,callback) 
    {

        m_bSetDevice = true;//SETDB


        //------------Profile DB---------------
        //_thisDevice_Turing.SetProfileDB(Obj.SWprofiles);
        
        Promise.all([ _thisDevice_Turing.ReadProfileDB(),_thisDevice_Turing.ReadMacroDB(),
                      _thisDevice_Turing.ReadCustomDataDB(),_thisDevice_Turing.ReadSyncProgDataDB(),
                      _thisDevice_Turing.ReadDarkProjectDB()]).then(function (values) {
            
            var AllDB = {
                SWprofiles: values[0],
                MacroObj: values[1],
                CustomObj: values[2],
                SyncProgObj: values[3],
                APPConfigObj: values[4]
            };
            callback(AllDB);
        }, function () {
            env.log('Interface Error', 'SetAllDB', ` SetAllDB fail `);
            resolve(0);
        });
        
        m_bSetDevice = false;//SETDB

    }
    
    DeviceApi_Turing.prototype.ReadProfileDB = function () 
    {
        var AppDataPath2 = env.appData;
        
        env.log('Interface Error', 'SetAllDB', ` SetAllDB fail `);

        var AppDataPath = env.appData+"\\KEMOVE\\Profile";
        
        return new Promise(function (resolve) {

            today =new Date();
            var CountTime = today.getTime();
            
            AppDataPath = env.appData+"\\KEMOVE\\Profile.JsonDB";
            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (!doc[0] && doc.radioOptions == undefined) 
                {
                    resolve(undefined);
                }
                else
                {
                    for (let index = 0; index < doc.KeyBoardArray.length; index++) {
                        m_ApplyConfig.profile_info[index].assignedKeyboardKeys = doc.KeyBoardArray[index].assignedKeyboardKeys;
                        m_ApplyConfig.profile_info[index].fiveDefaultLedCode = doc.KeyBoardArray[index].fiveDefaultLedCode;
                        
                    }
                    
                    today2 =new Date();
                    var ResultTime = today2.getTime() - CountTime; 
                    
                    resolve(doc);
                }
            
            });        
         });

    }
    
    DeviceApi_Turing.prototype.ReadMacroDB = function () 
    {
        var MacroConfig = [];
        var AppDataPath = env.appData+"\\KEMOVE\\Macro";
        
        return new Promise(function (resolve) {

            AppDataPath = env.appData+"\\KEMOVE\\Macro.JsonDB";
            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (!doc[0]) 
                {
                    resolve(undefined);
                }
                else
                {
                    MacroConfig = doc;
                    m_MacroConfig = MacroConfig;
                    resolve(MacroConfig);
                }
            });       

        });
    }
    DeviceApi_Turing.prototype.ReadCustomDataDB = function () 
    {
        var CustomDataConfig = [];
        var AppDataPath;
        
        return new Promise(function (resolve) {

            AppDataPath = env.appData+"\\KEMOVE\\CustomData.JsonDB";
            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (!doc[0]) 
                {
                    resolve(undefined);
                }
                else
                {
                    CustomDataConfig = doc;
                    m_CustomDataConfig = CustomDataConfig;
                    resolve(CustomDataConfig);
                }
            });       

        });
    }
    DeviceApi_Turing.prototype.ReadSyncProgDataDB = function () 
    {
        var SyncProgramDataConfig = [];
        var AppDataPath;
        
        return new Promise(function (resolve) {

            AppDataPath = env.appData+"\\KEMOVE\\SetSyncProg.JsonDB";
            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (!doc[0]) 
                {
                    resolve(undefined);
                }
                else
                {
                    var Obj = {
                        ObjSyncData: doc
                    };
                    _thisDevice_Turing.SetSyncProgram(Obj),

                    SyncProgramDataConfig = doc;
                    m_SyncProgramData = SyncProgramDataConfig;
                    resolve(SyncProgramDataConfig);
                }
            });       

        });
    }    
    DeviceApi_Turing.prototype.ReadDarkProjectDB = function () 
    {
        var DarkProject;
        var AppDataPath;
        
        return new Promise(function (resolve) {

            AppDataPath = env.appData+"\\DarkProject-KD3.JsonDB";
            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (doc.chooseLangindex == undefined) 
                {
                    resolve(undefined);
                }
                else
                {
                    DarkProject = doc;
                    resolve(DarkProject);
                }
            });       

        });
    }    

    

    DeviceApi_Turing.prototype.ReadFWVersion = function () 
    {
        var SyncProgramDataConfig = [];
        var AppDataPath;
        
        return new Promise(function (resolve) {
            
            // if (m_bOpen == 0)
            // {
            //     resolve(0);
            // }
            
            var rtnData = _thisDevice_Turing.hiddevice.GetFWVersion(g_DeviceID);
            var OldFWVersion = parseInt(rtnData.toString(16), 10);
            //-----------------------------
            if (env.isMac) 
            {
                AppDataPath = env.GetAppLocations();
                AppDataPath += "/FWUpdate/Versions.JsonDB";
            }
            else
            {
                AppDataPath = env.appRoot+"\\FWUpdate\\Versions.JsonDB";
            }

            //-----------------------------

            _thisDevice_Turing.JsonDB.GetProfile(AppDataPath).then((doc) => 
            {
                if (!doc.FWContents == undefined) 
                {
                    resolve(0);
                }
                else
                {
                    var NewFWVersion = doc.FWContents[0].FWVersion;//0:Turing-Kemove
                    m_NewFWVersion = NewFWVersion;

                    var Obj2;
                    //---------Releasenote_lang--------
                    var AppDataPath;
                    if (env.isMac) 
                    {
                        AppDataPath = env.GetAppLocations();
                        AppDataPath += "/FWUpdate/Releasenote_lang1.txt";
                    }
                    else
                    {
                        AppDataPath = env.appRoot+"\\FWUpdate\\Releasenote_lang1.txt";
                    }
                    
                    _thisDevice_Turing.ReadAllReleasenote(0,function (strReleasenote) {

                        if (NewFWVersion > OldFWVersion) 
                        {
                            Obj2 = {
                                Type: funcVar.FuncType.Device,
                                Func: evtType.SendNotification,
                                Param: {Text:"New Version Detected!",Device:0,FWUpdate:true,OldVersion:OldFWVersion,NewVersion:NewFWVersion,strReleasenote:strReleasenote}
                            };
                        }
                        else
                        {
                            Obj2 = {
                                Type: funcVar.FuncType.Device,
                                Func: evtType.SendNotification,
                                Param: {Text:"You Already Have Latest Version",Device:0,FWUpdate:false,OldVersion:OldFWVersion,NewVersion:NewFWVersion,strReleasenote:strReleasenote}
                            };
                        }
                        _thisDevice_Turing.EmitAPI(Obj2);
                        resolve(NewFWVersion);
                        
                    });
         

                    //---------Releasenote_lang--------

                    
                }
            });       

        });
    }    

    DeviceApi_Turing.prototype.ReadAllReleasenote = function (Obj,callback) {
        
        var langNum = 4;
        var Data = [];

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
                callback(Data);
            }
    
        })(0);
    };
    
    DeviceApi_Turing.prototype.LaunchFWUpdate = function (Obj,callback) //RunAppUntilTerminate
    {
        var window = require('child_process');

        var AppPath;
        AppPath = env.appRoot+"\\FWUpdate\\Kemove\\FWUpdate.exe";

        // _thisDevice_Turing.RunAppUntilTerminate(AppPath);
        env.log("DeviceApi","FWUpdate-AppPath:",AppPath);
        _thisDevice_Turing.RunApplication(AppPath,function(){

            
        });
        //var win = window.exec(AppPath);
        
        //env.log("DeviceApi","FWUpdate-win:",win);
        m_bFirmwareUpdate = true;
        
        m_bOpen = false;

        //------------------------

        // const electron = require('electron');
        // const app = electron.app;
        // app.quit();

        //------------------------

        // win.on('close', function() {
            
        //     // var CallbackData = {Text:"QuitApp"}
        //     // callback(CallbackData);
        //     return;


        //     m_bFirmwareUpdate = false;
            
        //     var DeviceId_Turing = _thisDevice_Turing.hiddevice.FindDevice(0xff01,0x01,iVID_Turing, iPID_Turing);
        //     var OldFWVersion = m_NewFWVersion;
        //     if (DeviceId_Turing>0) 
        //     {
        //         var rtnData = _thisDevice_Turing.hiddevice.GetFWVersion(g_DeviceID);
        //         OldFWVersion = parseInt(rtnData.toString(16), 10);
                
        //         var Obj3 = {
        //             bPlug: DeviceId_Turing
        //         };
        //         _thisDevice_Turing.SetDeviceId(DeviceId_Turing);

        //         if (env.isWindows) {
        //             _thisDevice_Turing.DevicePlug(Obj3);
        //         }
        //         _thisDevice_Turing.GetBatteryStats();
        //     }


            
        //     if (m_NewFWVersion > OldFWVersion) 
        //     {
        //         var CallbackData = {Text:"New Version Detected!",Device:0,FWUpdate:true,OldVersion:OldFWVersion,NewVersion:m_NewFWVersion}
        //         callback(CallbackData);
        //     }
        //     else
        //     {
        //         var CallbackData = {Text:"You Already Have Latest Version",Device:0,FWUpdate:false,OldVersion:OldFWVersion,NewVersion:m_NewFWVersion}
        //         callback(CallbackData);
        //     }
        // });

    }   
    
    DeviceApi_Turing.prototype.GetFirmwareStats = function () 
    {
        return m_bFirmwareUpdate;
    }    

    DeviceApi_Turing.prototype.HIDEP2Data_Turing = function (ObjEP2Data) 
    {    
        if (ObjEP2Data[0]== 0x04 && ObjEP2Data[1]== 0xf8 && ObjEP2Data[2]== 0x20  && ObjEP2Data[3]== 0x87&& iEP2DataType == 0xf8)
        {   
            iEP2DataType = 0;  
            iDeviceType = ObjEP2Data[7];

        }
        else if (ObjEP2Data[0]== 0x04  && iEP2DataType == 0x81) //EP2 GetDeviceProfieID
        {       
            iEP2DataType = 0;   
            var iProfile = m_DeviceProfile.indexOf(ObjEP2Data[1]);
            if(iProfile == -1)
            {
                iProfile = 0;
            }
            m_iCurProfile = iProfile;

            var Obj2 = {
                Type: funcVar.FuncType.Device,
                Func: evtType.SwitchProfile,
                Param: {Profile:iProfile}
            };
            _thisDevice_Turing.EmitAPI(Obj2);
        }
    } 
    
    //DeviceApi_Turing.prototype.AppDB = false;
    
    // return DeviceApi;

exports.DeviceApi_Turing = DeviceApi_Turing;
