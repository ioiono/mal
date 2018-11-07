import * as fs from 'fs';
import { prStr } from './printer';
import { readStr } from './reader';
import {
  equals,
  isListOrVector,
  OwlAtom,
  OwlBoolean,
  OwlFunction,
  OwlList,
  OwlNil,
  OwlNumber,
  OwlString,
  OwlSymbol,
  OwlType,
  OwlVector,
  Types,
} from './types';

export const ns: Map<OwlSymbol, OwlFunction> = (() => {
  const funcs: { [symbol: string]: typeof OwlFunction.prototype.func } = {
    '+': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val + b.val);
    },
    '-': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val - b.val);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    '*': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val * b.val);
    },
    '/': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val / b.val);
    },
    list: (...args: OwlType[]): OwlList => new OwlList(args),
    'list?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.List),
    'empty?': (arg: OwlType): OwlBoolean => {
      if (!isListOrVector(arg)) return new OwlBoolean(false);
      return new OwlBoolean(arg.list.length === 0);
    },
    count: (arg: OwlType): OwlNumber => {
      if (!isListOrVector(arg)) {
        return new OwlNumber(0);
      }
      return new OwlNumber(arg.list.length);
    },
    '=': (a: OwlType, b: OwlType): OwlBoolean => new OwlBoolean(equals(a, b)),
    '<': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val < b.val);
    },
    '<=': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val <= b.val);
    },
    '>': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val > b.val);
    },
    '>=': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val >= b.val);
    },
    'pr-str': (...args: OwlType[]): OwlString =>
      new OwlString(args.map(el => prStr(el, true)).join(' ')),
    prn: (...args: OwlType[]): OwlNil => {
      console.log(args.map(el => prStr(el, true)).join(' '));
      return new OwlNil();
    },
    str: (...args: OwlType[]): OwlString =>
      new OwlString(args.map(el => prStr(el, false)).join('')),
    println: (...args: OwlType[]): OwlNil => {
      console.log(args.map(el => prStr(el, false)).join(' '));
      return new OwlNil();
    },
    add: (...args: OwlNumber[]): OwlNumber =>
      args.reduce((a, b) => new OwlNumber(a.val + b.val), new OwlNumber(0)),
    'read-string': (str: OwlType): OwlType => {
      if (str.type !== Types.String) {
        throw new Error(`unexpected symbol: ${str.type}, expected: string`);
      }
      return readStr(str.val);
    },
    slurp: (filename: OwlType): OwlString => {
      if (filename.type !== Types.String) {
        throw new Error(
          `unexpected symbol: ${filename.type}, expected: string`,
        );
      }
      return new OwlString(fs.readFileSync(filename.val, 'UTF-8'));
    },
    atom: (arg: OwlType): OwlAtom => new OwlAtom(arg),
    'atom?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Atom),
    deref: (arg: OwlType): OwlType => {
      if (arg.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: atom`);
      }
      return arg.val;
    },
    'reset!': (atom: OwlType, value: OwlType): OwlType => {
      if (atom.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      atom.val = value;
      return atom.val;
    },
    'swap!': (atom: OwlType, func: OwlType, ...args: OwlType[]): OwlType => {
      if (atom.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      if (func.type !== Types.Function) {
        throw new Error(`unexpected symbol: ${func.type}, expected: function`);
      }
      atom.val = func.func(...[atom.val, ...args]);
      return atom.val;
    },
    cons: (arg: OwlType, list: OwlType): OwlList => {
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      return new OwlList([arg, ...list.list]);
    },
    concat: (...args: OwlType[]): OwlList => {
      const lists = args.map(list => {
        if (!isListOrVector(list)) {
          throw new Error(
            `unexpected symbol: ${list.type}, expected: list or vector`,
          );
        }
        return list;
      });
      return new OwlList(
        lists.reduce((a, b) => a.concat(b.list), [] as OwlType[]),
      );
    },
  };
  const map = new Map<OwlSymbol, OwlFunction>();
  Object.keys(funcs).map(key =>
    map.set(new OwlSymbol(key), OwlFunction.simpleFunc(funcs[key])),
  );
  return map;
})();
