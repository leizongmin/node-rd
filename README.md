[![Build Status](https://secure.travis-ci.org/leizongmin/node-rd.png?branch=master)](http://travis-ci.org/leizongmin/node-rd)

node-rd
=======

列出（遍历）目录下的所有文件，包括子目录

## API列表

说明：

+ `read` 开头表示返回数组结果
+ `each` 开头表示每发现一个文件均调用回调函数 `findOne`
+ `Sync` 结尾表示是同步函数，其他表示异步函数

可用的API（详细用法可参考 `test/test.js` ）：

+ `read(dir, [threads], callback)`
+ `readFilter(dir, pattern, [threads], callback)`
+ `readFile(dir, [threads], callback)`
+ `readFileFilter(dir, pattern, [threads], callback)`
+ `readDir(dir, [threads], callback)`
+ `readDirFilter(dir, pattern, [threads], callback)`
+ `each(dir, findOne, [threads], callback)`
+ `eachFilter(dir, pattern, [threads], findOne, callback)`
+ `eachFile(dir, [threads], findOne, callback)`
+ `eachFileFilter(dir, pattern, [threads], findOne, callback)`
+ `eachDir(dir, [threads], findOne, callback)`
+ `eachDirFilter(dir, pattern, [threads], findOne, callback)`

说明：

+ 以上所有函数均提供同步版本，如 `read` 对应的同步版本为 `readSync`；
相应的 `callback` 改为直接 `return` 返回值；
+ `threads` 参数表示并发数量，为可选参数，默认为1；同步版本没有此参数；

`findOne` 回调函数格式：

```JavaScript
function findOne (filename, stats) {
  // filename 是当前文件的完整路径
  // stats 是使用 fs.Stats 对象
}
```

`callback` 回调函数格式：

```JavaScript
function callback (err, list) {
  // 如果出错，err为出错信息
  // each系列函数没有list参数
  // read系列函数list为完整文件名的列表
}
```

`pattern` 参数格式：

+ 正则表达式
+ 函数

```JavaScript
function pattern (filename) {
  // filename 是当前文件的完整路径
  // 返回 true 表示该文件名符合条件
}
```


## 简单示例

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
Copyright (c) 2013-2014 Zongmin Lei (雷宗民) <leizongmin@gmail.com>
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