"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvePath = exports.getCommonPathIndex = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCommonPathIndex = (src, dst) => {
  const shortestNestedLength = Math.min(src.length, dst.length);
  let index = -1;

  for (let i = 0; i < shortestNestedLength; i++) {
    if (src[i] !== dst[i]) {
      return index;
    }

    index = i;
  }

  return index;
};

exports.getCommonPathIndex = getCommonPathIndex;

const notEmpty = item => !!item;

const parsePath = pathString => {
  const separator = /[\\\/]/;

  const {
    root,
    dir,
    ext,
    name
  } = _path.default.parse(pathString);

  let parsedDir = dir.split(separator);
  let parsedName = name;

  if (!ext) {
    parsedDir = parsedDir.concat([parsedName]);
    parsedName = '';
  }

  let theRoot = root;

  if (theRoot !== '/') {
    theRoot = '';
  }

  return {
    isAbsolute: _path.default.isAbsolute(pathString),
    root: theRoot,
    dir: parsedDir.filter(notEmpty),
    ext,
    name: parsedName
  };
};

let resolvePath = (sourcePath, destinationPath) => {
  if (!sourcePath || !destinationPath) {
    throw new Error('Source and destination paths are required.');
  }

  const dst = parsePath(destinationPath);

  if (dst.ext) {
    throw new Error('Destination path cannot contain file.');
  }

  const src = parsePath(sourcePath);

  if (!src.ext) {
    throw new Error('Source path have to contain file.');
  }

  if ([src.isAbsolute && !dst.isAbsolute, !src.isAbsolute && dst.isAbsolute].some(isTrue => isTrue)) {
    throw new Error('Source and destination paths have to be absolute or relative.');
  }

  let index = getCommonPathIndex(src.dir, dst.dir);
  ++index;
  const commonPath = src.dir.slice(0, index);
  const dstPathExceptCommonPath = dst.dir.slice(index);
  const srcPathExceptCommonPathAndFile = src.dir.slice(index + 1);
  const dir = commonPath.concat(dstPathExceptCommonPath).concat(srcPathExceptCommonPathAndFile);
  return {
    dir,
    name: src.name,
    ext: src.ext,
    modulePath: src.root + src.dir.join('/'),
    root: src.root,
    dirStr: src.root + dir.join('/')
  };
};

exports.resolvePath = resolvePath;