var db = require('./DB'); 
var env = require('../others/env');
var AppSettingDB = (function (){
    var _this; 
    function AppSettingDB() {
      	_this = this;
        _this.DB =new db.DB(); 
    }

    AppSettingDB.prototype.getAppSetting = function(){
        return new Promise(function (resolve, reject) {
            return  _this.DB.queryCmd('AppSettingDB',{},function(docs){  
                resolve(docs);     
            });  
        });
    };

    AppSettingDB.prototype.saveAppSetting = function(obj){
        return new Promise(function (resolve, reject) {
            return  _this.DB.updateCmd('AppSettingDB',{"_id":"5Cyd2Zj4bnesrIGK"},obj,function(docs){  
                resolve(docs);     
            });  
        });
    };



    AppSettingDB.prototype.DB = undefined;  
  
    return AppSettingDB;  

})()

exports.AppSettingDB = AppSettingDB;