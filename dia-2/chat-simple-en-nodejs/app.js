var express = require('express'),
	cons    = require('consolidate'),
    faye    = require('faye');    

var server = express();
var fayeServer = new faye.NodeAdapter({mount: '/faye'});

//Static files
server.use(express.static('./public'));

//View Engine
server.engine('html', cons.jqtpl);
server.set('view engine', 'html');
server.set('views', './views');

server.get('/', function(req, res){
	res.send('home');
});

server.get('/chat/:channel', function(req, res){
	//res.send(req.params.channel);
	res.render('chat',{
		channel : req.params.channel,
		chatTemplate : '<div class="view"><b>${user}</b>:<label>${message}</label></div>'
	});
});

//log messages
var logger = {
	incoming: function(message, callback) {
		if(message.channel === '/messages'){
			console.log('got message', message.data);
		}

		callback(message);
	}
};

fayeServer.addExtension(logger);

fayeServer.listen(8001);
server.listen(8000);


console.log('Server tunning at '+ 8000);