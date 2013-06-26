/**
 * 测试使用同步方式和异步方式遍历整个目录需要多少时间
 */

var me = require('../');
var DIR = '/';


function sync (callback) {
  console.time('sync');
  var count = 0;
  me.eachSync(DIR, function (f, s) {
    count++;
  });
  console.timeEnd('sync');
  console.log('Total %d files', count);
  callback && callback();
}

function async (callback) {
  console.time('async');
  var count = 0;
  me.each(DIR, function (f, s, next) {
    count++;
    next();
  }, function (err) {
    if (err) throw err;
    console.timeEnd('async');
    console.log('Total %d files', count);
    callback && callback();
  });
}


//async(sync);
sync(async);
