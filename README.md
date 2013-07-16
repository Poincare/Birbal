Birbal
======

##A clever little framework for Node.js

- Provides regex- and string-based routing of requested URLs.
- Parses HTTP query-string parameters and body parameters, exposed in handler callbacks as `this.vars`.
- Allows for middleware, such as database queries or cookie parsing.
- Has a simple chainable syntax.

Setup
-----
You will want to include the Birbal module. Most likely, you will set the imported value to a convenient name, like `app` which is used throughout our examples.

```javascript
var app = require("Birbal");
```

Routing
-------
Routing is performed by use of `Birbal#get`, `Birbal#post`, etc. Usage is of the following form. 

```javascript
app.get(*path*, *handler*[, *middleware*]).post(...)
```

*handler* is a function of request, response, and any passed values of the middleware. *middleware* is a function of *handler*, request, and response. The following is an example of this all working together.

```javascript
app.get('/', function(req, res, time) {
	res.end("hi, it's "+time+".");
}, function(handler, req, res) {
	handler((new Date()).getTime());
});
```

Request Variables
-----------------
Request variables are exposed to handlers and middleware as *this.vars*. The following is an example of this at use.

```javascript
app.get(/^/, function(req, res) {
	res.end("hi, "+this.vars.name);
});
```

Running a Server
----------------

```javascript
http.createServer(app).listen(8080);
```