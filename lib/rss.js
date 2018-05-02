const request = require("request-promise");
const FeedMe = require("feedme");
const moment = require("moment");
const events = require("events");
const eventEmiter = new events.EventEmitter();

let { ParamsError } = require("./infrastructure/error");
let { saveFile } = require("./infrastructure/savefile");

class Rss {
  constructor(options) {
    this.options = options;
  }
  _ifThrow(condition, msg, status) {
    if (condition) {
      throw new ParamsError(msg, status);
    }
  }

  async _fetchOne(url, type, lastUpdateAt, init = true, end = false) {
    let parser = new FeedMe();
    let startTime = moment();
    let tmpUpdateAt;
    let ssrLength = 0;
    parser.on("title", title => {
      console.log("title of feed is", title);
    });
    parser.on("item", item => {
      let itemDate = item.pubdate;
      let needSave = true;
      if (!tmpUpdateAt) {
        tmpUpdateAt = itemDate;
      }

      //新数据
      if (moment(new Date(lastUpdateAt)).isBefore(moment(new Date(itemDate)))) {
        console.log("need update data");
      } else if (!init) {
        needSave = false;
      }
      if (needSave && type === "fs") {
        ssrLength++;
        saveFile(
          this.options.path,
          item.title + "\n" + item.description + "\n\n"
        );
      }
    });
    parser.on("end", () => {
      lastUpdateAt = tmpUpdateAt;
      console.log(
        "站点" +
          url +
          "获取完成,一共获得" +
          ssrLength +
          "条记录，耗时" +
          (moment() - startTime) / 1000 +
          "秒"
      );
      if (!this.end) {
        this._fetchOne(url, type, lastUpdateAt, false);
      }
    });

    request(url)
      .on("error", function(err) {
        console.log(err);
      })
      .pipe(parser);
  }

  async start() {
    let urls = this.options.urls,
      type = this.options.type || "fs"; //default if fs
    this._ifThrow(Array.isArray(urls) && urls.length === 0, "参数缺失", 400);
    for (let i = 0; i < urls.length; i++) {
      await this._fetchOne(urls[i], type);
    }
  }

  async stop() {
    this.end = true;
  }
}

module.exports = {
  Rss
};
