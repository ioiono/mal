'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const node_readline_1 = require('./node_readline');
// READ
const READ = str => str;
// EVAL
const EVAL = (ast, _env) => ast;
// PRINT
const PRINT = exp => exp;
const rep = str => PRINT(EVAL(READ(str)));
while (true) {
  const line = node_readline_1.readline('user> ');
  if (!line) break;
  console.log(rep(line));
}
