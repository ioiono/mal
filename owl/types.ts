export type OwlType =
  | OwlList
  | OwlVector
  | OwlNumber
  | OwlString
  | OwlBoolean
  | OwlNil
  | OwlSymbol;

export const enum Types {
  List = 1,
  Vector,
  Number,
  String,
  Boolean,
  Nil,
  Symbol,
}

export class OwlList {
  public type: Types = Types.List;

  constructor(public list: OwlType[]) {}
}

export class OwlVector {
  public type: Types = Types.Vector;

  constructor(public list: OwlType[]) {}
}

export class OwlNumber {
  public type: Types = Types.Number;

  constructor(public val: number) {}
}

export class OwlString {
  public type: Types = Types.String;

  constructor(public val: string) {}
}

export class OwlBoolean {
  public type: Types = Types.Boolean;

  constructor(public val: boolean) {}
}

export class OwlNil {
  public type: Types = Types.Nil;
}

export class OwlSymbol {
  public type: Types = Types.Symbol;
  public val: symbol;

  constructor(val: string) {
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    this.val = Symbol.for(val);
  }
}
