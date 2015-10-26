#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var fileName = __dirname + "/" + "users.json";

/**
 *  Define the sample application.
 */
var SampleApp = function() {

  //  Scope.
  var self = this;


  /*  ================================================================  */
  /*  Helper functions.                                                 */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };


  /**
   *  Populate the cache.
   */
  self.populateCache = function() {
    if (typeof self.zcache === "undefined") {
      self.zcache = {
        'index.html': ''
      };
    }

    //  Local cache for static content.
    self.zcache['index.html'] = fs.readFileSync('./index.html');
  };


  /**
   *  Retrieve entry (content) from cache.
   *  @param {string} key  Key identifying content to retrieve from cache.
   */
  self.cache_get = function(key) {
    return self.zcache[key];
  };


  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function() {
    //  Process on exit and signals.
    process.on('exit', function() {
      self.terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Create the routing table entries + handlers for the application.
   */
  self.createRoutes = function() {
    self.routes = {};

    self.routes['/asciimo'] = function(req, res) {
      var link = "http://i.imgur.com/kmbjB.png";
      res.send("<html><body><img src='" + link + "'></body></html>");
    };

    self.routes['/'] = function(req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.send(self.cache_get('index.html'));
    };
  };


  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function() {
    self.createRoutes();
    self.app = express();;

    //  Add handlers for the app (from the routes).
    for (var r in self.routes) {
      self.app.get(r, self.routes[r]);
    }
  };


  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.populateCache();
    self.setupTerminationHandlers();

    // Create the express server and routes.
    self.initializeServer();
  };


  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //  Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
  };

  self.rest = function() {

    self.app.get('/listLevels', function(req, res) {
      fs.readFile(fileName, 'utf8', function(err, data) {
        res.end(data);
      });
    });

    self.app.get('/addLevel', function(req, res) {
      fs.readFile(fileName, 'utf8', function(err, data) {
        data = JSON.parse(data);
        var levelName = "level" + req.query.id;
        var nob = req.query.nob; //number of Blocks
        var noc = req.query.noc; //number of cycles
        if (!data[levelName]) {
          {
            console.log("the level is not there .. will create it now");
            data[levelName] = {};
            data[levelName].noc = [noc];
            data[levelName].nob = [nob];
            console.log("you are the first to solve this level");
          }
        } else {
          console.log("the level is already there")
          if (data[levelName].nob[0] >= nob) {
            console.log("you beat the minimum number of nob which was " + data[levelName].nob);
            data[levelName].nob.push(nob);
            data[levelName].nob.sort();
          } else {
            console.log("you didn't beat the minimum number of nob which was " + data[levelName].nob);
            data[levelName].nob.push(nob);
            data[levelName].nob.sort();
          }
          if (data[levelName].noc[0] >= noc) {
            console.log("you beat the minimum number of noc which was " + data[levelName].noc);
            data[levelName].noc.push(noc);
            data[levelName].noc.sort();
          } else {
            console.log("you didn't beat the minimum number of noc which was " + data[levelName].noc);
            data[levelName].noc.push(noc);
            data[levelName].noc.sort();
          }
        }

        data = JSON.stringify(data);
        fs.writeFile(fileName, data, function(err) {
          if (err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        res.end();
      });
    });
  };

}; /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
zapp.rest();
