#Birbal

A clever little framework for Node.js

* Handles simple routing for you
* Doesn't restrict you at all.

Install with:

    npm install -g birbal

Have fun!

Quick example:
    var akbar = require("Birbal")
    function hi() {
        return "Hello!";
    }

    var routes = {"/hi":[hello, "GET"]}

    akbar.Birbal();

Awesome!

Here's what coming really soon (and is already done):

* POST and GET variable access (done)
* Integration with Jade, Haml.JS and Moustache
* Integration with Redis and MongoDB
* Basically turning Birbal into a microframework

Watch this project to keep in touch :) 
