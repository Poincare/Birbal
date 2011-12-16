var serv = require("./Birbal.js");

//called for "/" and "/else" for GET requests
function hello() {
    return "Wazzup!";
}

//called for "/misc" GET requests
function misc() {
    return "<h1>Misc</h1>";
}

//called before ever single request
function before() {
    console.log("Hey! A request came in!");
}

//called when no other request matches
function oops() {
    console.log("Type in the URL again!");
    return "Oops!";
}

var routes = {
    ":before":[before],
    "/":[hello, "GET"],
    "/else":[hello, "GET"],
    "/misc":[misc, "GET"],
    ":catchall":[oops, "GET"]
};

serv.Birbal(routes);
