var http = require("http");
var url = require("url");
var jade = require("jade");

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
	        if(this.specials["beforeFunc"] != null) {
			    this.specials["beforeFunc"]();
			}

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

//still working on this, not yet complete, but, for Jade users
function render_template(path, vars, options=null) {
    fs.readFile(path, "binary", function(err, file) {
        if(err) {
            return false;
        }
        var fn = null;
    
        if(options == null) {
            var fn = jade.compile(file);
        }
        else {
            var fn = jade.compile(file, options);
        }

        return fn(locals);
    }
}

exports.Birbal = Birbal;
