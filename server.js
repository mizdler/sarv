var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 5060 });

var lastHumidity;

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
        lastHumidity = encodeURIComponent(request.query.humidity);
        console.log("lastHumidity = " + lastHumidity);
        //reply('Hello, ' + JSON.stringify(request.query) + '!');
    }
});

server.route({
    method: 'GET',
    path: '/getHumidity',
    config: {cors: {origin: ['*']}},
    handler: function (request, reply) {
        var random = Math.floor(Math.random() * 400)
        console.log(random);

        console.log(request.url);
        reply({ value: random });   //sould be replaced with lastHumidity
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});