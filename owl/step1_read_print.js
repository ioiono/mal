'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const node_readline_1 = require('./node_readline');
const printer_1 = require('./printer');
const reader_1 = require('./reader');
// READ
const READ = str => {
  return reader_1.readStr(str);
};
// EVAL
const EVAL = (ast, _env) => ast;
// PRINT
const PRINT = printer_1.prStr;
const rep = str => PRINT(EVAL(READ(str)));
while (true) {
  const line = node_readline_1.readline('user> ');
  if (line == null) {
    break;
  }
  if (line === '') {
    continue;
  }
  try {
    console.log(rep(line));
  } catch (e) {
    console.error(e.message);
  }
}
