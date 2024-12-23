import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';

// @ts-ignore
import installModule from 'install-module-linked';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TMP_DIR = path.resolve(__dirname, '..', '..', '.tmp');
const CACHE_DIR = path.join(TMP_DIR, 'cache');
const NODE_MODULES = path.join(TMP_DIR, 'node_modules');

const hasPromise = typeof Promise !== 'undefined';

describe('install-module-linked node', () => {
  beforeEach((cb) => {
    const queue = new Queue();
    queue.defer(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));
    queue.defer(mkdirp.bind(null, NODE_MODULES));
    queue.await(cb);
  });
  after(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));

  it('install callback', (done) => {
    installModule('each-package', NODE_MODULES, { cacheDirectory: CACHE_DIR }, (err) => {
      assert.ok(fs.existsSync(path.join(NODE_MODULES, 'each-package')));
      assert.equal(JSON.parse(fs.readFileSync(path.join(NODE_MODULES, 'each-package', 'package.json'), 'utf8')).name, 'each-package');
      done(err);
    });
  });

  !hasPromise ||
    it('install hasPromise', (done) => {
      installModule('each-package', NODE_MODULES, { cacheDirectory: CACHE_DIR })
        .then((_value) => {
          assert.ok(fs.existsSync(path.join(NODE_MODULES, 'each-package')));
          assert.equal(JSON.parse(fs.readFileSync(path.join(NODE_MODULES, 'each-package', 'package.json'), 'utf8')).name, 'each-package');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
});
