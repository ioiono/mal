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
const fs = __importStar(require('fs'));
const printer_1 = require('./printer');
const reader_1 = require('./reader');
const types_1 = require('./types');
exports.ns = (() => {
  const funcs = {
    '+': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val + b.val);
    },
    '-': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val - b.val);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    '*': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val * b.val);
    },
    '/': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlNumber(a.val / b.val);
    },
    list: (...args) => new types_1.OwlList(args),
    'list?': arg => new types_1.OwlBoolean(arg.type === 1 /* List */),
    'empty?': arg => {
      if (!types_1.isListOrVector(arg)) return new types_1.OwlBoolean(false);
      return new types_1.OwlBoolean(arg.list.length === 0);
    },
    count: arg => {
      if (!types_1.isListOrVector(arg)) {
        return new types_1.OwlNumber(0);
      }
      return new types_1.OwlNumber(arg.list.length);
    },
    '=': (a, b) => new types_1.OwlBoolean(types_1.equals(a, b)),
    '<': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val < b.val);
    },
    '<=': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val <= b.val);
    },
    '>': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val > b.val);
    },
    '>=': (a, b) => {
      if (a.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new types_1.OwlBoolean(a.val >= b.val);
    },
    'pr-str': (...args) =>
      new types_1.OwlString(
        args.map(el => printer_1.prStr(el, true)).join(' '),
      ),
    prn: (...args) => {
      console.log(args.map(el => printer_1.prStr(el, true)).join(' '));
      return new types_1.OwlNil();
    },
    str: (...args) =>
      new types_1.OwlString(
        args.map(el => printer_1.prStr(el, false)).join(''),
      ),
    println: (...args) => {
      console.log(args.map(el => printer_1.prStr(el, false)).join(' '));
      return new types_1.OwlNil();
    },
    add: (...args) =>
      args.reduce(
        (a, b) => new types_1.OwlNumber(a.val + b.val),
        new types_1.OwlNumber(0),
      ),
    'read-string': str => {
      if (str.type !== 4 /* String */) {
        throw new Error(`unexpected symbol: ${str.type}, expected: string`);
      }
      return reader_1.readStr(str.val);
    },
    slurp: filename => {
      if (filename.type !== 4 /* String */) {
        throw new Error(
          `unexpected symbol: ${filename.type}, expected: string`,
        );
      }
      return new types_1.OwlString(fs.readFileSync(filename.val, 'UTF-8'));
    },
    atom: arg => new types_1.OwlAtom(arg),
    'atom?': arg => new types_1.OwlBoolean(arg.type === 11 /* Atom */),
    deref: arg => {
      if (arg.type !== 11 /* Atom */) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: atom`);
      }
      return arg.val;
    },
    'reset!': (atom, value) => {
      if (atom.type !== 11 /* Atom */) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      atom.val = value;
      return atom.val;
    },
    'swap!': (atom, func, ...args) => {
      if (atom.type !== 11 /* Atom */) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      if (func.type !== 10 /* Function */) {
        throw new Error(`unexpected symbol: ${func.type}, expected: function`);
      }
      atom.val = func.func(...[atom.val, ...args]);
      return atom.val;
    },
    cons: (arg, list) => {
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      return new types_1.OwlList([arg, ...list.list]);
    },
    concat: (...args) => {
      const lists = args.map(list => {
        if (!types_1.isListOrVector(list)) {
          throw new Error(
            `unexpected symbol: ${list.type}, expected: list or vector`,
          );
        }
        return list;
      });
      return new types_1.OwlList(lists.reduce((a, b) => a.concat(b.list), []));
    },
    nth: (list, idx) => {
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      if (idx.type !== 3 /* Number */) {
        throw new Error(`unexpected symbol: ${idx.type}, expected: number`);
      }
      const v = idx.val;
      if (v < 0 || v >= list.list.length) {
        throw new Error(`${v}:index out of range`);
      }
      return list.list[v];
    },
    first: list => {
      if (list.type === 6 /* Nil */) {
        return new types_1.OwlNil();
      }
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      // maybe []
      return list.list[0] || new types_1.OwlNil();
    },
    rest: list => {
      if (list.type === 6 /* Nil */) {
        return new types_1.OwlList([]);
      }
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      const [first, ...rest] = list.list;
      return new types_1.OwlList(rest);
    },
  };
  const map = new Map();
  Object.keys(funcs).map(key =>
    map.set(
      new types_1.OwlSymbol(key),
      types_1.OwlFunction.simpleFunc(funcs[key]),
    ),
  );
  return map;
})();
