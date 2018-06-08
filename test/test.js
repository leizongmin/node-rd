/**
 * 测试
 */

var path = require("path");
var assert = require("assert");
var rd = require("../");

describe("the rd moudle", function() {
  var DIR = path.resolve(__dirname, "files");
  var STRUCTS_ALL = [
    ".",
    "a",
    "a/aa.txt",
    "a/ab",
    "a/ab/aba",
    "a/ab/aba/abaa.txt",
    "a/ab/abb.txt",
    "a/ab/abc.txt",
    "b",
    "b/ba.txt",
    "b/bb.txt",
    "b/bc.txt",
    "b/bd.txt",
    "c.txt",
    "e",
    "e/ea",
    "e/ea/eaa",
    "e/ea/eaa/eaaa",
    "e/ea/eaa/eaaa/eaaaa",
    "f"
  ];
  var STRUCTS_DIR = [
    ".",
    "a",
    "a/ab",
    "a/ab/aba",
    "b",
    "e",
    "e/ea",
    "e/ea/eaa",
    "e/ea/eaa/eaaa",
    "e/ea/eaa/eaaa/eaaaa",
    "f"
  ];
  var STRUCTS_FILE = [
    "a/aa.txt",
    "a/ab/aba/abaa.txt",
    "a/ab/abb.txt",
    "a/ab/abc.txt",
    "b/ba.txt",
    "b/bb.txt",
    "b/bc.txt",
    "b/bd.txt",
    "c.txt"
  ];

  function TestStructs(STRUCTS) {
    var files = (this.files = {});
    STRUCTS.forEach(function(f) {
      f = path.resolve(DIR, f);
      files[f] = 0;
    });
  }
  TestStructs.prototype.test = function(f) {
    if (/(\\|\/)NOFILE$/.test(f)) return;
    if (f in this.files) {
      this.files[f]++;
    } else {
      throw new Error("Unexpected file: " + f);
    }
  };
  TestStructs.prototype.end = function() {
    for (var f in this.files) {
      var v = this.files[f];
      if (v > 1) {
        throw new Error("Duplicate file: " + f);
      }
      if (v < 1) {
        throw new Error("Miss file: " + f);
      }
    }
  };

  // ---------------------------------------------------------------------------

  it("#each", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    rd.each(
      DIR,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#each - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    rd.each(
      DIR,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachSync", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    rd.eachSync(DIR, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#read", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    rd.read(DIR, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#read - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    rd.read(DIR, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readSync", function(done) {
    var structs = new TestStructs(STRUCTS_ALL);
    var files = rd.readSync(DIR);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it("#eachFileSync", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    rd.eachFileSync(DIR, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#eachDirSync", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    rd.eachDirSync(DIR, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it("#eachFileFilterSync - 1", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFileFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#eachFileFilterSync - 2", function(done) {
    var pattern = function(f) {
      return f.substr(-4) === ".txt";
    };
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern("/" + f);
      })
    );
    rd.eachFileFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#eachDirFilterSync - 1", function(done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachDirFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#eachDirFilterSync - 2", function(done) {
    var pattern = function(f) {
      return f.substr(-3) === "aaa";
    };
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern("/" + f);
      })
    );
    rd.eachDirFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it("#readFileSync", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    var files = rd.readFileSync(DIR);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readFileFilterSync - 1", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    var files = rd.readFileFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readFileFilterSync - 2", function(done) {
    var pattern = function(f) {
      return f.substr(-4) === ".txt";
    };
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern("/" + f);
      })
    );
    var files = rd.readFileFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readDirSync", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    var files = rd.readDirSync(DIR);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readDirFilterSync - 1", function(done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    var files = rd.readDirFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readFileFilterSync - 2", function(done) {
    var pattern = function(f) {
      return f.substr(-3) === "aaa";
    };
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern("/" + f);
      })
    );
    var files = rd.readDirFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  // ---------------------------------------------------------------------------

  it("#eachFile", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    rd.eachFile(
      DIR,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachFile - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    rd.eachFile(
      DIR,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachDir", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    rd.eachDir(
      DIR,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachDir - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    rd.eachDir(
      DIR,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachFileFilter", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFileFilter(
      DIR,
      pattern,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachFileFilter - thread_num", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFileFilter(
      DIR,
      pattern,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachDirFilter", function(done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachDirFilter(
      DIR,
      pattern,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachDirFilter - thread_num", function(done) {
    var pattern = function(f) {
      return f.substr(-3) === "aaa";
    };
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern("/" + f);
      })
    );
    rd.eachDirFilter(
      DIR,
      pattern,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#readFile", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    rd.readFile(DIR, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readFile - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_FILE);
    rd.readFile(DIR, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readDir", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    rd.readDir(DIR, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readDir - thread_num", function(done) {
    var structs = new TestStructs(STRUCTS_DIR);
    rd.readDir(DIR, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readFileFilter", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.readFileFilter(DIR, pattern, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readFileFilter - thread_num", function(done) {
    var pattern = /a\.txt$/;
    var structs = new TestStructs(
      STRUCTS_FILE.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.readFileFilter(DIR, pattern, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readDirFilter", function(done) {
    var pattern = /aaa$/;
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.readDirFilter(DIR, pattern, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readDirFilter - thread_num", function(done) {
    var pattern = function(f) {
      return f.substr(-3) === "aaa";
    };
    var structs = new TestStructs(
      STRUCTS_DIR.filter(function(f) {
        return pattern("/" + f);
      })
    );
    rd.readDirFilter(DIR, pattern, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  // ---------------------------------------------------------------------------

  it("#eachFilter", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFilter(
      DIR,
      pattern,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#eachFilter - thread_num", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFilter(
      DIR,
      pattern,
      1,
      function(f, s, next) {
        structs.test(f);
        next();
      },
      function(err) {
        assert.equal(err, null);
        structs.end();
        done();
      }
    );
  });

  it("#readFilter", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.readFilter(DIR, pattern, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  it("#readFilter - thread_num", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.readFilter(DIR, pattern, 1, function(err, files) {
      assert.equal(err, null);
      files.forEach(function(f) {
        structs.test(f);
      });
      structs.end();
      done();
    });
  });

  // ---------------------------------------------------------------------------

  it("#eachFilterSync - 1", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    rd.eachFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#eachFilterSync - 2", function(done) {
    var pattern = function(f) {
      return /(eaaaa|abaa.txt)$/.test(f);
    };
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern("/" + f);
      })
    );
    rd.eachFilterSync(DIR, pattern, function(f, s) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readFilterSync - 1", function(done) {
    var pattern = /(eaaaa|abaa.txt)$/;
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern.test("/" + f);
      })
    );
    var files = rd.readFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });

  it("#readFilterSync - 2", function(done) {
    var pattern = function(f) {
      return /(eaaaa|abaa.txt)$/.test(f);
    };
    var structs = new TestStructs(
      STRUCTS_ALL.filter(function(f) {
        return pattern("/" + f);
      })
    );
    var files = rd.readFilterSync(DIR, pattern);
    files.forEach(function(f) {
      structs.test(f);
    });
    structs.end();
    done();
  });
});
