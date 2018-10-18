import { prStr } from '../printer';
import { readStr } from '../reader';

const str: string = ';';
// console.log(prStr(readStr("(+    1 2 )")));
// console.log(readStr("(+    1 2 )"));

console.log(prStr(readStr(str)));
