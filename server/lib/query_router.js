/* query_router.js
**
** Handles application state and websocket-y goodness.
** TODO: Persist server information!
** TODO: Better error handling
** TODO: Load test
**
*/

var WebSocketServer = require('ws').Server
, Message = require('./message.js')
, _ = require('lodash')
, Status = require('./message_status.js');

function queryRouter(app){
    var me = queryRouter.prototype;

    me.wss = new WebSocketServer({server: app});

    me.wss.on('connection', function(ws) {
        ws.on('message', function(message){
            var msg = JSON.parse(message);
            if(msg.Action === "register_server"){
                me.addServer(msg.Hostname, ws);
                console.log("registered server " + msg.Hostname);
                return;
            }

            if(msg.Action === "response"){
                me.queries[msg.Guid].addResult(msg);
                console.log("query response from " + msg.Hostname);
                return;
            }
        });

        ws.on('close', function() {
            me.delServer(ws);
            console.log('client disconnect');
        });
    });

    me.queries = {};
    me.servers = [];
}

queryRouter.prototype = {
    addQuery: function(query){
        query.setStatus(Status.STARTED);
        this.queries[query.Guid] = query;
        this.scheduleQuery(query.Guid);
    },
    scheduleQuery: function(guid){
        var query = this.queries[guid].getQuery();

        this.servers.forEach(function(s){
            s.connection.send(JSON.stringify(query));
        });

        var me = this;
        setTimeout(function(){me.finalizeQuery(guid);}, 2000);
    },
    finalizeQuery: function(guid){
        this.queries[guid].setStatus(Status.SUCCESS);
    },
    addServer: function(hostname, connection){
        this.servers.push({hostname: hostname, connection: connection});
    },
    delServer: function(connection){
        _.remove(this.servers, {'connection': connection});
    },
    checkQuery: function(guid){
        var query = this.queries[guid];
        if(query !== undefined) {
            if(query.getStatus().Status === Status.SUCCESS){
                return query.getResults();
            }
            else{
                return query.getStatus();
            }
        }
    }
}


module.exports = queryRouter;
