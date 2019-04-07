# Installation
```sh
npm install corresponding-path
```

# Usage
```js
const { resolvePath } = require('corresponding-path');
const source = './src/path/to/some/module.html';
const destination = './src/path_compiled';

const { input, output } = resolvePath(source, destination);

// Example:
console.log(output.dir.join('/')); // ./src/path_compiled/to/some
```

# Licence
## MIT