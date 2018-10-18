import { readline } from './node_readline';

// READ
const READ = (str: string): any => str;

// EVAL
const EVAL = (ast: any, _env?: any): any => ast;

// PRINT
const PRINT = (exp: any): string => exp;

const rep = (str: string): string => PRINT(EVAL(READ(str)));
while (true) {
  const line = readline('user> ');
  if (!line) break;
  console.log(rep(line));
}
