import {
  equals,
  isListOrVector,
  OwlBoolean,
  OwlFunction,
  OwlList,
  OwlNil,
  OwlNumber,
  OwlString,
  OwlSymbol,
  OwlType,
  Types,
} from './types';
import { prStr } from './printer';

export const ns: Map<OwlSymbol, OwlFunction> = (() => {
  const funcs: { [symbol: string]: typeof OwlFunction.prototype.func } = {
    '+'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val + b.val);
    },
    '-'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val - b.val);
    },
    '*'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val * b.val);
    },
    '/'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val / b.val);
    },
    list(...args: OwlType[]): OwlList {
      return new OwlList(args);
    },
    'list?'(arg: OwlType): OwlBoolean {
      return new OwlBoolean(arg.type === Types.List);
    },
    'empty?'(arg: OwlType): OwlBoolean {
      if (!isListOrVector(arg)) return new OwlBoolean(false);
      return new OwlBoolean(arg.list.length === 0);
    },
    count(arg: OwlType): OwlNumber {
      if (!isListOrVector(arg)) {
        return new OwlNumber(0);
      }
      return new OwlNumber(arg.list.length);
    },
    '='(a: OwlType, b: OwlType): OwlBoolean {
      return new OwlBoolean(equals(a, b));
    },
    '<'(a: OwlType, b: OwlType): OwlBoolean {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val < b.val);
    },
    '<='(a: OwlType, b: OwlType): OwlBoolean {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val <= b.val);
    },
    '>'(a: OwlType, b: OwlType): OwlBoolean {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val > b.val);
    },
    '>='(a: OwlType, b: OwlType): OwlBoolean {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val >= b.val);
    },
    'pr-str'(...args: OwlType[]): OwlString {
      return new OwlString(args.map(el => prStr(el, true)).join(' '));
    },
    prn(...args: OwlType[]): OwlNil {
      console.log(args.map(el => prStr(el, true)).join(' '));
      return new OwlNil();
    },
    str(...args: OwlType[]): OwlString {
      return new OwlString(args.map(el => prStr(el, false)).join(''));
    },
    println(...args: OwlType[]): OwlNil {
      console.log(args.map(el => prStr(el, false)).join(' '));
      return new OwlNil();
    },
  };
  const map = new Map<OwlSymbol, OwlFunction>();
  Object.keys(funcs).map(key =>
    map.set(new OwlSymbol(key), new OwlFunction(funcs[key])),
  );
  return map;
})();
