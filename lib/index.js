/**
 * 列出目录下的所有文件
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */


var fs = require('fs');
var path = require('path');
var os = require('os');


// 默认并发线程数
var THREAD_NUM = os.cpus().length;

/**
 * 将数组中的文件名转换为完整路径
 *
 * @param {String} dir
 * @param {Array} files
 * @return {Array}
 */
function fullPath (dir, files) {
  return files.map(function (f) {
    return path.join(dir, f);
  });
}

/**
 * 遍历目录里面的所有文件
 *
 * @param {String} dir        目录名
 * @param {Number} thread_num 并发线程数
 * @param {Function} findOne  找到一个文件时的回调
 *                            格式：function (filename, stats, next)
 * @param {Function} callback 格式：function (err)
 */
function eachFile (dir, thread_num, findOne, callback) {
  fs.stat(dir, function (err, stats) {
    if (err) return callback(err);

    // findOne回调
    findOne(dir, stats, function () {

      if (stats.isFile()) {
        // 如果为文件，则表示终结
        return callback(null);

      } else if (stats.isDirectory()) {
        // 如果为目录，则接续列出该目录下的所有文件
        fs.readdir(dir, function (err, files) {
          if (err) return callback(err);

          files =fullPath(dir, files);

          // 启动多个并发线程
          var finish = 0;
          var threadFinish = function () {
            finish++;
            if (finish >= thread_num) return callback(null);
          };
          var next = function () {
            var f = files.pop();
            if (!f) return threadFinish();
            eachFile(f, thread_num, findOne, function (err, s) {
              if (err) return callback(err);
              next();
            });
          };
          for (var i = 0; i < thread_num; i++) {
            next();
          }
        });

      } else {
        // 未知文件类型
        callback(null);
      }
    });
  });
};

/**
 * 遍历目录里面的所有文件 (同步)
 *
 * @param {String} dir        目录名
 * @param {Function} findOne  找到一个文件时的回调
 *                            格式：function (filename, stats, next)
 */
function eachFileSync (dir, findOne) {
  var stats = fs.statSync(dir);
  findOne(dir, stats);

  // 遍历子目录
  if (stats.isDirectory()) {
    var files = fullPath(dir, fs.readdirSync(dir));

    files.forEach(function (f) {
      eachFileSync(f, findOne);
    });
  }
}

/**
 * 遍历目录下的所有文件
 *
 * @param {String} dir
 * @param {Number} thread_num  (optional)
 * @param {Function} findOne
 * @param {Function} callback
 */
exports.each = function (dir) {
  if (arguments.length < 3) return callback(new TypeError('Bad arguments number'));
  if (arguments.length === 3) {
    var thread_num = THREAD_NUM;
    var findOne = arguments[1];
    var callback = arguments[2];
  } else {
    var thread_num = arguments[1];
    var findOne = arguments[2];
    var callback = arguments[3];
  }

  if (!(thread_num > 0)) {
    return callback(new TypeError('The argument "thread_num" must be number and greater than 0'));
  }
  if (typeof findOne !== 'function') {
    return callback(new TypeError('The argument "findOne" must be a function'));
  }
  if (typeof callback !== 'function') {
    return callback(new TypeError('The argument "callback" must be a function'));
  }

  eachFile(path.resolve(dir), thread_num, findOne, callback);
};

/**
 * 遍历目录下的所有文件 (同步)
 *
 * @param {String} dir
 * @param {Function} findOne
 */
exports.eachSync = function (dir, findOne) {
  if (arguments.length < 2) throw new TypeError('Bad arguments number');

  if (typeof findOne !== 'function') {
    throw new TypeError('The argument "findOne" must be a function');
  }

  eachFileSync(path.resolve(dir), findOne);
};

/**
 * 列出目录下所有文件
 *
 * @param {String} dir
 * @param {Number} thread_num  (optional)
 * @param {Function} callback
 */
exports.read = function (dir) {
  if (arguments.length < 2) return callback(new TypeError('Bad arguments number'));
  if (arguments.length === 2) {
    var thread_num = THREAD_NUM;
    var callback = arguments[1];
  } else {
    var thread_num = arguments[1];
    var callback = arguments[2];
  }

  if (!(thread_num > 0)) {
    return callback(new TypeError('The argument "thread_num" must be number and greater than 0'));
  }
  if (typeof callback !== 'function') {
    return callback(new TypeError('The argument "callback" must be a function'));
  }

  var files = [];
  eachFile(path.resolve(dir), thread_num, function (filename, stats, next) {
    files.push(filename);
    next();
  }, function (err) {
    callback(err, files);
  });
};

/**
 * 列出目录下所有文件 (同步)
 *
 * @param {String} dir
 * @return {Array}
 */
exports.readSync = function (dir) {
  var files = [];
  eachFileSync(path.resolve(dir), function (filename, stats) {
    files.push(filename);
  });
  return files;
};
