// "use strict";

// const chai = require("chai");
// const chaiHttp = require("chai-http");

// const { TEST_MONGODB_URI } = require("../config");
// const { JWT_SECRET } = require("../config");
// const { dbConnect, dbDisconnect } = require("../db-mongoose");
// const { dbConnect, dbDisconnect } = require("../db-knex");

// // Set NODE_ENV to `test` to disable http layer logs
// // You can do this in the command line, but this is cross-platform
// process.env.NODE_ENV = "test";

// // Clear the console before each run
// process.stdout.write("\x1Bc\n");

// const expect = chai.expect;
// chai.use(chaiHttp);

// before(function() {
//   return dbConnect(TEST_MONGODB_URI);
// });

// after(function() {
//   return dbDisconnect();
// });

// describe("Mocha and Chai", function() {
//   it("should be properly setup", function() {
//     expect(true).to.be.true;
//   });
// });
