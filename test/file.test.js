const nock = require("nock");
const fs = require("fs-extra");
const path = require("path");
const { expect } = require("chai");
const { Rss } = require("../index");
let store_path = "storefiles/zhihu.txt";

describe("test store file update", () => {
  before(() => {
    nock("https://cnodejs.org")
      .get("/rss")
      .once()
      .reply(200, function(uri, requestBody) {
        return fs.createReadStream(path.join(__dirname, "files/zhihu.xml"));
      });

    nock("https://cnodejs.org")
      .get("/rss")
      .times(100)
      .delay(100)
      .reply(200, function(uri, requestBody) {
        return fs.createReadStream(
          path.join(__dirname, "files/zhihu.twice.xml")
        );
      });
  });
  after(function() {
    nock.cleanAll();
    fs.removeSync(path.join(__dirname, "/storefiles"));
  });

  it("should result include string", done => {
    let rssSrv = new Rss({
      urls: ["https://cnodejs.org/rss"],
      path: store_path,
      type: "fs"
    });

    rssSrv.start();
    let testValite = function() {
      rssSrv.stop();
      let rst = fs.readFileSync(path.join(__dirname, store_path));

      expect(rst.toString()).to.contain("更新后会多家哟条");
      done();
    };
    setTimeout(testValite, 3000);
  });
});
describe("test store file not update", () => {
  before(() => {
    nock("https://cnodejs.org")
      .get("/rss")
      .times(100)
      .delay(100)
      .reply(200, function(uri, requestBody) {
        return fs.createReadStream(path.join(__dirname, "files/zhihu.xml"));
      });
  });
  after(function() {
    nock.cleanAll();
    fs.removeSync(path.join(__dirname, '/storefiles'));
  });

  it("should result not inclue string", done => {
    let rssSrv = new Rss({
      urls: ["https://cnodejs.org/rss"],
      path: store_path,
      type: "fs"
    });

    rssSrv.start();
    let testValite = function() {
      rssSrv.stop();
      let rst = fs.readFileSync(path.join(__dirname, store_path));
      expect(rst.toString()).to.not.include("更新后会多家哟条");
      done();
    };
    setTimeout(testValite, 5000);
  });
});
