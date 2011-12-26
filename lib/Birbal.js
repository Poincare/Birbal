var http = require("http");
var url = require("url");
var qs = require("querystring");

var Birbal = function (port, routes) {

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

    this.requestVars = function(request) {
        var request_vars;

        if(request.method == 'POST') {
            var body = ''
            request.on('data', function(data) {
                body += data;
            });
    
            request.on('end', function() {
                request_vars = qs.parse(body);
            });
        }

        else if(request.method == 'GET') {
            var url_parts = url.parse(request.url, true);
            var query = url_parts.query;
            
            request_vars = query;   
        }

        return request_vars;
    };

    this.callBeforeSpecial = function(pathname, method) {
        if(this.specials["beforeFunc"] != null) {
            this.specials["beforeFunc"](pathname, method);
        }
    };

    this.callCatchAllSpecial = function(response, request_vars) {
       response.writeHead(200, {"Content-Type":"text/html"});
	   response.write(this.specials["catchAllFunc"](request_vars));
	   response.end();
    };

	this.onRequest = function (request, response, specials) {
		var pathname = url.parse(request.url).pathname;

        var request_vars = this.requestVars(request);
		   
		var matched = false; 
		for(var i in routes) {

			if(pathname === i) {
	 
			    if(routes[i][1] === request.method) {
                    //since a route matched, we call the :before special if its registered
                    this.callBeforeSpecial(pathname, request.method);

			        response.writeHead(200, {"Content-Type":"text/html"});
			        response.write(routes[i][0](request_vars));
		
			        matched = true;

			        response.end();
			        break;
			    }
			}
		
		}

		if(matched != true) {

            //none of the requests matched, call :catchall if registered
			if(this.specials["catchAllFunc"] != null && this.specials["catchAllFunc"] != undefined) {
                this.callCatchAllSpecial(response, request_vars);
            }
		}
    }
 
    this.start = function() {
        this.loadSpecials();
        http.createServer(this.onRequest.bind(this)).listen(port);
    }

    this.start();
}


exports.Birbal = Birbal;
