var serv = require("./Birbal.js");

function hello() {
    return "Wazzup!";
}

function misc() {
    return "<h1>Misc</h1>";
}

function before() {
    console.log("Hey! A request came in!");
}

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
