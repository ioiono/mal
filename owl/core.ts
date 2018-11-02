import { OwlFunction, OwlNumber, OwlSymbol, OwlType, Types } from './types';

export const ns: Map<OwlSymbol, OwlFunction> = (() => {
  const funcs: { [symbol: string]: typeof OwlFunction.prototype.func } = {
    '+'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val + b.val);
    },
    '-'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val - b.val);
    },
    '*'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val * b.val);
    },
    '/'(a: OwlType, b: OwlType): OwlNumber {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val / b.val);
    },
  };
  const map = new Map<OwlSymbol, OwlFunction>();
  Object.keys(funcs).map(key =>
    map.set(new OwlSymbol(key), new OwlFunction(funcs[key])),
  );
  return map;
})();
