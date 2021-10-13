'use strict';

var FuncName = {
	//设备初始化
    InitDevice : "InitDevice",
    
    //設定Macro
    SetMacroKey:"SetMacroKey",
    //GetKeyMatrix
    GetKeyMatrix:"GetKeyMatrix",
    //SetKeyMatrix
    SetKeyMatrix:"SetKeyMatrix",
    //APMode
    APMode:"APMode",
    //SetProfie
    SetProfie:"SetProfie",
    //GetProfileInfo
    GetProfileInfo:"GetProfileInfo",
    //確認AppVersion & download
    UpdateApp:"UpdateApp",
    //upzip AppUpdate File
    DownloadInstallPackage : "DownloadInstallPackage",
    UpdateFW : "UpdateFW",
    DownloadFWInstallPackage : "DownloadFWInstallPackage",
    ChangeWindowSize : "ChangeWindowSize",
    ShowWindow : "ShowWindow",
    RunApplication : "RunApplication" ,
    LightBarMode :"LightBarMode",
    GetDefaultKeyMatrix:"GetDefaultKeyMatrix",
    GetDeviceProfieID:"GetDeviceProfieID",
    SendKey:"SendKey",
    ExportProfile:"ExportProfile",
    ImportProfile:"ImportProfile",
    ReadLangReleasenote:"ReadLangReleasenote",
    ReadAllReleasenote:"ReadAllReleasenote",
    
    QuitApp:"QuitApp",
    
    //Feature Device
    SetProfile:"SetProfile",
    SetLEDEffect:"SetLEDEffect",
    SetProfileDB:"SetProfileDB",
    ReadProfileDB:"ReadProfileDB",
    
    SetMacroDB:"SetMacroDB",
    ReadMacroDB:"ReadMacroDB",
    
    SetAllDB : 'SetAllDB',
    ReadAllDB : 'ReadAllDB',
    SetLEDMatrix:"SetLEDMatrix",
    SwitchAPMode:"SwitchAPMode",
    SetGameModeOptions:"SetGameModeOptions",

    ReadAllDeviceDB : 'ReadAllDeviceDB',
    //回傳硬體Profile值
    GetFirmwareProfile : 'GetFirmwareProfile',
    SetOptionDB:"SetOptionDB",
    ReadOptionDB:"ReadOptionDB",
    
    Initialize : 'Initialize',
    GetGameMode : 'GetGameMode',

    //---------SyncEffect-----------------
    SetAudioCapture:"SetAudioCapture",
    StopDeviceTimer:"StopDeviceTimer",

    SetLaunchProgram:"SetLaunchProgram",
    
    SwitchLEDEffect:"SwitchLEDEffect",

    SwitchSyncLEDPreview:"SwitchSyncLEDPreview",
    SetSyncLEDData:"SetSyncLEDData",
    //---------CustomEffect-----------------
    SetCustomLEDProfile:"SetCustomLEDProfile",
    SetLEDPreview:"SetLEDPreview",
    
    SetSyncProgram:"SetSyncProgram",
    SendBatteryStats:"SendBatteryStats",
    LaunchFWUpdate:"LaunchFWUpdate",
    
    //---------CustomEffect-----------------
    SetDeviceBtnAxis:"SetDeviceBtnAxis",

    SetSyncEffectDB:"SetSyncEffectDB",
    ReadSyncEffectDB:"ReadSyncEffectDB",
    Facebooklogin:"Facebooklogin",
    Googlelogin:"Googlelogin",
    Twitchlogin:"Twitchlogin"
};

