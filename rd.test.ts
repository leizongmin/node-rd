import * as rd from "./";
import * as rdPromises from "./promises";

async function test() {
  rd.each("/", (f, s) => console.log(f, s), err => console.log("done"));
  rd.eachSync("/", (f, s) => console.log(f, s));
  rd.read("/", (err, ret) => console.log(err, ret));
  rd.readSync("/").forEach(f => console.log(f));
  rd.eachSync("/", (f, s) => console.log(f, s));

  rdPromises.each("/", (f, s) => console.log(f, s));
  console.log(rdPromises.read("/"));
}
