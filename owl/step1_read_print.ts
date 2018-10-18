import { readline } from './node_readline';
import { prStr } from './printer';
import { readStr, BlankException } from './reader';
import { OwlType } from './types';

// READ
const READ = (str: string): OwlType => {
  return readStr(str);
};

// EVAL
const EVAL = (ast: any, _env?: any): any => ast;

// PRINT
const PRINT = prStr;

const rep = (str: string): string => PRINT(EVAL(READ(str)));
while (true) {
  const line = readline('user> ');
  if (line == null) {
    break;
  }
  if (line === '') {
    continue;
  }
  try {
    console.log(rep(line));
  } catch (exc) {
    if (exc instanceof BlankException) {
      continue;
    }
    if (exc.stack) {
      console.log(exc.stack);
    } else {
      console.log(`Error: ${exc}`);
    }
  }
}
