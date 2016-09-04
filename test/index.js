var assert = require('chai').assert;
var path = require('path');
var promptDel = require('..');
var fs = require('fs');
var dirExistsSync = require('@justinc/dir-exists').dirExistsSync;

const fixturesPath = path.join(__dirname, 'fixtures');
const dir1 = path.join(fixturesPath, 'dir1');
const dir2 = path.join(fixturesPath, 'dir2');

function mkdirIfNotExists(dirPath) {
  if (!dirExistsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

function rmdirIfExists(dirPath) {
  if (dirExistsSync(dirPath)) {
    fs.rmdirSync(dirPath);
  }
}

describe('promptDel', function() {

  beforeEach(function() {
    mkdirIfNotExists(dir1);
    mkdirIfNotExists(dir2);
    var contents = fs.readdirSync(fixturesPath);
    assert.isTrue(contents.indexOf('dir1') > -1, 'dir1 is expected to exist before running tests');
    assert.isTrue(contents.indexOf('dir2') > -1, 'dir2 is expected to exist before running tests');
  });

  afterEach(function() {
    rmdirIfExists(dir1);
    rmdirIfExists(dir2);
    var contents = fs.readdirSync(fixturesPath);
    assert.isTrue(contents.indexOf('dir1') === -1, 'dir1 is expected to NOT exist after running tests');
    assert.isTrue(contents.indexOf('dir2') === -1, 'dir2 is expected to NOT exist after running tests');
  });

  it('deletes directories when okDelete is true', function(done) {
    promptDel({
      patterns: [ path.join(fixturesPath, '**'), '!' + fixturesPath],
      promptCb: () => Promise.resolve({ okDelete: true })
    }).then(({ okDelete, deletedPaths }) => {
      var contents = fs.readdirSync(fixturesPath);
      assert.isTrue(contents.indexOf('dir1') === -1, 'dir1 is expected to NOT exist');
      assert.isTrue(contents.indexOf('dir2') === -1, 'dir2 is expected to NOT exist');
      assert.isTrue(deletedPaths.length === 2);
      assert.isTrue(okDelete);
      done();
    }).catch(done);
  });

  it('does not delete directories when okDelete is false', function(done) {
    promptDel({
      patterns: [ path.join(fixturesPath, '**'), '!' + fixturesPath],
      promptCb: () => Promise.resolve({ okDelete: false })
    }).then(({ okDelete, deletedPaths }) => {
      var contents = fs.readdirSync(fixturesPath);
      assert.isTrue(contents.indexOf('dir1') > -1, 'dir1 is expected to exist');
      assert.isTrue(contents.indexOf('dir2') > -1, 'dir2 is expected to exist');
      assert.equal(deletedPaths.length, 0, 'expecting no paths to have been deleted');
      assert.isFalse(okDelete);
      done();
    }).catch(done);
  });

});
