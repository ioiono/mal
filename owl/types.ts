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
