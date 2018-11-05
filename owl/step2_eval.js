'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const node_readline_1 = require('./node_readline');
const printer_1 = require('./printer');
const reader_1 = require('./reader');
const types_1 = require('./types');
// READ
const READ = str => {
  return reader_1.readStr(str);
};
// EVAL
const EVAL = (ast, env) => {
  if (ast.type === 1 /* List */) {
    if (ast.list.length === 0) {
      return ast;
    } else {
      const res = evalAST(ast, env);
      const [first, ...rest] = res.list;
      if (first.type !== 10 /* Function */) {
        throw new Error(`unexpected token: ${first.type}, expected: function`);
      }
      return first.func(...rest);
    }
  } else {
    return evalAST(ast, env);
  }
};
/**
 * function eval_ast which takes ast (owl data type) and an associative structure (the environment from above).
 * eval_ast switches on the type of ast as follows:
 * symbol:   lookup the symbol in the environment structure and return the value or raise an error if no value is found
 * list:     return a new list that is the result of calling EVAL on each of the members of the list
 * otherwise just return the original ast value
 *
 * @param ast owl data type
 * @param env the associative structure
 */
const evalAST = (ast, env) => {
  switch (ast.type) {
    case 7 /* Symbol */:
      const find = replEnv[Symbol.keyFor(ast.val)];
      if (!find) {
        throw new Error(`unknown symbol: ${Symbol.keyFor(ast.val)}`);
      }
      return find;
    case 1 /* List */:
      return new types_1.OwlList(ast.list.map(el => EVAL(el, env)));
    case 2 /* Vector */:
      return new types_1.OwlVector(ast.list.map(el => EVAL(el, env)));
    case 9 /* HashMap */:
      const list = [];
      for (const [key, value] of ast.map.entries()) {
        list.push(key);
        list.push(EVAL(value, env));
      }
      return new types_1.OwlHashMap(list);
    default:
      return ast;
  }
};
// PRINT
const PRINT = printer_1.prStr;
// noinspection TsLint
const replEnv = {
  '+': types_1.OwlFunction.simpleFunc(
    (a, b) => new types_1.OwlNumber(a.val + b.val),
  ),
  '-': types_1.OwlFunction.simpleFunc(
    (a, b) => new types_1.OwlNumber(a.val - b.val),
  ),
  '*': types_1.OwlFunction.simpleFunc(
    (a, b) => new types_1.OwlNumber(a.val * b.val),
  ),
  '/': types_1.OwlFunction.simpleFunc(
    (a, b) => new types_1.OwlNumber(a.val / b.val),
  ),
};
const rep = str => PRINT(EVAL(READ(str), replEnv));
while (true) {
  const line = node_readline_1.readline('user> ');
  if (line == null || line === '(owl-bye)') {
    break;
  }
  if (line === '') {
    continue;
  }
  try {
    console.log(rep(line));
  } catch (exc) {
    if (exc instanceof reader_1.BlankException) {
      continue;
    }
    if (exc.stack) {
      console.log(exc.stack);
    } else {
      console.log(`Error: ${exc}`);
    }
  }
}
