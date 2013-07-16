module.exports = (function() {
	// give functions a compose method
	Function.prototype.compose  = function(argFunction) {
		var invokingFunction = this;
			return function() {
				return  invokingFunction.call(this,argFunction.apply(this,arguments));
			};
	};

	// create rule arrays for each of the methods.
	var rules = {};
	var methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
	methods.forEach(function(method) {
		rules[method] = [];
	});		
		
	// parse query string and HTTP body variables	
	var parseVars = function(str) {
		var vars = {};
		if( str.indexOf('=') == -1 ) {
			return {};
		}
		str.split('&').forEach(function(eq) {
			var pair = eq.split('=');
			vars[pair[0]] = pair[1];
		});
		return vars;
	};
		
	// define a route handler that finds a matching rule
	// ... and fires its callback.	
	var Birbal = function(req, res) {
		var match = (rules[req.method]||[]).filter(function(rule) { 
			return rule.path.test ? rule.path.test(req.url) : rule.path == req.url;
		});
		var rule = match.length ? match.pop() : {cb:_404};
		var request = { buffer: [], vars: {} };
		var handler = rule.middleware ? rule.middleware.bind(request, rule.cb.bind(request, req, res)) : rule.cb.bind(request);
		if( req.method == "GET" ) {
			request.vars = req.url.split('?').length > 1 ? parseVars(req.url.split('?')[1]) : {};
			handler(req, res);
		} else {
			req.on("data", function(chunk) {
				request.buffer.push(chunk);
			});
			req.on("end", function() {
				request.vars = parseVars(request.buffer.join(''));
				handler(req, res);
			});
		}
	};	
	// a function wrapper to allow for the chaining of methods.
	var _chainable = function(action) {
		return function(){
			action.apply({}, arguments); 
			return Birbal;
		}; 
	};			
	// zip the contents of two arrays into pairs (a onto b)
	var zip = function(a/*, b = rest */) {
		var b = [].slice.call(arguments, 1);
		return b.map(function(b,index){
			return [a[index],b]
		})
	};
	// form a dictionary from a list of key-value pairs.
	var formDict = function(arr){
		var o={};
		arr.forEach(function(x){
			o[x[0]]=x[1];
		});
		return o;
	};
	
	// expose a method for rule addition to each HTTP method.
	methods.forEach(function(method) {
		Birbal[method.toLowerCase()] = _chainable(
			[].push.bind(rules[method]).compose(
				formDict.compose(
					zip.bind({}, ["path","cb","middleware"])
				)
			)
		);
	});
	
	// maintain a function for the handling of 404 errors.
	var _404 = function(req, res) { res.writeHead(404); res.end(); };	
	Birbal.e404 = _chainable(function(cb) { _404 = cb; });
	
	return Birbal;
})();