'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.prStr = (val, printReadably = true) => {
  switch (val.type) {
    case 1 /* List */:
      return `(${val.list
        .map(v => exports.prStr(v, printReadably))
        .join(' ')})`;
    case 2 /* Vector */:
      return `[${val.list
        .map(v => exports.prStr(v, printReadably))
        .join(' ')}]`;
    case 3 /* Number */:
      return `${val.val}`;
    case 4 /* String */:
      return `"${val.val
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')}"`;
    case 5 /* Boolean */:
      return `${val.val}`;
    case 6 /* Nil */:
      return 'nil';
    case 7 /* Symbol */:
      return `${Symbol.keyFor(val.val)}`;
    case 8 /* Keyword */:
      return `:${val.val.substr(1)}`;
    case 9 /* HashMap */:
      let result = '{';
      for (const [key, value] of val.map) {
        if (result !== '{') {
          result += ' ';
        }
        result += `${exports.prStr(key, printReadably)} ${exports.prStr(
          value,
          printReadably,
        )}`;
      }
      result += '}';
      return result;
  }
};
