/**
 * 测试使用同步方式和异步方式遍历整个目录需要多少时间
 */

const path = require("path");
const rd = require("../");
const DIR = path.resolve(__dirname, "..");

function sync(callback) {
  console.time("sync");
  let count = 0;
  rd.eachSync(DIR, function(f, s) {
    count++;
  });
  console.timeEnd("sync");
  console.log("Total %d files", count);
  callback && callback();
}

function async(callback) {
  console.time("async");
  let count = 0;
  rd.each(
    DIR,
    function(f, s, next) {
      count++;
      next();
    },
    function(err) {
      if (err) throw err;
      console.timeEnd("async");
      console.log("Total %d files", count);
      callback && callback();
    }
  );
}

sync(async);
