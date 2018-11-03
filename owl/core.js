'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const types_1 = require('./types');
const printer_1 = require('./printer');
exports.ns = (() => {
  const funcs = {
    '+'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val + b.val);
    },
    '-'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val - b.val);
    },
    '*'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val * b.val);
    },
    '/'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val / b.val);
    },
    list(...args) {
      return new types_1.OwlList(args);
    },
    'list?'(arg) {
      return new types_1.OwlBoolean(arg.type === 1 /* List */);
    },
    'empty?'(arg) {
      if (!types_1.isListOrVector(arg)) return new types_1.OwlBoolean(false);
      return new types_1.OwlBoolean(arg.list.length === 0);
    },
    count(arg) {
      if (!types_1.isListOrVector(arg)) {
        return new types_1.OwlNumber(0);
      }
      return new types_1.OwlNumber(arg.list.length);
    },
    '='(a, b) {
      return new types_1.OwlBoolean(types_1.equals(a, b));
    },
    '<'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val < b.val);
    },
    '<='(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val <= b.val);
    },
    '>'(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val > b.val);
    },
    '>='(a, b) {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val >= b.val);
    },
    'pr-str'(...args) {
      return new types_1.OwlString(
        args.map(el => printer_1.prStr(el, true)).join(' '),
      );
    },
    prn(...args) {
      console.log(args.map(el => printer_1.prStr(el, true)).join(' '));
      return new types_1.OwlNil();
    },
    str(...args) {
      return new types_1.OwlString(
        args.map(el => printer_1.prStr(el, false)).join(''),
      );
    },
    println(...args) {
      console.log(args.map(el => printer_1.prStr(el, false)).join(' '));
      return new types_1.OwlNil();
    },
  };
  const map = new Map();
  Object.keys(funcs).map(key =>
    map.set(new types_1.OwlSymbol(key), new types_1.OwlFunction(funcs[key])),
  );
  return map;
})();
