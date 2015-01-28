var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 80 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
    	console.log(request.url);
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/update',
    handler: function (request, reply) {
    	console.log(request.url);
        reply('Hello, ' + JSON.stringify(request.query) + '!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});