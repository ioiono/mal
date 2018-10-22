import { OwlType, Types } from './types';

export const prStr = (val: OwlType, printReadably: boolean = true): string => {
  switch (val.type) {
    case Types.List:
      return `(${val.list.map(v => prStr(v, printReadably)).join(' ')})`;
    case Types.Vector:
      return `[${val.list.map(v => prStr(v, printReadably)).join(' ')}]`;
    case Types.Number:
      return `${val.val}`;
    case Types.String:
      return `"${val.val
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')}"`;
    case Types.Boolean:
      return `${val.val}`;
    case Types.Nil:
      return 'nil';
    case Types.Symbol:
      return `${Symbol.keyFor(val.val)}`;
    case Types.Keyword:
      return `:${val.val.substr(1)}`;
    case Types.HashMap:
      let result = '{';
      for (const [key, value] of val.map) {
        if (result !== '{') {
          result += ' ';
        }
        result += `${prStr(key, printReadably)} ${prStr(value, printReadably)}`;
      }
      result += '}';
      return result;
    case Types.Function:
      throw new Error(`invalid state`);
  }
};
