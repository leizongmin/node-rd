/**
 * 测试
 */

var path = require('path');
var should = require('should');
var me = require('../');


describe('the rd moudle', function () {

  var DIR = path.resolve(__dirname, 'files');
  var STRUCTS_ALL = [
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
  var STRUCTS_DIR = [
    '.',
    'a',
    'a/ab',
    'a/ab/aba',
    'b',
    'e',
    'e/ea',
    'e/ea/eaa',
    'e/ea/eaa/eaaa',
    'e/ea/eaa/eaaa/eaaaa',
    'f'
  ];
  var STRUCTS_FILE = [
    'a/aa.txt',
    'a/ab/aba/abaa.txt',
    'a/ab/abb.txt',
    'a/ab/abc.txt',
    'b/ba.txt',
    'b/bb.txt',
    'b/bc.txt',
    'b/bd.txt',
    'c.txt'
  ];

  function TestStructs (STRUCTS) {
    var files = this.files = {};
    STRUCTS.forEach(function (f) {
      f = path.resolve(DIR, f);
      files[f] = 0;
    });
  }
  TestStructs.prototype.test = function (f) {
    if (/(\\|\/)NOFILE$/.test(f)) return;
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

  // ---------------------------------------------------------------------------

  it('#each', function (done) {
    var structs = new TestStructs(STRUCTS_ALL);
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
    var structs = new TestStructs(STRUCTS_ALL);
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
    var structs = new TestStructs(STRUCTS_ALL);
    me.eachSync(DIR, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#read', function (done) {
    var structs = new TestStructs(STRUCTS_ALL);
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
    var structs = new TestStructs(STRUCTS_ALL);
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
    var structs = new TestStructs(STRUCTS_ALL);
    var files = me.readSync(DIR);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it('#eachFileSync', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    me.eachFileSync(DIR, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#eachDirSync', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    me.eachDirSync(DIR, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it('#eachFilePatternSync - 1', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.eachFilePatternSync(DIR, pattern, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#eachFilePatternSync - 2', function (done) {
    var pattern = function (f) {
      return (f.substr(-4) === '.txt');
    }
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern('/' + f);
    }));
    me.eachFilePatternSync(DIR, pattern, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#eachDirPatternSync - 1', function (done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.eachDirPatternSync(DIR, pattern, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#eachDirPatternSync - 2', function (done) {
    var pattern = function (f) {
      return (f.substr(-3) === 'aaa');
    }
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern('/' + f);
    }));
    me.eachDirPatternSync(DIR, pattern, function (f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it('#readFileSync', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    var files = me.readFileSync(DIR);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#readFilePatternSync - 1', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    var files = me.readFilePatternSync(DIR, pattern);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#readFilePatternSync - 2', function (done) {
    var pattern = function (f) {
      return (f.substr(-4) === '.txt');
    }
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern('/' + f);
    }));
    var files = me.readFilePatternSync(DIR, pattern);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#readDirSync', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    var files = me.readDirSync(DIR);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#readDirPatternSync - 1', function (done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern.test('/' + f);
    }));
    var files = me.readDirPatternSync(DIR, pattern);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it('#readFilePatternSync - 2', function (done) {
    var pattern = function (f) {
      return (f.substr(-3) === 'aaa');
    }
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern('/' + f);
    }));
    var files = me.readDirPatternSync(DIR, pattern);
    files.forEach(function (f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it('#eachFile', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    me.eachFile(DIR, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachFile - thread_num', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    me.eachFile(DIR, 1, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachDir', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    me.eachDir(DIR, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachDir - thread_num', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    me.eachDir(DIR, 1, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachFilePattern', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.eachFilePattern(DIR, pattern, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachFilePattern - thread_num', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.eachFilePattern(DIR, pattern, 1, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachDirPattern', function (done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.eachDirPattern(DIR, pattern, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#eachDirPattern - thread_num', function (done) {
    var pattern = function (f) {
      return (f.substr(-3) === 'aaa');
    }
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern('/' + f);
    }));
    me.eachDirPattern(DIR, pattern, 1, function (f, s, next) {
      structs.test(f);
      next();
    }, function (err) {
      should.equal(err, null);
      structs.end();
      done();
    });
  });

  it('#readFile', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    me.readFile(DIR, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readFile - thread_num', function (done) {
    var structs = new TestStructs(STRUCTS_FILE);
    me.readFile(DIR, 1, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readDir', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    me.readDir(DIR, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readDir - thread_num', function (done) {
    var structs = new TestStructs(STRUCTS_DIR);
    me.readDir(DIR, 1, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readFilePattern', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.readFilePattern(DIR, pattern, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readFilePattern - thread_num', function (done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(STRUCTS_FILE.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.readFilePattern(DIR, pattern, 1, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readDirPattern', function (done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern.test('/' + f);
    }));
    me.readDirPattern(DIR, pattern, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it('#readDirPattern - thread_num', function (done) {
    var pattern = function (f) {
      return (f.substr(-3) === 'aaa');
    }
    var structs = new TestStructs(STRUCTS_DIR.filter(function (f) {
      return pattern('/' + f);
    }));
    me.readDirPattern(DIR, pattern, 1, function (err, files) {
      should.equal(err, null);
      files.forEach(function (f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

});