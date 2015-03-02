var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 5060 });

var lastHumidity;
var led = 0;

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
    path: '/{path*}',
    handler: {
        directory: { path: './public', listing: false, index: true }
    }
});

server.route({
    method: 'GET',
    path: '/updateHumidity',
    handler: function (request, reply) {
        console.log(request.url);
        lastHumidity = encodeURIComponent(request.query.humidity);
        console.log("lastHumidity = " + lastHumidity);
        reply('<iot>GOOD</iot>');
    }
});

server.route({
    method: 'GET',
    path: '/getHumidity',
    config: {cors: {origin: ['*']}},
    handler: function (request, reply) {
        console.log(request.url);
        reply({ value: lastHumidity });   //sould be replaced with lastHumidity
    }
});

server.route({
    method: 'GET',
    path: '/updateLED',
    handler: function (request, reply) {
        console.log(request.url);
        led = encodeURIComponent(request.query.led);
        console.log("led = " + led);
        
        reply('<iot>GOOD</iot>');
    }
});

server.route({
    method: 'GET',
    path: '/getLED',
    config: {cors: {origin: ['*']}},
    handler: function (request, reply) {
        console.log(request.url);
        reply('<iot>' + led + '</iot>');   //sould be replaced with lastHumidity
    }
});

server.route({
    method: 'GET',
    path: '/demo/{param*}',
    handler: {
        directory: {
            path: 'demo'
        }
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});