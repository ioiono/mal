export type OwlType =
  | OwlList
  | OwlVector
  | OwlNumber
  | OwlString
  | OwlBoolean
  | OwlNil
  | OwlSymbol
  | OwlKeyword
  | OwlHashMap
  | OwlFunction;

export const enum Types {
  List = 1,
  Vector,
  Number,
  String,
  Boolean,
  Nil,
  Symbol,
  Keyword,
  HashMap,
  Function,
}

export const isListOrVector = (arg: OwlType): arg is OwlList | OwlVector =>
  arg.type === Types.List || arg.type === Types.Vector;
export const equals = (a: OwlType, b: OwlType): boolean => {
  // same object
  if (a === b) return true;

  // Nil
  if (a.type === Types.Nil && b.type === Types.Nil) {
    return true;
  }

  // List and Vector
  if (isListOrVector(a) && isListOrVector(b)) {
    if (a.list.length !== b.list.length) {
      return false;
    }
    for (let i = 0; i < a.list.length; i++) {
      if (!equals(a.list[i], b.list[i])) {
        return false;
      }
    }
    return true;
  }

  if (a.type !== b.type) return false;

  // Map
  if (a.type === Types.HashMap && b.type === Types.HashMap) {
    if (a.map.size !== b.map.size) {
      return false;
    }
    if (Object.keys(a.map).length !== Object.keys(b.map).length) {
      return false;
    }
    for (const [k, v] of a.map.entries()) {
      if (k.type !== Types.String && k.type !== Types.Keyword) {
        throw new Error(
          `unexpected symbol: ${k.type}, expected: string or keyword`,
        );
      }

      const bV = b.map.get(k);
      if (bV === undefined) return false;

      if (!equals(v, bV)) return false;
    }
  }

  //  Symbol
  if (a.type === Types.Symbol && b.type === Types.Symbol) {
    return Symbol.keyFor(a.val) === Symbol.keyFor(b.val);
  }

  //  Number
  //  String
  //  Boolean
  //  Keyword
  if (
    (a.type === Types.Number && b.type === Types.Number) ||
    (a.type === Types.String && b.type === Types.String) ||
    (a.type === Types.Boolean && b.type === Types.Boolean) ||
    (a.type === Types.Keyword && b.type === Types.Keyword)
  ) {
    return a.val === b.val;
  }

  //  Function,
  return false;
};

export class OwlList {
  public type: Types.List = Types.List;

  constructor(public list: OwlType[]) {}
}

export class OwlVector {
  public type: Types.Vector = Types.Vector;

  constructor(public list: OwlType[]) {}
}

export class OwlNumber {
  public type: Types.Number = Types.Number;

  constructor(public val: number) {}
}

export class OwlString {
  public type: Types.String = Types.String;

  constructor(public val: string) {}
}

export class OwlBoolean {
  public type: Types.Boolean = Types.Boolean;

  constructor(public val: boolean) {}
}

export class OwlNil {
  public type: Types.Nil = Types.Nil;
}

export class OwlSymbol {
  public type: Types.Symbol = Types.Symbol;
  public val: symbol;

  constructor(val: string) {
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    this.val = Symbol.for(val);
  }
}

export class OwlKeyword {
  public type: Types.Keyword = Types.Keyword;

  constructor(public val: string) {
    this.val = String.fromCharCode(0x29e) + this.val;
  }
}

export class OwlHashMap {
  public type: Types.HashMap = Types.HashMap;
  public map = new Map<OwlType, OwlType>();

  constructor(public list: OwlType[]) {
    if (list.length % 2 !== 0) {
      throw new Error('Odd number of hash map arguments');
    }
    for (let i = 0; i < list.length; i += 2) {
      const k = list[i];
      const v = list[i + 1];
      if (k.type !== Types.String && k.type !== Types.Keyword)
        throw new Error(`expected hash-map key string, got: ${k.type}`);
      this.map.set(k, v);
    }
  }
}

export class OwlFunction {
  public type: Types.Function = Types.Function;

  constructor(public func: (...args: any[]) => OwlType) {}
}
