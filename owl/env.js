'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var types_1 = require('./types');
var Env = /** @class */ (function() {
  function Env(outer, binds, exprs) {
    if (binds === void 0) {
      binds = [];
    }
    if (exprs === void 0) {
      exprs = [];
    }
    this.outer = outer;
    this.data = new Map();
    for (var i = 0; i < binds.length; i++) {
      var sym = binds[i];
      if (Symbol.keyFor(sym.val) === '&') {
        this.set(binds[i + 1], new types_1.OwlList(exprs.slice(i)));
        break;
      }
      this.set(sym, exprs[i]);
    }
  }
  Env.prototype.set = function(key, value) {
    // use OwlSymbol.val as [key] for map instead of key itself!
    // because (new OwlSymbol("+") !== new OwlSymbol("+")), as a result you cannot get value from key.
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    // As a result you can use this mechanism to get the correct value.
    this.data.set(key.val, value);
    return value;
  };
  Env.prototype.find = function(key) {
    if (this.data.has(key.val)) return this;
    if (this.outer) return this.outer.find(key);
    return;
  };
  Env.prototype.get = function(key) {
    var env = this.find(key);
    if (!env) {
      throw new Error(
        'environment not found for key: "' + Symbol.keyFor(key.val) + '"',
      );
    }
    var res = env.data.get(key.val);
    if (!res)
      throw new Error(
        'value not found for key: "' + Symbol.keyFor(key.val) + '"',
      );
    return res;
  };
  return Env;
})();
exports.Env = Env;
