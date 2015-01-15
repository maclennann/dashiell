'use strict'
var Status = require('./message_status.js');


var generateGuid = (function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return function () {
        if (process.env.DETERMINISTIC_GUID !== undefined) {
            console.warn(util.format(messages.badGuid, process.env.DETERMINISTIC_GUID));
            return process.env.DETERMINISTIC_GUID;
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };
}());

function message(options){
    var me = message.prototype;

    me.Action = options.Action;
    me.Payload = options.Payload;
    me.Guid = generateGuid();
    me.Status = Status.NEW;
    me.Results = [];
}

message.prototype = {
    getStatus: function(){
        return {Guid: this.Guid, Status: this.Status};
    },
    setStatus: function(status){
        this.Status = status;
    },
    getQuery: function(){
        return {
            Action: this.Action,
            Payload: this.Payload,
            Guid: this.Guid
        };
    },
    addResult: function(result){
        result.Payload = JSON.parse(result.Payload);
        this.Results.push(result);
    },
    getResults: function(){
        return this.Results;
    }
}

module.exports = message;
