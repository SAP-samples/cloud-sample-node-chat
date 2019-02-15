var express = require('express'),

app = express();

var port = process.env.PORT || 8089;

var io = require('socket.io').listen(app.listen(port));

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

require('./routes')(app, io);

console.log('Your application is running on http://localhost:' + port);