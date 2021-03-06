
var customEventCode = [
    { "event_code": "MouseLeft", "event_keycode": 9999,"sharedtext":"MouseLeft" },
    { "event_code": "MouseMiddle", "event_keycode": 9998,"sharedtext":"MouseMiddle" },
    { "event_code": "MouseRight", "event_keycode": 9997 ,"sharedtext":"MouseRight" },
    { "event_code": "Ctrl", "event_keycode": 17 ,"sharedtext":"LCtrl" },
    { "event_code": "Ctrl", "event_keycode": 17 ,"sharedtext":"RCtrl" },
    { "event_code": "Shift", "event_keycode": 16 ,"sharedtext":"LShift" },
    { "event_code": "Shift", "event_keycode": 16 ,"sharedtext":"RShift" },
    { "event_code": "Alt", "event_keycode": 18 ,"sharedtext":"LAlt" },
    { "event_code": "Alt", "event_keycode": 18 ,"sharedtext":"RAlt" },
    { "event_code": "Win", "event_keycode": 92 ,"sharedtext":"RWin" },
    { "event_code": "Win", "event_keycode": 91 ,"sharedtext":"LWin" },
    { "event_code": "Space", "event_keycode": 32 ,"sharedtext":"Space" },
    { "event_code": "ContextMenu", "event_keycode": 93 ,"sharedtext":"Menu" },
    { "event_code": "ArrowUp", "event_keycode": 38 ,"sharedtext":"ArrowUp" },
    { "event_code": "ArrowLeft", "event_keycode": 37 ,"sharedtext":"ArrowLeft" },
    { "event_code": "ArrowDown", "event_keycode": 40 ,"sharedtext":"ArrowDown" },
    { "event_code": "ArrowRight", "event_keycode": 39 ,"sharedtext":"ArrowRight" },
    { "event_code": ".", "event_keycode": 110 ,"sharedtext":"NumpadDecimal" },
    { "event_code": ",", "event_keycode": 188 ,"sharedtext":"Comma" },
    { "event_code": ".", "event_keycode": 190 ,"sharedtext":"Period" },
    { "event_code": "/", "event_keycode": 191 ,"sharedtext":"Slash" },


    { "event_code": "Z", "event_keycode": 90 ,"sharedtext":"Z" },
    { "event_code": "X", "event_keycode": 88 ,"sharedtext":"X" },
    { "event_code": "C", "event_keycode": 67 ,"sharedtext":"C" },
    { "event_code": "V", "event_keycode": 86 ,"sharedtext":"V" },
    { "event_code": "B", "event_keycode": 66 ,"sharedtext":"B" },
    { "event_code": "N", "event_keycode": 78 ,"sharedtext":"N" },
    { "event_code": "M", "event_keycode": 77 ,"sharedtext":"M" },
    { "event_code": "NumpadEnter", "event_keycode": 13 ,"sharedtext":"NumpadEnter" },
    { "event_code": "Numpad0", "event_keycode": 96 ,"sharedtext":"Numpad0" },
    { "event_code": "Numpad1", "event_keycode": 97 ,"sharedtext":"Numpad1" },
    { "event_code": "Numpad2", "event_keycode": 98 ,"sharedtext":"Numpad2" },
    { "event_code": "Numpad3", "event_keycode": 99 ,"sharedtext":"Numpad3" },
    { "event_code": "Numpad4", "event_keycode": 100 ,"sharedtext":"Numpad4" },
    { "event_code": "Numpad5", "event_keycode": 101 ,"sharedtext":"Numpad5" },
    { "event_code": "Numpad6", "event_keycode": 102 ,"sharedtext":"Numpad6" },
    { "event_code": "Numpad7", "event_keycode": 103 ,"sharedtext":"Numpad7" },
    { "event_code": "Numpad8", "event_keycode": 104 ,"sharedtext":"Numpad8" },
    { "event_code": "Numpad9", "event_keycode": 105 ,"sharedtext":"Numpad9" },
    { "event_code": "NumLock", "event_keycode": 144 ,"sharedtext":"NumLock" },
    { "event_code": "Numpad/", "event_keycode": 111 ,"sharedtext":"Numpad/" },
    { "event_code": "Numpad*", "event_keycode": 106 ,"sharedtext":"Numpad*" },
    { "event_code": "Numpad-", "event_keycode": 109 ,"sharedtext":"Numpad-" },
    { "event_code": "Numpad+", "event_keycode": 107 ,"sharedtext":"Numpad+" },
    { "event_code": "AudioVolumeMute", "event_keycode": 173 ,"sharedtext":"" },
    { "event_code": "AudioVolumeDown", "event_keycode": 174 ,"sharedtext":"" },
    { "event_code": "AudioVolumeUp", "event_keycode": 175 ,"sharedtext":"" },
    { "event_code": "ScrollLock", "event_keycode": 145 ,"sharedtext":"ScrollLock" },
    { "event_code": "Pause", "event_keycode": 19 ,"sharedtext":"Pause" },
    { "event_code": "Insert", "event_keycode": 45 ,"sharedtext":"Insert" },
    { "event_code": "Home", "event_keycode": 36 ,"sharedtext":"Home" },
    { "event_code": "PageUp", "event_keycode": 33 ,"sharedtext":"PageUp" },
    { "event_code": "Delete", "event_keycode": 46 ,"sharedtext":"Delete" },
    { "event_code": "End", "event_keycode": 35 ,"sharedtext":"End" },
    { "event_code": "PageDown", "event_keycode": 34 ,"sharedtext":"PageDown" },
    { "event_code": "CapsLock", "event_keycode": 20 ,"sharedtext":"CapsLock" },
    { "event_code": "A", "event_keycode": 65 ,"sharedtext":"A" },
    { "event_code": "S", "event_keycode": 83 ,"sharedtext":"S" },
    { "event_code": "D", "event_keycode": 68 ,"sharedtext":"D" },
    { "event_code": "F", "event_keycode": 70 ,"sharedtext":"F" },
    { "event_code": "G", "event_keycode": 71 ,"sharedtext":"G" },
    { "event_code": "H", "event_keycode": 72 ,"sharedtext":"H" },
    { "event_code": "J", "event_keycode": 74 ,"sharedtext":"J" },
    { "event_code": "K", "event_keycode": 75 ,"sharedtext":"K" },
    { "event_code": "L", "event_keycode": 76 ,"sharedtext":"L" },
    { "event_code": ";", "event_keycode": 186 ,"sharedtext":";" },
    { "event_code": "' ", "event_keycode": 222 ,"sharedtext":"Quotation" },
    { "event_code": "Enter", "event_keycode": 13 ,"sharedtext":"Enter" },
    { "event_code": "Tab", "event_keycode": 9 ,"sharedtext":"Tab" },
    { "event_code": "Q", "event_keycode": 81 ,"sharedtext":"Q" },
    { "event_code": "W", "event_keycode": 87 ,"sharedtext":"W" },
    { "event_code": "E", "event_keycode": 69 ,"sharedtext":"E" },
    { "event_code": "R", "event_keycode": 82 ,"sharedtext":"R" },
    { "event_code": "T", "event_keycode": 84 ,"sharedtext":"T" },
    { "event_code": "Y", "event_keycode": 89 ,"sharedtext":"Y" },
    { "event_code": "U", "event_keycode": 85 ,"sharedtext":"U" },
    { "event_code": "I", "event_keycode": 73 ,"sharedtext":"I" },
    { "event_code": "O", "event_keycode": 79 ,"sharedtext":"O" },
    { "event_code": "P", "event_keycode": 80 ,"sharedtext":"P" },
    { "event_code": "[", "event_keycode": 219 ,"sharedtext":"[" },
    { "event_code": "]", "event_keycode": 221 ,"sharedtext":"]" },
    { "event_code": "\\", "event_keycode": 220 ,"sharedtext":"k29" },
    { "event_code": "`", "event_keycode": 192 ,"sharedtext":"`" },
    { "event_code": "1", "event_keycode": 49 ,"sharedtext":"1" },
    { "event_code": "2", "event_keycode": 50 ,"sharedtext":"2" },
    { "event_code": "3", "event_keycode": 51 ,"sharedtext":"3" },
    { "event_code": "4", "event_keycode": 52 ,"sharedtext":"4" },
    { "event_code": "5", "event_keycode": 53 ,"sharedtext":"5" },
    { "event_code": "6", "event_keycode": 54 ,"sharedtext":"6" },
    { "event_code": "7", "event_keycode": 55 ,"sharedtext":"7" },
    { "event_code": "8", "event_keycode": 56 ,"sharedtext":"8" },
    { "event_code": "9", "event_keycode": 57 ,"sharedtext":"9" },
    { "event_code": "0", "event_keycode": 48 ,"sharedtext":"0" },
    { "event_code": "-", "event_keycode": 189 ,"sharedtext":"-" },
    { "event_code": "=",    "event_keycode": 187 ,"sharedtext":"=" },
    { "event_code": "Backspace", "event_keycode": 8 ,"sharedtext":"Backspace" },
    { "event_code": "Escape", "event_keycode": 27 ,"sharedtext":"ESC" },
    { "event_code": "F1", "event_keycode": 112 ,"sharedtext": "F1"  },
    { "event_code": "F2", "event_keycode": 113 ,"sharedtext": "F2"  },
    { "event_code": "F3", "event_keycode": 114 ,"sharedtext": "F3"  },
    { "event_code": "F4", "event_keycode": 115 ,"sharedtext": "F4"  },
    { "event_code": "F5", "event_keycode": 116 ,"sharedtext": "F5"  },
    { "event_code": "F6", "event_keycode": 117 ,"sharedtext": "F6"  },
    { "event_code": "F7", "event_keycode": 118 ,"sharedtext": "F7"  },
    { "event_code": "F8", "event_keycode": 119 ,"sharedtext": "F8"  },
    { "event_code": "F9", "event_keycode": 120 ,"sharedtext": "F9"  },
    { "event_code": "F10", "event_keycode": 121 ,"sharedtext":"F10" },
    { "event_code": "F11", "event_keycode": 122 ,"sharedtext":"F11" },
    { "event_code": "F12", "event_keycode": 123 ,"sharedtext":"F12" }]



    exports.customEventCode = customEventCode;
