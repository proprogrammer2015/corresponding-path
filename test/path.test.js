import test from 'ava';
import { resolvePath, getCommonPathIndex } from '../src/path';

test('should return output path for common path', t => {
    const source = './src/path/to/some/module.html';
    const destination = './src/path_compiled';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, './src/path_compiled/to/some'.split('/'));
    t.is(name, 'module');
    t.is(ext, '.html');
    t.is(modulePath, './src/path/to/some');
});

test('should return output path for miscellaneous paths', t => {
    const source = './path/to/other/moduleName.html';
    const destination = './new_compiled';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, './new_compiled/to/other'.split('/'));
    t.is(name, 'moduleName');
    t.is(ext, '.html');
    t.is(modulePath, './path/to/other');
});

test('should return output path for nested miscellaneous paths', t => {
    const source = './path/to/other/moduleName.html';
    const destination = './new_compiled/files/to/share';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, './new_compiled/files/to/share/to/other'.split('/'));
    t.is(name, 'moduleName');
    t.is(ext, '.html');
    t.is(modulePath, './path/to/other');
});

test('should return correct output path for invalid destination path', t => {
    const source = './path/to/other/moduleName.html';
    const destination = './new_compiled////files/to/share/';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, './new_compiled/files/to/share/to/other'.split('/'));
    t.is(name, 'moduleName');
    t.is(ext, '.html');
    t.is(modulePath, './path/to/other');
});

test('should return correct output path for combined file name', t => {
    const source = './path/to/other/master.module.html';
    const destination = './new_compiled/files/to/share';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, './new_compiled/files/to/share/to/other'.split('/'));
    t.is(name, 'master.module');
    t.is(ext, '.html');
    t.is(modulePath, './path/to/other');
});

// test('should return correct output path for cwd paths', t => {
//     const source = 'path/to/other/master.module.html';
//     const destination = 'new_compiled';
// });

// test('should return correct output path for parent dest path', t => {
//     const source = 'path/to/other/master.module.html';
//     const destination = '../new_compiled';
// });

// test('should return correct output path for parent dest path', t => {
//     const source = 'path/to/other/master.module.html';
//     const destination = './../new_compiled';
// });

test('should return correct output path in for absolute Unix paths style', t => {
    const source = '/path/to/other/master.module.html';
    const destination = '/new_compiled';

    const { dir, name, ext, modulePath, root, dirStr } = resolvePath(source, destination);
    t.deepEqual(dirStr, '/new_compiled/to/other');
    t.is(name, 'master.module');
    t.is(ext, '.html');
    t.is(modulePath, '/path/to/other');
});

test('should throw error if absolute source and relative destination path passed', t => {
    const source = 'C:\\path\\to\\other\\master.module.html';
    const destination = './new_compiled/files/to/share';

    t.throws(() => resolvePath(source, destination), 'Source and destination paths have to be absolute or relative.');
});

test('should throw error if absolute destination and relative source path passed', t => {
    const source = './path/to/other/master.module.html';
    const destination = 'C:\\new_compiled\\files\\to\\share';

    t.throws(() => resolvePath(source, destination), 'Source and destination paths have to be absolute or relative.');
});

test('should return correct output path in for absolute Windows paths', t => {
    const source = 'C:\\Users\\path\\to\\other\\master.module.html';
    const destination = 'C:\\Users\\new_compiled\\files\\to\\share';

    const { dir, name, ext, modulePath } = resolvePath(source, destination);
    t.deepEqual(dir, 'C:/Users/new_compiled/files/to/share/to/other'.split('/'));
    t.is(name, 'master.module');
    t.is(ext, '.html');
    t.is(modulePath, 'C:/Users/path/to/other');
});

test('should throw Error if destination path contains filename', t => {
    const source = './path/to/other/moduleName.html';
    const destination = './new_compiled/files/to/share/file.ext';

    t.throws(() => resolvePath(source, destination), 'Destination path cannot contain file.');
});

test('should throw Error if source path does not contain filename', t => {
    const source = './path/to/other/moduleName';
    const destination = './new_compiled/files/to/share';

    t.throws(() => resolvePath(source, destination), 'Source path have to contain file.');
});

test('should throw Error if source or destination are empty', t => {
    t.throws(() => resolvePath(), 'Source and destination paths are required.');
});

test('should return index equal to 2 for given paths', t => {
    const src = './path/to/src/files'.split('/');
    const dst = './path/to/dst/files'.split('/');

    t.is(getCommonPathIndex(src, dst), 2);
});

test('should return index equal to 0 for given paths', t => {
    const src = './src/path/to/files'.split('/');
    const dst = './dst/path/to/files'.split('/');

    t.is(getCommonPathIndex(src, dst), 0);
});

test('should return -1 if common path was not found', t => {
    const src = '/root/src/path/to/files'.split('/');
    const dst = './dst/path/to/files'.split('/');

    t.is(getCommonPathIndex(src, dst), -1);
});