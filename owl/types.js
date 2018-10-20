'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class OwlList {
  constructor(list) {
    this.list = list;
    this.type = 1 /* List */;
  }
}
exports.OwlList = OwlList;
class OwlVector {
  constructor(list) {
    this.list = list;
    this.type = 2 /* Vector */;
  }
}
exports.OwlVector = OwlVector;
class OwlNumber {
  constructor(val) {
    this.val = val;
    this.type = 3 /* Number */;
  }
}
exports.OwlNumber = OwlNumber;
class OwlString {
  constructor(val) {
    this.val = val;
    this.type = 4 /* String */;
  }
}
exports.OwlString = OwlString;
class OwlBoolean {
  constructor(val) {
    this.val = val;
    this.type = 5 /* Boolean */;
  }
}
exports.OwlBoolean = OwlBoolean;
class OwlNil {
  constructor() {
    this.type = 6 /* Nil */;
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
}
exports.OwlSymbol = OwlSymbol;
class OwlKeyword {
  constructor(val) {
    this.val = val;
    this.type = 8 /* Keyword */;
    this.val = String.fromCharCode(0x29e) + this.val;
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
      if (k.type !== 4 /* String */ && k.type !== 8 /* Keyword */)
        throw new Error(`expected hash-map key string, got: ${k.type}`);
      this.map.set(k, v);
    }
  }
}
exports.OwlHashMap = OwlHashMap;
