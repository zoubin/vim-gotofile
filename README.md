# vim-gotofile
A vim plugin to enhance the native `gf` command to act like [node-resolve](https://github.com/browserify/resolve)

## Example

```
example/
├── index.js
├── node_modules
│   └── dep
│       ├── dep.js
│       └── package.json
├── package.json
├── src
│   ├── component
│   │   └── dialog
│   │       ├── index.ts
│   │       └── index.wxss
│   └── test.js
└── z.js

```

```js
// relative path with extension. behave like native gf
require('./z.js')
require('z.js')

// relative path without extension. behave like node module resolution
require('./z')

// node_modules
require('dep')

// alias can be specified in .eslintrc.js
require('@src/test')

// multiple matches will be displayed in a popup window
require('@src/component/dialog')

```

## Install

### Vundle
```vim
Plugin "zoubin/vim-gotofile"

```

then run the following in Vim:

```vim
:source %
:PluginInstall

```

### Pathogen
```bash
cd ~/.vim/bundle
git clone https://github.com/zoubin/vim-gotofile

```

## Mappings
The native `gf` is remapped by default. But you can use it with other mappings:

```vim
nmap ]f <Plug>GotoFile

```

## Configure

```vim
" files with specific extensions will use the enhanced gf
" this is the default configuration
let g:gotofile_extensions = '.js,.mjs,.es6,.jsx,.vue,.ts,.tsx,.json,.jsonc,.css,.scss,.wxss'

```

```js
// .eslintrc.js
const path = require('path');
module.exports = {
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@src', path.resolve(__dirname, './src')],
        ],
      },
    },
  },
};

```

