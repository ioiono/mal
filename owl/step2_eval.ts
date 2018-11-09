import { readline } from './node_readline';
import { prStr } from './printer';
import { BlankException, readStr } from './reader';
import {
  OwlFunction,
  OwlHashMap,
  OwlList,
  OwlNumber,
  OwlString,
  OwlType,
  OwlVector,
  Types,
} from './types';

interface OwlEnvironment {
  [key: string]: OwlFunction;
}

// READ
const READ = (str: string): OwlType => {
  return readStr(str);
};

// EVAL
const EVAL = (ast: OwlType, env: OwlEnvironment): OwlType => {
  if (ast.type === Types.List) {
    if (ast.list.length === 0) {
      return ast;
    } else {
      const res = evalAST(ast, env) as OwlList;
      const [first, ...rest] = res.list;
      if (first.type !== Types.Function) {
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
const evalAST = (ast: OwlType, env: OwlEnvironment): OwlType => {
  switch (ast.type) {
    case Types.Symbol:
      const find = replEnv[Symbol.keyFor(ast.val)!];
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
        list.push(new OwlString(key));
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
const replEnv: OwlEnvironment = {
  '+': OwlFunction.simpleFunc(
    (a?: OwlNumber, b?: OwlNumber) => new OwlNumber(a!.val + b!.val),
  ),
  '-': OwlFunction.simpleFunc(
    (a?: OwlNumber, b?: OwlNumber) => new OwlNumber(a!.val - b!.val),
  ),
  '*': OwlFunction.simpleFunc(
    (a?: OwlNumber, b?: OwlNumber) => new OwlNumber(a!.val * b!.val),
  ),
  '/': OwlFunction.simpleFunc(
    (a?: OwlNumber, b?: OwlNumber) => new OwlNumber(a!.val / b!.val),
  ),
};

const rep = (str: string): string => PRINT(EVAL(READ(str), replEnv));
while (true) {
  const line = readline('user> ');
  if (line == null || line === '(owl-bye)') {
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
