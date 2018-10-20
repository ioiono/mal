import { prStr } from '../printer';
import { readStr } from '../reader';

// const str: string = '{"abc" 1}';
const str: string = '{  :a  {:b   {  :cde     3   }  }}';
// const str: string = '^{"a" 1} [1 2 3]';
// console.log(prStr(readStr("(+    1 2 )")));
// console.log(readStr("(+    1 2 )"));

console.log(prStr(readStr(str)));
