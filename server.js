var Path = require('path'),
    Hapi = require('hapi'),
    _ = require("underscore");

var host = 'localhost',
    port = 3000;

// Create a server with a host and port
var server = new Hapi.Server(host, port, {
  files:{
    relativeTo: Path.join(__dirname,'app')
  }
});
//new comment
// Show Admin App
server.route({
  method: 'GET',
  path: '/',
  handler: function(req,reply){
    reply.view('index');
  }
});

// Retrieve static assets
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: function(req,reply){
    var path = req.path.substr(1),
      found = false,
      allowed = [
        /^components\//,
        /^images\//,
        /^js\//,
        /^styles\//
      ];

    _.each(allowed, function(regex){
      if (path.match(regex)){
        reply.file(path);
        found = true;
        return false;
      }
    });

    if (!found){
      reply.view('index');
    }
  }
});

server.views({
  engines:{
    html: require('handlebars')
  },
  path: __dirname+'/app'
});

// Start the server
server.start(function(){
  console.log("Server running at", host,port);
});

server.on('internalError', function (request, err){
  console.log("Internal Server Error!", request.path, ":", err.toString());
});