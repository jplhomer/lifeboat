// Set BABEL_ENV to use proper env config
process.env.BABEL_ENV = "test";

// setup JSDOM
require("jsdom-global")();

// make expect available globally
global.expect = require("expect");
global.sinon = require("sinon");
