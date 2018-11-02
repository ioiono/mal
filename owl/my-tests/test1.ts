import { prStr } from '../printer';
import { readStr } from '../reader';
import { OwlList, OwlNumber, OwlSymbol } from '../types';

// const str: string = '{"abc" 1}';
const str: string = '(+  1)';
// const str: string = '^{"a" 1} [1 2 3]';
// console.log(prStr(readStr("(+    1 2 )")));
// console.log(readStr("(+    1 2 )"));

console.log(prStr(readStr(str)));
console.log(JSON.stringify(new OwlNumber(233)));
console.log(new OwlNumber(233));
console.log(JSON.stringify(new OwlSymbol('let*')));
console.log(new OwlSymbol('let*'));
console.log(JSON.stringify(new OwlList([])));
console.log(new OwlList([]));
