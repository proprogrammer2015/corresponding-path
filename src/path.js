import path from 'path';

export const getCommonPathIndex = (src, dst) => {
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

const notEmpty = item => !!item;

const parsePath = (pathString) => {
    const separator = /[\\\/]/;
    const { dir, ext, name } = path.parse(pathString);

    let parsedDir = dir.split(separator);
    let parsedName = name;
    if (!ext) {
        parsedDir = parsedDir.concat([parsedName]);
        parsedName = '';
    }

    return {
        dir: parsedDir.filter(notEmpty),
        ext,
        name: parsedName
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

    if (!src.ext) {
        throw new Error('Source path have to contain file.');
    }

    let index = getCommonPathIndex(src.dir, dst.dir);
    ++index;

    const commonPath = src.dir.slice(0, index);
    const dstPathExceptCommonPath = dst.dir.slice(index);
    const srcPathExceptCommonPathAndFile = src.dir.slice(index + 1);
    const dir = commonPath.concat(dstPathExceptCommonPath).concat(srcPathExceptCommonPathAndFile);

    return [
        dir,
        src.name,
        src.ext,
        src.dir.join('/')
    ];
}