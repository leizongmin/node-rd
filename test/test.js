/**
 * 测试
 */

var path = require('path');
var should = require('should');
var me = require('../');


describe('the rd moudle', function () {

  var DIR = path.resolve(__dirname, 'files');
  var STRUCTS = [
    '.',
    'a',
    'a/aa.txt',
    'a/ab',
    'a/ab/aba',
    'a/ab/aba/abaa.txt',
    'a/ab/abb.txt',
    'a/ab/abc.txt',
    'b',
    'b/ba.txt',
    'b/bb.txt',
    'b/bc.txt',
    'b/bd.txt',
    'c.txt',
    'e',
    'e/ea',
    'e/ea/eaa',
    'e/ea/eaa/eaaa',
    'e/ea/eaa/eaaa/eaaaa',
    'f'
  ];

  function TestStructs () {
    var files = this.files = {};
    STRUCTS.forEach(function (f) {
      f = path.resolve(DIR, f);
      files[f] = 0;
    });
  }
  TestStructs.prototype.test = function (f) {
    if (f in this.files) {
      this.files[f]++;
    } else {
      throw new Error('Unexpected file: ' + f);
    }
  };
  TestStructs.prototype.end = function () {
    for (var f in this.files) {
      var v = this.files[f];
      if (v > 1) {
        throw new Error('Duplicate file: ' + f);
      }
      if (v < 1) {
        throw new Error('Miss file: ' + f);
      }
    }
  };

  it('#each', function (done) {
    var structs = new TestStructs();
    me.each(DIR, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#each - thread_num', function (done) {
    var structs = new TestStructs();
    me.each(DIR, 1, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachSync', function (done) {
    var structs = new TestStructs();
    me.eachSync(DIR, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#read', function (done) {
    var structs = new TestStructs();
    me.read(DIR, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#read - thread_num', function (done) {
    var structs = new TestStructs();
    me.read(DIR, 1, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readSync', function (done) {
    var structs = new TestStructs();
    var files = me.readSync(DIR);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

});