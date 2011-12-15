var http = require("http");
var url = require("url");

var Birbal = function (routes) {

    this.specials = {};

    this.loadSpecials = function() {
        for(var i in routes) {
            if(i === ":before") {
                this.specials["beforeFunc"] = routes[i][0];
            }
            else if(i === ":catchall") {
                this.specials["catchAllFunc"] = routes[i][0];
            }
        }
    }

	this.onRequest = function (request, response, specials) {
		var pathname = url.parse(request.url).pathname;
		   
		var matched = false; 
		for(var i in routes) {

			if(this.specials["beforeFunc"] != null) {
			    this.specials["beforeFunc"]();
			}

			if(pathname === i) {
	 
			    if(routes[i][1] === request.method) {
			        response.writeHead(200, {"Content-Type":"text/html"});
			        response.write(routes[i][0]());
		
			        matched = true;

			        response.end();
			        break;
			    }
			}
		
		}

		if(matched != true) {
	
			if(this.specials["catchAllFunc"] != null && this.specials["catchAllFunc"] != undefined) {
			    response.writeHead(200, {"Content-Type":"text/html"});
			    response.write(this.specials["catchAllFunc"]());
			    response.end();
			}
		}
    }
 
    this.start = function() {
        this.loadSpecials();
        http.createServer(this.onRequest.bind(this)).listen(8888);
    }

    this.start();
}

exports.Birbal = Birbal;