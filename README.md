[![Build Status](https://secure.travis-ci.org/leizongmin/node-rd.png?branch=master)](http://travis-ci.org/leizongmin/node-rd)

node-rd
=======

列出（遍历）目录下的所有文件，包括子目录


```javascript
var rd = require('rd');

// 异步列出目录下的所有文件
rd.read('/tmp', function (err, files) {
  if (err) throw err;
  // files是一个数组，里面是目录/tmp目录下的所有文件（包括子目录）
});

// 同步列出目录下的所有文件
var files = rd.readSync('/tmp');

// 异步遍历目录下的所有文件
rd.each('/tmp', function (f, s, next) {
  // 每找到一个文件都会调用一次此函数
  // 参数s是通过 fs.stat() 获取到的文件属性值
  console.log('file: %s', f);
  // 必须调用next()才能继续
  next();
}, function (err) {
  if (err) throw err;
  // 完成
});

// 同步遍历目录下的所有文件
rd.eachSync('/tmp', function (f, s) {
  // 每找到一个文件都会调用一次此函数
  // 参数s是通过 fs.stat() 获取到的文件属性值
  console.log('file: %s', f);
});
```


License
=======

```
Copyright (c) 2013 Lei Zongmin(雷宗民) <leizongmin@gmail.com>
http://ucdok.com

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```