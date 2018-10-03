import {
  OwlBoolean,
  OwlList,
  OwlNumber,
  OwlString,
  OwlSymbol,
  OwlType,
  OwlVector,
  Types,
} from './types';

export const prStr = (val: OwlType): string => {
  switch (val.type) {
    case Types.List:
      return `(${val instanceof OwlList ? val.list.map(prStr).join(' ') : ''})`;
    case Types.Vector:
      return `[${
        val instanceof OwlVector ? val.list.map(prStr).join(' ') : ''
      }]`;
    case Types.Number:
      return val instanceof OwlNumber ? `${val.val}` : '';
    case Types.String:
      return `"${
        val instanceof OwlString
          ? val.val
              .replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
          : ''
      }"`;
    case Types.Boolean:
      return `${val instanceof OwlBoolean ? val.val : ''}`;
    case Types.Nil:
      return 'nil';
    case Types.Symbol:
      return `${val instanceof OwlSymbol ? Symbol.keyFor(val.val) : ''}`;
  }
};
