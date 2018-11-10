import * as ts from "typescript";

console.log(eval(ts.transpile(`console.log(233)`)));
// console.log(23);
