/* index.js
**
** Sets up the express server that the websockets piggy-back on
** as well as the API (used by web ui).
**
** TODO: Shore up the API (break it out, and robustify it).
**
*/

var express = require('express')
, http = require('http')
, bodyParser = require('body-parser')
, Message = require('./lib/message.js')
, QueryRouter = require ('./lib/query_router.js')
, app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

var server = http.createServer(app);
var qr = new QueryRouter(server);

server.listen(8080);
