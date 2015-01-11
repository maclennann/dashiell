var WebSocketServer = require('ws').Server
, http = require('http')
, express = require('express')
, app = express.createServer()
, bodyParser = require('body-parser')
, Message = require('./lib/message.js')
, _ = require('lodash')
, Status = require('./lib/message_status.js')
, QueryRouter = require ('./lib/query_router.js');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
var qr = new QueryRouter(app);

app.get('/servers', function(req,res){
    res.send(JSON.stringify(servers.map(function(e){return e["hostname"];})));
});

app.post('/query', function(req, res) {
    var message = new Message(req.body);
    res.send(message.getStatus());

    qr.addQuery(message);
});
app.get('/query/:guid', function(req, res){
    res.send(qr.checkQuery(req.params.guid));
})

app.listen(8080);
