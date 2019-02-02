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

export let resolvePath = (sourcePath, destinationPath, separator = '/') => {
    if (!sourcePath || !destinationPath) {
        throw new Error('Source and destination paths are required.');
    }

    const fileSeparator = '.';

    const dst = destinationPath.split(separator).filter(x => !!x);
    if (dst[dst.length - 1].indexOf(fileSeparator) !== -1) {
        throw new Error('Destination path cannot contain file.');
    }

    const src = sourcePath.split(separator);
    if (src[src.length - 1].split('').filter(c => c === fileSeparator).length === 0) {
        throw new Error('Source path have to contain file.');
    }

    let index = getCommonPathIndex(src, dst);
    ++index;

    const lastFileSeparatorIndex = src[src.length - 1].lastIndexOf(fileSeparator);
    const name = src[src.length - 1].slice(0, lastFileSeparatorIndex);
    const ext = src[src.length - 1].slice(lastFileSeparatorIndex + 1);

    const commonPath = src.slice(0, index);
    const dstPathExceptCommonPath = dst.slice(index);
    const srcPathExceptCommonPathAndFile = src.slice(index + 1, -1);
    const dir = commonPath.concat(dstPathExceptCommonPath).concat(srcPathExceptCommonPathAndFile);

    return [
        dir,
        name,
        ext,
        src.slice(0, -1).join(separator)
    ];
}