var WebSocketServer = require('ws').Server
, http = require('http')
, express = require('express')
, app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.listen(8080);

var wss = new WebSocketServer({server: app});
wss.on('connection', function(ws) {

    // just immediately re-broadcast any messages we get.
    ws.on('message', function(message){
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
