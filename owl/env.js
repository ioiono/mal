'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = new Map();
  }
  set(key, value) {
    // use OwlSymbol.val as [key] for map instead of key itself!
    // because (new OwlSymbol("+") !== new OwlSymbol("+")), as a result you cannot get value from key.
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    // As a result you can use this mechanism to get the correct value.
    this.data.set(key.val, value);
    return value;
  }
  find(key) {
    if (this.data.has(key.val)) return this;
    if (this.outer) return this.outer.find(key);
    return;
  }
  get(key) {
    const env = this.find(key);
    if (!env) {
      throw new Error(
        `environment not found for key: "${Symbol.keyFor(key.val)}"`,
      );
    }
    const res = env.data.get(key.val);
    if (!res)
      throw new Error(`value not found for key: "${Symbol.keyFor(key.val)}"`);
    return res;
  }
}
exports.Env = Env;
