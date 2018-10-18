import { readStr } from "./reader";
import { prStr } from "./printer";

console.log("begin");
console.log(prStr(readStr(";2333")));
console.log(prStr(readStr("123;2333")));
console.log("end");
