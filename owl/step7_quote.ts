import * as core from './core';
import { Env } from './env';
import { readline } from './node_readline';
import { prStr } from './printer';
import { BlankException, readStr } from './reader';
import {
  isListOrVector,
  OwlFunction,
  OwlHashMap,
  OwlList,
  OwlNil,
  OwlString,
  OwlSymbol,
  OwlType,
  OwlVector,
  Types,
} from './types';

// READ
const READ = (str: string): OwlType => {
  return readStr(str);
};

const isPair = (ast: OwlType): ast is OwlList | OwlVector =>
  isListOrVector(ast) && ast.list.length > 0;
const quasiquote = (ast: OwlType): OwlType => {
  if (!isPair(ast)) {
    return new OwlList([new OwlSymbol('quote'), ast]);
  }
  const [fir, sec] = ast.list;
  if (fir.type === Types.Symbol && Symbol.keyFor(fir.val) === 'unquote') {
    return sec;
  }
  if (isPair(fir)) {
    const [a, b] = fir.list;
    if (a.type === Types.Symbol && Symbol.keyFor(a.val) === 'splice-unquote') {
      return new OwlList([
        new OwlSymbol('concat'),
        b,
        quasiquote(new OwlList(ast.list.slice(1))),
      ]);
    }
  }

  return new OwlList([
    new OwlSymbol('cons'),
    quasiquote(fir),
    quasiquote(new OwlList(ast.list.slice(1))),
  ]);
};

// EVAL
const EVAL = (ast: OwlType, env: Env): OwlType => {
  loop: while (true) {
    if (!ast) throw new Error('invalid syntax');
    if (ast.type !== Types.List) {
      return evalAST(ast, env);
    }
    if (ast.list.length === 0) {
      return ast;
    }

    const first = ast.list[0];

    switch (first.type) {
      case Types.Symbol:
        switch (Symbol.keyFor(first.val)) {
          case 'def!': {
            const [, key, value] = ast.list;
            if (key.type !== Types.Symbol) {
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
            const letEnv = new Env(env);
            const pairs = ast.list[1];
            if (pairs.type !== Types.List && pairs.type !== Types.Vector) {
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
              if (key.type !== Types.Symbol) {
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
            continue loop; // continue to loop
          }
          case 'quote': {
            return ast.list[1];
          }
          case 'quasiquote': {
            ast = quasiquote(ast.list[1]);
            continue loop;
          }
          case 'do': {
            const list = ast.list.slice(1, -1);
            evalAST(new OwlList(list), env);
            ast = ast.list[ast.list.length - 1];
            continue loop;
          }
          case 'if': {
            const [, fir, sec, thr] = ast.list;
            const r = EVAL(fir, env);
            if (
              !(
                (r.type === Types.Boolean && r.val === false) ||
                r.type === Types.Nil
              )
            ) {
              ast = sec;
            } else if (thr) {
              ast = thr;
            } else {
              ast = new OwlNil();
            }
            continue loop;
          }
          case 'fn*': {
            const [, sec, fnBody] = ast.list;
            if (!isListOrVector(sec)) {
              throw new Error(
                `unexpected return type: ${sec.type}, expected: list or vector`,
              );
            }

            const symbols = sec.list.map(el => {
              if (el.type !== Types.Symbol) {
                throw new Error(
                  `unexpected return type: ${el.type}, expected: symbol`,
                );
              }
              return el;
            });

            return OwlFunction.fromLisp(EVAL, env, symbols, fnBody);
          }
        }
    }
    const res = evalAST(ast, env) as OwlList;
    const [fn, ...args] = res.list;
    if (fn.type !== Types.Function) {
      throw new Error(`unexpected token: ${fn.type}, expected: function`);
    }
    if (fn.ast) {
      ast = fn.ast;
      env = fn.newEnv(args);
      continue loop;
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
const evalAST = (ast: OwlType, env: Env): OwlType => {
  switch (ast.type) {
    case Types.Symbol:
      const find = env.get(ast);
      if (!find) {
        throw new Error(`unknown symbol: ${Symbol.keyFor(ast.val)}`);
      }
      return find;
    case Types.List:
      return new OwlList(ast.list.map(el => EVAL(el, env)));
    case Types.Vector:
      return new OwlVector(ast.list.map(el => EVAL(el, env)));
    case Types.HashMap:
      const list: OwlType[] = [];
      for (const [key, value] of ast.map.entries()) {
        list.push(key);
        list.push(EVAL(value, env));
      }
      return new OwlHashMap(list);

    default:
      return ast;
  }
};

// PRINT
const PRINT = prStr;
// noinspection TsLint
const replEnv = new Env();

const rep = (str: string): string => PRINT(EVAL(READ(str), replEnv));

core.ns.forEach((v, k) => {
  replEnv.set(k, v);
});

replEnv.set(
  new OwlSymbol('eval'),
  OwlFunction.simpleFunc(ast => {
    if (!ast) {
      throw new Error('invalid argument.');
    }
    return EVAL(ast, replEnv);
  }),
);
replEnv.set(new OwlSymbol('*ARGV*'), new OwlList([]));
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

if (typeof process !== 'undefined' && 2 < process.argv.length) {
  replEnv.set(
    new OwlSymbol('*ARGV*'),
    new OwlList(process.argv.slice(3).map(s => new OwlString(s))),
  );
  rep(`(load-file "${process.argv[2]}")`);
  process.exit(0);
}
while (true) {
  const line = readline('user> ');
  if (line == null || line === '(exit)') {
    break;
  }
  if (line === '') {
    continue;
  }
  try {
    console.log(rep(line));
  } catch (exc) {
    if (exc instanceof BlankException) {
      continue;
    }
    if (exc.stack) {
      console.log(exc.stack);
    } else {
      console.log(`Error: ${exc}`);
    }
  }
}
