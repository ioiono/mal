'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const types_1 = require('./types');
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
  };
  const map = new Map();
  Object.keys(funcs).map(key =>
    map.set(new types_1.OwlSymbol(key), new types_1.OwlFunction(funcs[key])),
  );
  return map;
})();
