var repl = require('repl');
var fs = require('fs');
var path = require('path');
var promptDel = require('..');
var dirExistsSync = require('@justinc/dir-exists').dirExistsSync;

const fixturesPath = path.join(__dirname, 'fixtures');
const dir1 = path.join(fixturesPath, 'dir1');
const dir2 = path.join(fixturesPath, 'dir2');

function mkdirIfNotExists(dirPath) {
  if (!dirExistsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}
mkdirIfNotExists(dir1);
mkdirIfNotExists(dir2);

var promptDelPromise = promptDel({
  patterns: [path.join(__dirname, 'fixtures', '**'), '!' + path.join(__dirname, 'fixtures'), path.join(__dirname, 'does_not_exist', '**')]
}).then(({ okDelete, deletedPaths }) => {
  console.log('okDelete:', okDelete);
  console.log('deletedPaths:', deletedPaths);
  return `You chose ${okDelete ? 'to' : 'not to'} delete`;
});

promptDelPromise.then(promptDelResult => {
  console.log('\npromptDelResult:', promptDelResult);
  var replServer = repl.start({
    prompt: 'Use \'.exit\' to exit > '
  });

  replServer.context.promptDel = promptDel;
  replServer.context.promptDelPromise = promptDelPromise;
  replServer.context.promptDelResult = promptDelResult;
});
