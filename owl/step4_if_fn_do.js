'use strict';
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const core = __importStar(require('./core'));
const env_1 = require('./env');
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
  if (!ast) throw new Error('invalid syntax');
  if (ast.type !== 1 /* List */) {
    return evalAST(ast, env);
  }
  if (ast.list.length === 0) {
    return ast;
  }
  const first = ast.list[0];
  switch (first.type) {
    case 7 /* Symbol */:
      switch (Symbol.keyFor(first.val)) {
        case 'def!': {
          const [, key, value] = ast.list;
          if (key.type !== 7 /* Symbol */) {
            throw new Error(
              `unexpected toke type: ${key.type}, expected: symbol`,
            );
          }
          if (!value) {
            throw new Error(`unexpected syntax`);
          }
          return env.set(key, EVAL(value, env));
        }
        case 'let*': {
          const letEnv = new env_1.Env(env);
          const pairs = ast.list[1];
          if (pairs.type !== 1 /* List */ && pairs.type !== 2 /* Vector */) {
            throw new Error(
              `unexpected toke type: ${pairs.type}, expected: list or vector`,
            );
          }
          const list = pairs.list;
          for (let i = 0; i < list.length; i += 2) {
            const key = list[i];
            const value = list[i + 1];
            if (!key || !value) {
              throw new Error(`syntax error`);
            }
            if (key.type !== 7 /* Symbol */) {
              throw new Error(
                `unexpected token type: ${key.type}, expected: symbol`,
              );
            }
            letEnv.set(key, EVAL(value, letEnv));
          }
          return EVAL(ast.list[2], letEnv);
        }
        case 'do': {
          const [, ...list] = ast.list;
          const r = evalAST(new types_1.OwlList(list), env);
          if (r.type !== 1 /* List */ && r.type !== 2 /* Vector */) {
            throw new Error(
              `unexpected return type: ${r.type}, expected: list or vector`,
            );
          }
          return r.list[r.list.length - 1];
        }
        case 'if': {
          const [, fir, sec, thr] = ast.list;
          const r = EVAL(fir, env);
          if (
            !(
              (r.type === 5 /* Boolean */ && r.val === false) ||
              r.type === 6
            ) /* Nil */
          ) {
            return EVAL(sec, env);
          } else if (thr) {
            return EVAL(thr, env);
          } else {
            return new types_1.OwlNil();
          }
        }
        case 'fn*': {
          const [, sec, binds] = ast.list;
          if (!types_1.isListOrVector(sec)) {
            throw new Error(
              `unexpected return type: ${sec.type}, expected: list or vector`,
            );
          }
          const symbols = sec.list.map(el => {
            if (el.type !== 7 /* Symbol */) {
              throw new Error(
                `unexpected return type: ${el.type}, expected: symbol`,
              );
            }
            return el;
          });
          return types_1.OwlFunction.simpleFunc((...fnArgs) =>
            EVAL(binds, new env_1.Env(env, symbols, fnArgs)),
          );
        }
      }
  }
  const res = evalAST(ast, env);
  const [fn, ...args] = res.list;
  if (fn.type !== 10 /* Function */) {
    throw new Error(`unexpected token: ${fn.type}, expected: function`);
  }
  return fn.func(...args);
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
      const find = env.get(ast);
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
const replEnv = new env_1.Env();
const rep = str => PRINT(EVAL(READ(str), replEnv));
core.ns.forEach((v, k) => {
  replEnv.set(k, v);
});
rep('(def! not (fn* (a) (if a false true)))');
while (true) {
  const line = node_readline_1.readline('user> ');
  if (line == null || line === '(exit)') {
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
