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
