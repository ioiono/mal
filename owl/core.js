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
    throw: arg => {
      throw arg;
    },
    apply: (fn, ...args) => {
      if (fn.type !== 10 /* Function */) {
        throw new Error(`unexpected symbol: ${fn.type}, expected: function`);
      }
      const list = args[args.length - 1];
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      const res = [...args.slice(0, -1), ...list.list];
      return fn.func(...res);
    },
    map: (fn, list) => {
      if (fn.type !== 10 /* Function */) {
        throw new Error(`unexpected symbol: ${fn.type}, expected: function`);
      }
      if (!types_1.isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      return new types_1.OwlList(list.list.map(x => fn.func(x)));
    },
    'nil?': arg => new types_1.OwlBoolean(arg.type === 6 /* Nil */),
    'true?': arg =>
      new types_1.OwlBoolean(arg.type === 5 /* Boolean */ && arg.val),
    'false?': arg =>
      new types_1.OwlBoolean(arg.type === 5 /* Boolean */ && !arg.val),
    'symbol?': arg => new types_1.OwlBoolean(arg.type === 7 /* Symbol */),
    symbol: arg => {
      if (arg.type !== 4 /* String */) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: string`);
      }
      return new types_1.OwlSymbol(arg.val);
    },
    keyword: arg => {
      if (arg.type === 8 /* Keyword */) {
        return arg;
      }
      if (arg.type !== 4 /* String */) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: string`);
      }
      return new types_1.OwlKeyword(arg.val);
    },
    'keyword?': arg => new types_1.OwlBoolean(arg.type === 8 /* Keyword */),
    vector: (...args) => new types_1.OwlVector(args),
    'vector?': arg => new types_1.OwlBoolean(arg.type === 2 /* Vector */),
    'hash-map': (...args) => new types_1.OwlHashMap(args),
    'map?': arg => new types_1.OwlBoolean(arg.type === 9 /* HashMap */),
    assoc: (m, ...args) => {
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.assoc(args);
    },
    dissoc: (m, ...args) => {
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.dissoc(args);
    },
    get: (m, key) => {
      if (m.type === 6 /* Nil */) {
        return new types_1.OwlNil();
      }
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      if (key.type !== 4 /* String */ && key.type !== 8 /* Keyword */) {
        throw new Error(
          `unexpected symbol: ${key.type}, expected: string or keyword`,
        );
      }
      return m.get(key);
    },
    'contains?': (m, key) => {
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      if (key.type !== 4 /* String */ && key.type !== 8 /* Keyword */) {
        throw new Error(
          `unexpected symbol: ${key.type}, expected: string or keyword`,
        );
      }
      return new types_1.OwlBoolean(m.contains(key));
    },
    keys: m => {
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.keys();
    },
    vals: m => {
      if (m.type !== 9 /* HashMap */) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.vals();
    },
    'sequential?': arg => new types_1.OwlBoolean(types_1.isListOrVector(arg)),
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
