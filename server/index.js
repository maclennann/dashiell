var WebSocketServer = require('ws').Server
, http = require('http')
, express = require('express')
, app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.get('/servers', function(req,res){
    res.send(JSON.stringify(servers.map(function(e){return e["hostname"];})));
});

app.listen(8080);

var servers = [];
var clients = [];

var wss = new WebSocketServer({server: app});
wss.on('connection', function(ws) {

    // just immediately re-broadcast any messages we get.
    ws.on('message', function(message){

        console.log(message);

        var msg = JSON.parse(message);
        if(msg.Action === "register_server"){
            servers.push({"hostname": msg.Payload, "connection": ws});
            console.log("registered server " + msg.Payload);

            return;
        }

        if(msg.Action === "register_client"){
            clients.push({"id": msg.Payload, "connection": ws});
            console.log("registered client");

            return;
        }

        if(msg.Action === "query" || msg.Action === "fact"){
            servers.forEach(function(c){
                c.connection.send(message);
            });

            console.log("executing query");

            return;
        }

        if(msg.Action === "response"){
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
