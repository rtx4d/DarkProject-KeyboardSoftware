var db = require('./DB'); 
var env = require('../others/env');
var ProfileDB = (function (){
    var _this; 
    function ProfileDB() {
      	_this = this;
        _this.DB =new db.DB(); 
    }

    ProfileDB.prototype.getProfile = function(filename,obj){
        return new Promise(function (resolve, reject) {
            return  _this.DB.queryCmd(filename,obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.getAllProfile = function(filename){
        return new Promise(function (resolve, reject) {
            return  _this.DB.queryCmd(filename,{},function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.AddProfile = function(filename,obj){
        return new Promise(function (resolve, reject) {
            return  _this.DB.insertCmd(filename,obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.UpdateProfile = function(filename,id, obj){
        return new Promise(function (resolve, reject) {
            var data={id:id}
            return  _this.DB.updateCmd(filename,data,obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.DeleteProfile = function(filename,id){
        return new Promise(function (resolve, reject) {
            var obj = {id:parseInt(id)};
            return  _this.DB.deleteCmd(filename,obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.DB = undefined;  
  
    return ProfileDB;  

})()

exports.ProfileDB = ProfileDB;