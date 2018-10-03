'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const types_1 = require('./types');
exports.prStr = val => {
  switch (val.type) {
    case 1 /* List */:
      return `(${
        val instanceof types_1.OwlList
          ? val.list.map(exports.prStr).join(' ')
          : ''
      })`;
    case 2 /* Vector */:
      return `[${
        val instanceof types_1.OwlVector
          ? val.list.map(exports.prStr).join(' ')
          : ''
      }]`;
    case 3 /* Number */:
      return val instanceof types_1.OwlNumber ? `${val.val}` : '';
    case 4 /* String */:
      return `"${
        val instanceof types_1.OwlString
          ? val.val
              .replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
          : ''
      }"`;
    case 5 /* Boolean */:
      return `${val instanceof types_1.OwlBoolean ? val.val : ''}`;
    case 6 /* Nil */:
      return 'nil';
    case 7 /* Symbol */:
      return `${
        val instanceof types_1.OwlSymbol ? Symbol.keyFor(val.val) : ''
      }`;
  }
};
