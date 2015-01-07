var WebSocketServer = require('ws').Server
, http = require('http')
, express = require('express')
, app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.listen(8080);

var servers = [];
var clients = [];

var wss = new WebSocketServer({server: app});
wss.on('connection', function(ws) {

    // just immediately re-broadcast any messages we get.
    ws.on('message', function(message){

        console.log(message);

        var msg = JSON.parse(message);
        if(msg.action === "register_server"){
            servers.push({"hostname": msg.payload, "connection": ws});
            console.log("registered server " + msg.payload);

            return;
        }

        if(msg.action === "register_client"){
            clients.push({"id": msg.payload, "connection": ws});
            console.log("registered client");

            return;
        }

        if(msg.action === "query" || msg.action === "fact"){
            servers.forEach(function(c){
                c.connection.send(message);
            });

            console.log("executing query");

            return;
        }

        if(msg.action === "response"){
            clients.forEach(function(c){
                c.connection.send(message);
            });

            console.log("query response");
            return;
        }

        console.log(message);
        wss.broadcast(message);
    });

    ws.on('close', function() {
        console.log('client disconnect');
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
