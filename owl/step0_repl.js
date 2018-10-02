'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var node_readline_1 = require('./node_readline');
// READ
function read(str) {
  // TODO
  return str;
}
// EVAL
function evalMal(ast, _env) {
  // TODO
  return ast;
}
// PRINT
function print(exp) {
  // TODO
  return exp;
}
function rep(str) {
  // TODO
  return print(evalMal(read(str)));
}
while (true) {
  var line = node_readline_1.readline('user> ');
  if (line == null) {
    break;
  }
  if (line === '') {
    continue;
  }
  console.log(rep(line));
}