var FuncType = {
    System : 0x01,
    Mouse : 0x02,
    Keyboard :0x03,
    Device : 0x04
};
var FuncKeyCode = [
    'K12', '', '', '','K153', 'K170', 'K168', 'K155', 'K138', 'K156', 'K157', 'K158', 'K143', 'K159', 'K160', 'K161',
    'K172', 'K171','K144', 'K145', 'K136', 'K139', 'K154', 'K140', 'K142', 'K169', 'K137', 'K167', 'K141', 'K166', 'K119', 'K120',
    'K121', 'K122', 'K123', 'K124', 'K125', 'K126', 'K127', 'K128','K164', 'K11', 'K131', 'K135', 'K181', 'K129', 'K130', 'K146', 
    'K147', 'K148', 'k42', 'K162', 'K163', 'K118', 'K173', 'K174', 'K175', 'K152', 'K13', 'K14', 'K15', 'K16', 'K17', 'K18',
    'K19', 'K110', 'K111', 'K112', 'K113', 'K114', 'K115'/*print*/,'K116'/*scroll*/, 'K117'/*pause*/ , 'K132', 'K133', 'K134', 'K149', 'K150', 'K151', 'K188'/*right*/ , 
    'K186'/*left*/, 'K187'/*down*/, 'K177'/*up*/, 'K21', 'K22', 'K23', 'K24', 'K28', 'K217', 'K211', 'K212', 'K213', 'K29', 'K218', 'K210', 'K25', 
    'K26', 'K27', 'K215','K216', '\\', 'K184', 'keyboard power', 'keypad =', 'f13', 'f14', 'f15','f16', 'f17', 'f18', 'f19', 'f20',
    'f21', 'f22', 'f23', 'f24', '', '', '', '', '', '', '', '', '', '', '', '', 
    '', '', '', '', '', 'keypad', '', 'k14', 'k133', 'k56', 'k132', 'k131', '', '', '', '',


    'keyboard lang 1','', '', '', '', '', '', '', '', '', '', '', '', '', '', '',//0x90~0x9F
    '','', '', '', '', 'K33', 'K34', 'K32', 'K35', 'K38', 'K37', 'K36', 'K189', 'K71', 'K72', 'K73',//0xa0~0xaF
    'K74','', '', '', '', 'KRset11', '', '', '', '', '', 'K41', 'K42', 'K43', 'K44', 'K45',//0xb0~0xbF
    'K46','K47', 'K31', 'K49', 'K48', '', '', '', '', '', '', '', '', '', 'K50', 'K51',//0xc0~0xcF
    'K52','', '', 'K53', 'K54', '', 
    'KRset2', 'KRset1', '', 'KRset4', '', '', '', '', 'KRset5', 'KRset6',//0xd0~0xdF
    'K178','K165', 'K180', 'K179', 'K185', 'K176', 'K182', 'K183', '', '', '', '', '', '', '', '',//0xe0~0xeF
    
    '','', '', 'KRset10', 'KRset7', 'KRset8', 'KRset9', '', 'KRset3', '', '', 'KRset12', '', '', '', ''//0xF0~0xFF
    
];
//K71~K74:Hardware Profile
var FuncMacroKeyCode = [
    '⊘', '', '', '','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N','O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2',
    '3', '4', '5', '6', '7', '8', '9', '0','Enter', 'ESC', 'Backspace', 'Tab', 'Space', '-', '=', '[', 
    ']', 'k29', 'k42', ';', 'Quotation', '`', 'Comma', 'Period', 'Slash', 'CapsLock', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6',
    'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PS'/*print*/,'ScrollLock'/*scroll*/, 'Pause'/*pause*/ , 'Insert', 'Home', 'PageUp', 'Delete', 'End', 'PageDown', 'ArrowRight'/*right*/ , 
    'ArrowLeft'/*left*/, 'ArrowDown'/*down*/, 'ArrowUp'/*up*/, 'NumLock', 'Numpad/', 'Numpad*', 'Numpad-', 'Numpad+', 'NumpadEnter', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 
    'Numpad8', 'Numpad9', 'Numpad0','NumpadDecimal', 'k64', 'Menu', 'keyboard power', 'keypad =', 'f13', 'f14', 'f15','f16', 'f17', 'f18', 'f19', 'f20',
    'f21', 'f22', 'f23', 'f24', '', '', '', '', '', '', '', '', '', '', '', '', 
    '', '', '', '', '', 'keypad', '', 'k14', 'k133', 'k56', 'k132', 'k131', '', '', '', '',


    'keyboard lang 1','', '', '', '', '', '', '', '', '', '', '', '', '', '', '',//0x90~0x9F
    '','', '', '', '', '停止', '上一曲', '播放/暫停', '下一曲', '靜音', '音量加', '音量減', 'fn', '', '', '',//0xa0~0xaF
    '','', '', '', '', '', '', 'MouseLeft', 'MouseRight', 'MouseMiddle', '', '', 'ScrollDown', 'ScrollUp', '', '',//0xb0~0xbF
    '','', '', '', '', '', '', '', '', '', '', '', '', '', '單擊左鍵', '單擊右鍵',//0xc0~0xcF
    '單擊滾輪','', '', '後退', '前進', '', 
    'M1_Scrollleft', 'M1_Scrollright', 'M2_Scrollleft', 'M2_Scrollright', '', '', '', '', '', '',//0xd0~0xdF
    'LCtrl','LShift', 'LAlt', 'LWin', 'RCtrl', 'RShift', 'RAlt', 'RWin', '', '', '', '', '', '', '', ''//0xe0~0xeF
];

var Func_SpecialKey =[

    "FUNC_LeftClick",
    "FUNC_RightClick",
    "FUNC_ScorllClick",
    "FUNC_DoubleClick",
    "FUNC_ScrollUp",
    "FUNC_ScrollDown",
    "FUNC_Tiltleft",
    "FUNC_Tiltright",
    "FUNC_VolumeDown",
    "FUNC_Volumeup",
    "FUNC_MuteVolume",
    "FUNC_MicUp",
    "FUNC_MicDown",
    "FUNC_MuteMic",
    "FUNC_MuteAll",
    "FUNC_Calculator",
    "FUNC_Mspaint",
    "FUNC_Notepad",
    "FUNC_SnippingTool",
    "FUNC_TaskManager",
    "FUNC_UserDict",
    "FUNC_DeskTop",
    "FUNC_Profile1",
    "FUNC_Profile2",
    "FUNC_Profile3",
    "FUNC_Profile4",
    "FUNC_Profile5",
    "FUNC_ProfileCycle"
];

exports.FuncName = FuncName;
exports.FuncType = FuncType;
exports.FuncKeyCode = FuncKeyCode;
exports.FuncMacroKeyCode = FuncMacroKeyCode;
exports.Func_SpecialKey = Func_SpecialKey;

//exports.Func_SpecialKey_Code = Func_SpecialKey_Code;