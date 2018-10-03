'use strict';
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const path = __importStar(require('path'));
const ffi = __importStar(require('ffi'));
const fs = __importStar(require('fs'));
// IMPORTANT: choose one
const RL_LIB = 'libreadline'; // NOTE: libreadline is GPL
// var RL_LIB = "libedit";
const HISTORY_FILE = path.join(process.env.HOME || '.', '.mal-history');
const rllib = ffi.Library(RL_LIB, {
  readline: ['string', ['string']],
  add_history: ['int', ['string']],
});
let rlHistoryLoaded = false;
function readline(prompt) {
  prompt = prompt || 'user> ';
  if (!rlHistoryLoaded) {
    rlHistoryLoaded = true;
    let lines = [];
    if (fs.existsSync(HISTORY_FILE)) {
      lines = fs
        .readFileSync(HISTORY_FILE)
        .toString()
        .split('\n');
    }
    // Max of 2000 lines
    lines = lines.slice(Math.max(lines.length - 2000, 0));
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) {
        rllib.add_history(lines[i]);
      }
    }
  }
  const line = rllib.readline(prompt);
  if (line) {
    rllib.add_history(line);
    try {
      fs.appendFileSync(
        HISTORY_FILE,
        `${line}
`,
      );
    } catch (exc) {
      // ignored
    }
  }
  return line;
}
exports.readline = readline;
