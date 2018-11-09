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
const isMacroCall = (ast, env) => {
  if (!types_1.isListOrVector(ast)) return false;
  const sym = ast.list[0];
  if (sym.type !== 7 /* Symbol */) return false;
  const e = env.find(sym);
  if (!e) {
    return false;
  }
  const fn = e.get(sym);
  return fn.type === 10 /* Function */ && fn.isMacro;
};
const macroExpand = (ast, env) => {
  while (isMacroCall(ast, env)) {
    if (!types_1.isListOrVector(ast)) {
      throw new Error(
        `unexpected token type: ${ast.type}, expected: list or vector`,
      );
    }
    const [first, ...rest] = ast.list;
    if (first.type !== 7 /* Symbol */) {
      throw new Error(
        `unexpected token type: ${first.type}, expected: list or vector`,
      );
    }
    const fn = env.get(first);
    if (fn.type !== 10 /* Function */) {
      throw new Error(`unexpected return type: ${fn.type}, expected: function`);
    }
    ast = fn.func(...rest);
  }
  return ast;
};
const isPair = ast => types_1.isListOrVector(ast) && ast.list.length > 0;
const quasiquote = ast => {
  if (!isPair(ast)) {
    return new types_1.OwlList([new types_1.OwlSymbol('quote'), ast]);
  }
  const [fir, sec] = ast.list;
  if (fir.type === 7 /* Symbol */ && Symbol.keyFor(fir.val) === 'unquote') {
    return sec;
  }
  if (isPair(fir)) {
    const [a, b] = fir.list;
    if (
      a.type === 7 /* Symbol */ &&
      Symbol.keyFor(a.val) === 'splice-unquote'
    ) {
      return new types_1.OwlList([
        new types_1.OwlSymbol('concat'),
        b,
        quasiquote(new types_1.OwlList(ast.list.slice(1))),
      ]);
    }
  }
  return new types_1.OwlList([
    new types_1.OwlSymbol('cons'),
    quasiquote(fir),
    quasiquote(new types_1.OwlList(ast.list.slice(1))),
  ]);
};
// EVAL
const EVAL = (ast, env) => {
  loop: while (true) {
    if (!ast) throw new Error('invalid syntax');
    if (ast.type !== 1 /* List */) {
      return evalAST(ast, env);
    }
    ast = macroExpand(ast, env);
    if (!types_1.isListOrVector(ast)) {
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
                `unexpected token type: ${key.type}, expected: symbol`,
              );
            }
            if (!value) {
              throw new Error(`unexpected syntax`);
            }
            return env.set(key, EVAL(value, env));
          }
          case 'defmacro!': {
            const [, key, value] = ast.list;
            if (key.type !== 7 /* Symbol */) {
              throw new Error(
                `unexpected token type: ${key.type}, expected: symbol`,
              );
            }
            if (!value) {
              throw new Error(`unexpected syntax`);
            }
            const f = EVAL(value, env);
            if (f.type !== 10 /* Function */) {
              throw new Error(
                `unexpected token type: ${f.type}, expected: function`,
              );
            }
            f.isMacro = true;
            return env.set(key, f);
          }
          /**
           * This special form allows a owl program to do explicit macro expansion without applying the result (which
           * can be useful for debugging macro expansion).
           */
          case 'macroexpand': {
            return macroExpand(ast.list[1], env);
          }
          case 'let*': {
            const letEnv = new env_1.Env(env);
            const pairs = ast.list[1];
            if (pairs.type !== 1 /* List */ && pairs.type !== 2 /* Vector */) {
              throw new Error(
                `unexpected token type: ${
                  pairs.type
                }, expected: list or vector`,
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
            // return EVAL(ast.list[2], letEnv);
            // noinspection TsLint
            env = letEnv;
            // noinspection TsLint
            ast = ast.list[2];
            continue; // continue to loop
          }
          case 'quote': {
            return ast.list[1];
          }
          case 'quasiquote': {
            ast = quasiquote(ast.list[1]);
            continue;
          }
          case 'do': {
            const list = ast.list.slice(1, -1);
            evalAST(new types_1.OwlList(list), env);
            ast = ast.list[ast.list.length - 1];
            continue;
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
              ast = sec;
            } else if (thr) {
              ast = thr;
            } else {
              ast = new types_1.OwlNil();
            }
            continue;
          }
          case 'fn*': {
            const [, sec, fnBody] = ast.list;
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
            return types_1.OwlFunction.fromLisp(EVAL, env, symbols, fnBody);
          }
        }
    }
    const res = evalAST(ast, env);
    const [fn, ...args] = res.list;
    if (fn.type !== 10 /* Function */) {
      throw new Error(`unexpected token: ${fn.type}, expected: function`);
    }
    if (fn.ast) {
      ast = fn.ast;
      env = fn.newEnv(args);
      continue;
    }
    return fn.func(...args);
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
        list.push(new types_1.OwlString(key));
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
replEnv.set(
  new types_1.OwlSymbol('eval'),
  types_1.OwlFunction.simpleFunc(ast => {
    if (!ast) {
      throw new Error('invalid argument.');
    }
    return EVAL(ast, replEnv);
  }),
);
replEnv.set(new types_1.OwlSymbol('*ARGV*'), new types_1.OwlList([]));
rep('(def! not (fn* (a) (if a false true)))');
/**
 * The load-file function does the following:
 *
 * Call slurp to read in a file by name. Surround the contents with "(do ...)" so that the whole file will be treated
 * as a single program AST (abstract syntax tree). Call read-string on the string returned from slurp. This uses the
 * reader to read/convert the file contents into owl data/AST. Call eval (the one in the REPL environment) on the AST
 * returned from read-string to "run" it.
 */
rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) ")")))))',
);
rep(
  '(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list \'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw "odd number of forms to cond")) (cons \'cond (rest (rest xs)))))))',
);
rep(
  '(defmacro! or (fn* (& xs) (if (empty? xs) nil (if (= 1 (count xs)) (first xs) `(let* (or_FIXME ~(first xs)) (if or_FIXME or_FIXME (or ~@(rest xs))))))))',
);
if (typeof process !== 'undefined' && 2 < process.argv.length) {
  replEnv.set(
    new types_1.OwlSymbol('*ARGV*'),
    new types_1.OwlList(
      process.argv.slice(3).map(s => new types_1.OwlString(s)),
    ),
  );
  rep(`(load-file "${process.argv[2]}")`);
  process.exit(0);
}
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
