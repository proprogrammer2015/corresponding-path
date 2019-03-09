import path from 'path';

export const getCommonPathIndex = (src, dst) => {
    const shortestNestedLength = Math.min(src.length, dst.length);

    for (let i = 0; i < shortestNestedLength; i++) {
        if (src[i] !== dst[i]) {
            return i - 1;
        }
    }

    if (shortestNestedLength === dst.length) {
        return dst.length - 2;
    }
    return -1;
};

const notEmpty = item => !!item;

const parsePath = (pathString) => {
    const separator = /[\\\/]/;
    const { root, dir, ext, name } = path.parse(pathString);

    const parsedDir = dir.split(separator).filter(notEmpty);
    const modulePath = parsedDir.concat([name]).filter(notEmpty);

    return {
        isAbsolute: path.isAbsolute(pathString),
        root,
        dir: ext ? parsedDir : modulePath,
        ext,
        name: ext ? name : '',
        modulePath
    };
};

export let resolvePath = (sourcePath, destinationPath) => {
    if (!sourcePath || !destinationPath) {
        throw new Error('Source and destination paths are required.');
    }

    const dst = parsePath(destinationPath);

    if (dst.ext) {
        throw new Error('Destination path cannot contain file.');
    }

    const src = parsePath(sourcePath);

    if ([
        src.isAbsolute && !dst.isAbsolute,
        !src.isAbsolute && dst.isAbsolute
    ].some(isTrue => isTrue)) {
        throw new Error('Source and destination paths have to be absolute or relative.');
    }

    let index = getCommonPathIndex(src.dir, dst.dir);
    ++index;

    const commonPath = src.dir.slice(0, index);
    const dstPathExceptCommonPath = dst.dir.slice(index);
    const srcPathExceptCommonPathAndFile = src.dir.slice(index + 1);
    const dir = commonPath.concat(dstPathExceptCommonPath).concat(srcPathExceptCommonPathAndFile);

    return {
        input: src,
        output: {
            ...dst,
            dir,
            modulePath: `${dir.join('/')}/${src.name}`,
            full: `${dir.join('/')}/${src.name}${src.ext}`
        }
    };
}