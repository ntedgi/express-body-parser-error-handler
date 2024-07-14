const express = require("express");
const { urlencoded, json } = require("body-parser");
const request = require("supertest");
const { expect } = require("chai");

const bodyParserErrorHandler = require("../index");

async function createApp(bodyParserMWConfig) {
  const app = express();
  const router = express.Router();
  router.route("/").get(function (req, res) {
    return res.json({ goodCall: true });
  });
  router.route("/").post(function (req, res) {
    return res.json({ goodCall: true });
  });
  const defaultLimitSize = "250kb";
  app.use(urlencoded({ extended: false, limit: defaultLimitSize }));
  app.use("/", json({ limit: defaultLimitSize }));
  app.use(bodyParserErrorHandler(bodyParserMWConfig));
  app.use(router);
  return app;
}

describe("Body Parser Error Error Handling Middle ware ", function () {
  describe("should handled on dedicated middleware and return 4xx to client ", function () {
    let app, testServer;
    beforeAll(function (done) {
      createApp().then((newApp) => {
        app = newApp;
        testServer = app.listen(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });
      });
    });
    afterAll(function (done) {
      testServer.close(done);
    });
    it("Sanity - should send back a JSON object with goodCall set to true", function (done) {
      request(app)
        .get("/")
        .set("Content-Type", "application/json")
        .expect(200, function (err, res) {
          if (err) {
            return done(err);
          }
          const callStatus = res.body.goodCall;
          expect(callStatus).to.equal(true);
          done();
        });
    });
    it("Sanity - should catch error inside Body Parser handler when sending broken json", function (done) {
      request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .send("{ email: 'email', password: 'password'")
        .expect(400, function (err, res) {
          if (err) {
            return done(err);
          }

          expect(JSON.parse(res.text).message).oneOf([
            "Body Parser failed to parse request --> Unexpected token e in JSON at position 2",
            "Body Parser failed to parse request --> Expected property name or '}' in JSON at position 2",
          ]);

          done();
        });
    });
    it("Sanity - should catch error inside Body Parser handler when sending 251Kb payload", function (done) {
      const KB = 1024;
      const limit = 257 * KB;
      const longStr = new Array(limit + 1).join("*");

      request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .send(`{ email:${longStr}}`)
        .expect(413, function (err, res) {
          if (err) {
            return done(err);
          }

          expect(JSON.parse(res.text).message).to.equal(
            "Body Parser failed to parse request --> request entity too large"
          );

          done();
        });
    });
  });
  describe("parameters", function () {
    it("should support onError call back function", function (done) {
      let onErrorFunctionCalled = false;

      function onErrorFunction(error, req, res) {
        onErrorFunctionCalled = true;
      }

      createApp({ onError: onErrorFunction }).then((app) => {
        request(app)
          .post("/")
          .set("Content-Type", "application/json")
          .send("{ email: 'email', password: 'password'")
          .expect(400, function (err, res) {
            expect(JSON.parse(res.text).message).oneOf([
              "Body Parser failed to parse request --> Unexpected token e in JSON at position 2",
              "Body Parser failed to parse request --> Expected property name or '}' in JSON at position 2",
            ]);

            onErrorFunctionCalled ? done() : done(err);
          });
      });
    });
    it("should support custom errorMessage  function", function (done) {
      const errorMessageExample = () => {
        return "what does the fox say?";
      };
      createApp({ errorMessage: errorMessageExample }).then((app) => {
        request(app)
          .post("/")
          .set("Content-Type", "application/json")
          .send("{ email: 'email', password: 'password'")
          .expect(400, function (err, res) {
            expect(JSON.parse(res.text).message).to.equal(
              errorMessageExample(err)
            );
            done();
          });
      });
    });
    it("should pass error not related to body parser ", function (done) {
      const app = express();
      const router = express.Router();
      router.route("/").post(function (req, res) {
        return res.json({ goodCall: true });
      });
      app.use("/", json({ limit: "250kb" }));
      app.use((e, req, res, next) => {
        throw new Error("I'm a bad error");
      });
      app.use(bodyParserErrorHandler({}));
      app.use(router);
      request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .send("{ email: 'email', password: 'password'}")
        .expect(500, function (e, res) {
          done();
        });
    });
  });

  describe("play nice with other middlewares", function () {
    it("should call next if no errors found", function (done) {
      let middleWareCalled = false;

      function nextMiddleWare() {
        return (req, res, next) => {
          middleWareCalled = true;
          next();
        };
      }

      const app = express();
      const router = express.Router();
      router.route("/").post(function (req, res) {
        return res.json({ goodCall: true });
      });
      app.use(bodyParserErrorHandler({}));
      app.use(nextMiddleWare());
      app.use(router);
      request(app)
        .post("/")
        .set("Content-Type", "application/json")
        .send("{}")
        .expect(200, function (e, res) {
          expect(middleWareCalled).to.equal(true);
          done();
        });
    });
  });
});
