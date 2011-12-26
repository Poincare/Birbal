var akbar = require("./Birbal.js");

//called for "/" and "/else" for GET requests
function hello() {
    return "Wazzup!";
}

//called for "/misc" GET requests
function misc() {
    return "<h1>Misc</h1>";
}

//called before ever single request
function before(pathname, method) {
    console.log("Request on " + pathname + " with method " + method);
}

//called when no other request matches
function oops() {
    return "Oops!";
}

//routes, uses some specials, like :before, which is called before every req.
var routes = {
    ":before":[before],
    "/":[hello, "GET"],
    "/else":[hello, "GET"],
    "/misc":[misc, "GET"],
    ":catchall":[oops, "GET"]
};

PORT = 8888;

akbar.Birbal(PORT, routes);
