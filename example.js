// import http and birbal
var http = require('http'),
	app = require("./Birbal.js");

// create rules
app.get('/', function(req, res, time) {
	// string-based rule utilizing middleware
	res.end("hi, it's "+time+".");
}, function(handler, req, res) {
	// middleware fires the handler with
	// ... additional parameters
	handler((new Date()).getTime());
}).post(/^\/new/, function(req, res) {
	// request vars are parsed and 
	// ... set to `this.vars`
	res.end("welcome, "+this.vars.name);
});

http.createServer(app).listen(9000);