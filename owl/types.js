'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const env_1 = require('./env');
exports.isOwlType = arg => !!arg.type;
exports.isListOrVector = arg =>
  arg.type === 1 /* List */ || arg.type === 2 /* Vector */;
exports.equals = (a, b) => {
  // same object
  if (a === b) return true;
  // Nil
  if (a.type === 6 /* Nil */ && b.type === 6 /* Nil */) {
    return true;
  }
  // List and Vector
  if (exports.isListOrVector(a) && exports.isListOrVector(b)) {
    if (a.list.length !== b.list.length) {
      return false;
    }
    for (let i = 0; i < a.list.length; i++) {
      if (!exports.equals(a.list[i], b.list[i])) {
        return false;
      }
    }
    return true;
  }
  if (a.type !== b.type) return false;
  // Map
  if (a.type === 9 /* HashMap */ && b.type === 9 /* HashMap */) {
    if (a.map.size !== b.map.size) {
      return false;
    }
    if (Object.keys(a.map).length !== Object.keys(b.map).length) {
      return false;
    }
    for (const [k, v] of a.entries()) {
      const bV = b.get(k);
      if (bV === undefined) return false;
      if (!exports.equals(v, bV)) return false;
    }
    return true;
  }
  //  Symbol
  if (a.type === 7 /* Symbol */ && b.type === 7 /* Symbol */) {
    return Symbol.keyFor(a.val) === Symbol.keyFor(b.val);
  }
  //  Number
  //  String
  //  Boolean
  //  Keyword
  if (
    (a.type === 3 /* Number */ && b.type === 3) /* Number */ ||
    (a.type === 4 /* String */ && b.type === 4) /* String */ ||
    (a.type === 5 /* Boolean */ && b.type === 5) /* Boolean */ ||
    (a.type === 8 /* Keyword */ && b.type === 8) /* Keyword */
  ) {
    return a.val === b.val;
  }
  //  Function,
  return false;
};
class OwlList {
  constructor(list) {
    this.list = list;
    this.type = 1 /* List */;
  }
  withMeta(meta) {
    const val = new OwlList(this.list);
    val.meta = meta;
    return val;
  }
}
exports.OwlList = OwlList;
class OwlVector {
  constructor(list) {
    this.list = list;
    this.type = 2 /* Vector */;
  }
  withMeta(meta) {
    const val = new OwlVector(this.list);
    val.meta = meta;
    return val;
  }
}
exports.OwlVector = OwlVector;
class OwlNumber {
  constructor(val) {
    this.val = val;
    this.type = 3 /* Number */;
  }
  withMeta(meta) {
    const num = new OwlNumber(this.val);
    num.meta = meta;
    return num;
  }
}
exports.OwlNumber = OwlNumber;
class OwlString {
  constructor(val) {
    this.val = val;
    this.type = 4 /* String */;
  }
  withMeta(meta) {
    const val = new OwlString(this.val);
    val.meta = meta;
    return val;
  }
}
exports.OwlString = OwlString;
class OwlBoolean {
  constructor(val) {
    this.val = val;
    this.type = 5 /* Boolean */;
  }
  withMeta(meta) {
    const val = new OwlBoolean(this.val);
    val.meta = meta;
    return val;
  }
}
exports.OwlBoolean = OwlBoolean;
class OwlNil {
  constructor() {
    this.type = 6 /* Nil */;
  }
  withMeta(_meta) {
    throw new Error(`not supported`);
  }
}
exports.OwlNil = OwlNil;
class OwlSymbol {
  constructor(val) {
    this.type = 7 /* Symbol */;
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    this.val = Symbol.for(val);
  }
  withMeta(_meta) {
    throw new Error(`not supported`);
  }
}
exports.OwlSymbol = OwlSymbol;
class OwlKeyword {
  constructor(val) {
    this.val = val;
    this.type = 8 /* Keyword */;
    this.val = String.fromCharCode(0x29e) + this.val;
  }
  withMeta(_meta) {
    throw new Error(`not supported`);
  }
}
exports.OwlKeyword = OwlKeyword;
class OwlHashMap {
  constructor(list) {
    this.list = list;
    this.type = 9 /* HashMap */;
    this.map = new Map();
    if (list.length % 2 !== 0) {
      throw new Error('Odd number of hash map arguments');
    }
    for (let i = 0; i < list.length; i += 2) {
      const k = list[i];
      const v = list[i + 1];
      if (k.type !== 4 /* String */ && k.type !== 8 /* Keyword */) {
        throw new Error(
          `unexpected symbol: ${k.type}, expected: string or keyword`,
        );
      }
      this.map.set(k.val, v);
    }
  }
  assoc(args) {
    const list = [];
    this.map.forEach((v, k) => {
      list.push(new OwlString(k));
      list.push(v);
    });
    return new OwlHashMap([...list, ...args]);
  }
  dissoc(args) {
    const mapCopy = this.assoc([]);
    const list = [];
    args.map(arg => {
      if (arg.type !== 4 /* String */ && arg.type !== 8 /* Keyword */) {
        throw new Error(
          `unexpected symbol: ${arg.type}, expected: keyword or string`,
        );
      }
      mapCopy.map.delete(arg.val);
    });
    return mapCopy;
  }
  get(key) {
    return this.map.get(key.val) || new OwlNil();
  }
  contains(key) {
    return this.map.has(key.val);
  }
  keys() {
    return new OwlList(
      [...this.map.keys()].map(
        k =>
          k[0] === String.fromCharCode(0x29e)
            ? new OwlKeyword(k.substr(1))
            : new OwlString(k),
      ),
    );
  }
  vals() {
    return new OwlList([...this.map.values()]);
  }
  entries() {
    const list = [];
    this.map.forEach((v, k) => {
      const key =
        k[0] === String.fromCharCode(0x29e)
          ? new OwlKeyword(k.substr(1))
          : new OwlString(k);
      list.push([key, v]);
    });
    return list;
  }
  withMeta(meta) {
    const map = this.assoc([]);
    map.meta = meta;
    return map;
  }
}
exports.OwlHashMap = OwlHashMap;
class OwlFunction {
  constructor() {
    this.type = 10 /* Function */;
  }
  static simpleFunc(func) {
    const fn = new OwlFunction();
    fn.func = func;
    fn.isMacro = false;
    return fn;
  }
  static fromLisp(EVAL, env, params, fnBody) {
    const fn = new OwlFunction();
    fn.func = (...args) =>
      EVAL(
        fnBody,
        new env_1.Env(
          env,
          params,
          args.map(x => {
            if (!x) {
              throw new Error(`invalid argument`);
            }
            return x;
          }),
        ),
      );
    fn.env = env;
    fn.params = params;
    fn.ast = fnBody;
    fn.isMacro = false;
    return fn;
  }
  newEnv(args) {
    return new env_1.Env(this.env, this.params, args);
  }
  withMeta(meta) {
    const fn = new OwlFunction();
    fn.func = this.func;
    fn.ast = this.ast;
    fn.env = this.env;
    fn.params = this.params;
    fn.isMacro = this.isMacro;
    fn.meta = meta;
    return fn;
  }
}
exports.OwlFunction = OwlFunction;
class OwlAtom {
  constructor(val) {
    this.val = val;
    this.type = 11 /* Atom */;
  }
  withMeta(meta) {
    const val = new OwlAtom(this.val);
    val.meta = meta;
    return val;
  }
}
exports.OwlAtom = OwlAtom;
