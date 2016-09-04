var del = require('del');
var inquirer = require('inquirer');

/**
 * All arguments accepted by exported function
 * @typedef {Object} Args
 * @property {[string]} patterns      - Mandatory argument: array of patterns to base deletion on
 * @property {string} promptMsg       - Optional argument for the string to use to prompt the user with before deletion
 * @property {Object} delOpts         - Optional options for [del](https://www.npmjs.com/package/del). Default: { force: true, dot: true }
 * @property {promptCb} promptCb      - Optional promise-based callback argument responsible for getting approval from user
 */

/**
 * Optional promise-based callback argument responsible for getting approval from user to perform deletion.
 * Default uses inquirer via stdin.
 * If you supply your own, make sure to return a Promise which resolves to an object with the field 'okDelete' with a boolean
 * value based on user's answer
 *
 * @callback promptCb
 * @param {string} promptMsg       - A message you can use to prompt the user with (use if you want to or supply your own)
 */

function confirmFileDeletion(promptMsg) {
  var prompt = inquirer.createPromptModule();
  return prompt([
    {
      type: 'confirm',
      name: 'okDelete',
      message: promptMsg,
      'default': false
    }
  ]);
}

/**
 * The value which this module resolves to
 * @typedef {Object} Result
 * @property {[string]} deletedPaths - Array of paths deleted
 * @property {boolean} okDelete - Is true if after being prompoted, user decided to delete (false otherwise)
 */

/**
 *
 * @param  {Args} args
 * @return {Promise<Result>}
 */
module.exports = function _promptDel(args) {
  return new Promise((resolve, reject) => {

    if (!args || !args.patterns) {
      return reject(new Error('the patterns ([string]) to delete by are mandatory'));
    }
    const DEL_PATTERNS = args.patterns;
    const PROMPT_MSG = args.promptMsg || `About to delete based on the following patterns:\n${DEL_PATTERNS}`;
    const DEL_OPTS = args.delOpts || { force: true, dot: true };
    const PROMPT = args.promptCb ? args.promptCb : confirmFileDeletion;

    PROMPT(PROMPT_MSG).then(answers => {
      if (answers.okDelete) {
        del(DEL_PATTERNS, DEL_OPTS).then(paths => {
          resolve({ okDelete: true, deletedPaths: paths });
        }).catch(reject);
      } else {
        resolve({ okDelete: false, deletedPaths: [] });
      }
    }).catch(reject);

  });
};
