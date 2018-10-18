'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const types_1 = require('./types');
class BlankException extends Error {}
exports.BlankException = BlankException;
/**
 *  This object will store the tokens and a position.
 *  The Reader object will have two methods: next and peek.
 *  next(): string => returns the token at the current position and increments the position.
 *  peek(): string => just returns the token at the current position.
 */
class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }
  next() {
    const ret = this.peek();
    this.position += 1;
    return ret;
  }
  peek() {
    return this.tokens[this.position];
  }
}
/**
 * This function will look at the contents of the token and return the appropriate scalar (simple/single) data type
 * value.
 * @param reader
 */
const readAtom = reader => {
  const token = reader.next();
  if (/^-?[0-9]+$/.test(token)) {
    return new types_1.OwlNumber(Number.parseInt(token, 10));
  }
  if (/^-?[0-9]\.[0-9]+$/.test(token)) {
    return new types_1.OwlNumber(Number.parseFloat(token));
  }
  if (token[0] === '"') {
    return new types_1.OwlString(
      token
        .slice(1, token.length - 1)
        .replace(/\\(.)/g, (_, c) => (c === 'n' ? '\n' : c)),
    );
  }
  switch (token) {
    case 'nil':
      return new types_1.OwlNil();
    case 'true':
      return new types_1.OwlBoolean(true);
    case 'false':
      return new types_1.OwlBoolean(false);
  }
  return new types_1.OwlSymbol(token);
};
/**
 * This function will peek at the first token in the Reader object and switch on the first character of that token. If
 * the character is a left paren then read_list is called with the Reader object. Otherwise, read_atom is called with
 * the Reader Object.
 * @param reader
 */
const readForm = reader => {
  const token = reader.peek();
  switch (token) {
    case '(':
      return readList(reader);
    case '[':
      return readVector(reader);
    default:
      return readAtom(reader);
  }
};
/**
 * This function will take a single string and return an array/list of all the tokens (strings) in it.
 *
 * [\s,]*: Matches any number of whitespaces or commas. This is not captured so it will be ignored and not tokenized.
 *
 * ~@: Captures the special two-characters ~@ (tokenized).
 *
 * [\[\]{}()'`~^@]: Captures any special single character, one of []{}()'`~^@ (tokenized).
 *
 * "(?:\\.|[^\\"])*": Starts capturing at a double-quote and stops at the next double-quote unless it was proceeded
 * by a backslash in which case it includes it until the next double-quote (tokenized).
 *
 * ;.*: Captures any sequence of characters starting with ; (tokenized).
 *
 * [^\s\[\]{}('"`,;)]*: Captures a sequence of zero or more non special characters (e.g. symbols, numbers, "true",
 * "false", and "nil") and is sort of the inverse of the one above that captures special characters (tokenized).
 *
 * @param input: string
 */
const tokenizer = input => {
  if (!input || input[0] === ';') return [];
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const tokens = [];
  while (true) {
    const matches = re.exec(input);
    if (!matches) break;
    const match = matches[1];
    if (match === '') {
      break;
    }
    if (match[0] !== ';') {
      // Ignore comments.
      tokens.push(match);
    }
  }
  return tokens;
};
/**
 * This function will call tokenizer and then create a new Reader object instance with the tokens.
 * @param input
 */
function readStr(input) {
  const tokens = tokenizer(input);
  if (tokens.length === 0) {
    throw new BlankException();
  }
  const reader = new Reader(tokens);
  return readForm(reader);
}
exports.readStr = readStr;
const readParen = (constructor, open, close) => {
  return reader => {
    const token = reader.next(); // open paren
    if (token !== open) {
      throw new Error(`Unexpected token ${token}, expected ${open}.`);
    }
    const list = [];
    while (true) {
      const next = reader.peek();
      if (!next) throw new Error('unexpected EOF');
      else if (next === close) break;
      list.push(readForm(reader));
    }
    reader.next(); // close paren
    return new constructor(list);
  };
};
const readList = readParen(types_1.OwlList, '(', ')');
const readVector = readParen(types_1.OwlVector, '[', ']');
