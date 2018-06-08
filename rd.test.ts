import * as rd from "./";

rd.each("/", (f, s) => console.log(f, s), err => console.log("done"));

rd.eachSync("/", (f, s) => console.log(f, s));

rd.read("/", (err, ret) => console.log(err, ret));

rd.readSync("/").forEach(f => console.log(f));
