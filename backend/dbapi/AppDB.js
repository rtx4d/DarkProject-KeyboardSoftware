
var env = require('../others/env');
var DeviceObj = require('./DeviceDB'); 
var ProfileObj = require('./ProfileDB'); 
var AppSettingObj = require('./AppSettingDB');

var AppDB = (function (){
  var _this; 
  function AppDB() {
      	_this = this;
        _this.DeviceDB = new DeviceObj.DeviceDB();
        _this.ProfileDB = new ProfileObj.ProfileDB();
        _this.AppSettingDB = new AppSettingObj.AppSettingDB();
   }   

   AppDB.prototype.getAppSetting = function(){
        return new Promise(function (resolve, reject) {
            return _this.AppSettingDB.getAppSetting().then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.saveAppSetting = function(obj){
        return new Promise(function (resolve, reject) {
            return _this.AppSettingDB.saveAppSetting(obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.getDevice = function(callback){
        _this.DeviceDB.getDevice(function(data){
            callback(data)
        });
    }; 

    AppDB.prototype.insertDevice = function(callback){
        _this.DeviceDB.insertDevice(function(data){
            callback(data)
        });
    }; 

    AppDB.prototype.getDevice2 = function(){
        return new Promise(function (resolve, reject) {
            return _this.DeviceDB.getDevice2().then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.updateDevice = function(_id, obj){
        return new Promise(function (resolve, reject) {
            return _this.DeviceDB.updateDevice(_id, obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.getProfile = function(filename,obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.getProfile(filename,obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.getAllProfile = function(filename){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.getAllProfile(filename).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.AddProfile = function(filename,obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.AddProfile(filename,obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.UpdateProfile = function(filename,id, obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.UpdateProfile(filename,id, obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.DeleteProfile = function(filename,id){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.DeleteProfile(filename,id).then(function(data){
                resolve(data);
            });
        });
    }; 


    AppDB.prototype.DeviceDB = undefined;
    AppDB.prototype.ProfileDB = undefined;

    return AppDB;  

})()

exports.AppDB = AppDB;