const debug = require('debug');
// 名前空間`mylib:randomid`作成
const log = debug('mylib:randomid');
log('Library loaded');

function getRandomId() {
  log('Computing random ID');
  const outcome = Math.random().toString(36).substr(2);
  log('Random ID is %s', outcome);
  return outcome;
}

module.exports = { getRandomId };
