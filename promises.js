var rd = require("./index");

exports.each = function(dir, findOne) {
  return new Promise(function(resolve, reject) {
    rd.each(dir, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.eachFile = function(dir, findOne) {
  return new Promise(function(resolve, reject) {
    rd.eachFile(dir, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.eachDir = function(dir, findOne) {
  return new Promise(function(resolve, reject) {
    rd.eachDir(dir, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.eachFilter = function(dir, pattern, findOne) {
  return new Promise(function(resolve, reject) {
    rd.eachFilter(dir, pattern, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.eachFilter = function(dir, pattern, findOne) {
  return new Promise(function(resolve, reject) {
    rd.eachFilter(dir, pattern, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.eachFilter = function(dir, pattern, findOne) {
  return new Promise(function(resolve, reject) {
    rd.eachFilter(dir, pattern, findOne, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.read = function(dir) {
  return new Promise(function(resolve, reject) {
    rd.read(dir, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.readFile = function(dir) {
  return new Promise(function(resolve, reject) {
    rd.readFile(dir, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.readDir = function(dir) {
  return new Promise(function(resolve, reject) {
    rd.readDir(dir, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.readFilter = function(dir, pattern) {
  return new Promise(function(resolve, reject) {
    rd.readFilter(dir, pattern, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.readFileFilter = function(dir, pattern) {
  return new Promise(function(resolve, reject) {
    rd.readFileFilter(dir, pattern, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};

exports.readDirFilter = function(dir, pattern) {
  return new Promise(function(resolve, reject) {
    rd.readDirFilter(dir, pattern, function(err, ret) {
      if (err) return reject(err);
      resolve(ret);
    });
  });
};
