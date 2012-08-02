var http = require('http'),
    faye = require('faye');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('Hello, non-Bayeux request');
	response.end();
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

bayeux.addExtension(logger);


bayeux.attach(server);
server.listen(8000);