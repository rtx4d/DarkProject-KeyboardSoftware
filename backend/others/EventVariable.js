'use strict';

var eventTypes = {
	//发生错误
	Error : 'Error',
    //读写USB时出错
    USBError: 'USBError',
    //分位不支持
    FirmwareNotSupport: 'FwNotSupport',
    //切换DPI
    DPIChanged: 'DPIChanged',
    //程序切换
    AppChanged: 'AppChanged',
    //Windows Session切换
    SessionChanged: 'SessionChanged',
    //设备拔插
    HotPlug : 'HotPlug',
    //SmartProtocol通过此事件通知
    ProtocolMessage : 'ProtocolMessage',
    //下載進度
    DownloadProgress: 'DownloadProgress',
    //通知前端有更新檔可以安裝
    UpdateApp : 'UpdateApp',
    UpdateFW : 'UpdateFW',
    ChangeWindowSize: 'ChangeWindowSize',
    ShowWindow : "ShowWindow",
    HIDEP2Data:'HIDEP2Data',
    KeyDataCallback : 'KeyDataCallback',
    QuitApp:"QuitApp",
    //electron通知前端App要關閉
    ExitApp:"ExitApp",
	//刷新设备列表
    RefreshDevice : 'RefreshDevice',
	//回傳Profile值
    GetProfileData : 'GetProfileData',
	//回傳Macro值
    GetMacroData : 'GetMacroData',
	//回傳燈光值
    GetSpectrumData : 'GetSpectrumData',
	//回傳EP2的按鍵號
    SendEP2KeyNum : 'SendEP2KeyNum',
	//切換特效
    SwitchEffect : 'SwitchEffect',
	//切換Profile值
    SwitchProfile : 'SwitchProfile',

    ImportProfile : 'ImportProfile',
    SwitchDevice : 'SwitchDevice',

	//回傳前端字串
    SendNotification : 'SendNotification',

    OpenApplication:"OpenApplication",
    Facebooklogin:"Facebooklogin",
    Googlelogin:"Googlelogin",
    Twitchlogin:"Twitchlogin",

	//回傳裝置每個按鍵的RGB值
    SendSyncLED:"SendSyncLED",
    SendCustomLED:"SendCustomLED",
    SendBatteryStats:"SendBatteryStats"
    
};

exports.EventTypes = eventTypes;