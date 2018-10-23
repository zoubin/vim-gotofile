# vim-gotofile
A vim plugin to enhance the native `gf` command to go to `node_modules`.

## Example
Suppose you are editing `/path/to/index.js`:

```js
var through2 = require('through2')
var polyfill = require('./polyfill')

```

If you put the cursor on the word `through2`,
and press `gf`, the file `/path/to/node_modules/through2/through2.js` will be loaded in the current window.
Because the entry to `through2` is specified as `through2.js` in its package.json:
```json
{
  "main": "through2.js"
}

```

Relative paths are also resolved as expected.
If you press `gf` on `./polyfill`, `/path/to/polyfill` will be loaded.

## Install

### Vundle
[Vundle](https://github.com/VundleVim/Vundle.vim) is the recommended way:

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
The native `gf` is remapped by default.

But you can use it with other mappings:

```vim
nmap [f <Plug>GotoFile

```

## Configure
There are two ways to set options for this plugin: the vimrc way and the package.json way.

### vimrc

To add more module directories:
```vim
au BufNewFile,BufRead *.js,*.jsx,*.es6 call gotofile#SetOptions({
\ 'moduleDirectory': ['node_modules', 'web_modules']
\ })

```

To enhance `gf` in css files:
```vim
let g:gotofile_extensions = ['js', 'jsx', 'es6', 'css', 'scss', 'sass']
" lookup the `style` field first instead of the `main` field in the package.json
au BufNewFile,BufRead *.css,*.scss,*.sass call gotofile#SetOptions({
\ 'alwaysTryRelative': 1,
\ 'main': 'style',
\ 'extensions': ['.css', '.scss', '.sass'],
\ 'moduleDirectory': ['node_modules', 'web_modules']
\ })

```

### package.json
Options can also be specified in `package.json`:

Suppose the directory pkg has contents like:

```
pkg
├── index.js
├── node_modules
│   └── y
│       ├── index.pcss
│       ├── package.json
│       └── y.pcss
├── package.json
├── src
│   └── test.js
├── web_modules
│   └── x
│       └── index.js
└── z.js

```

Here is `pkg/package.json`:

```json
{
  "vim-gotofile": {
    "moduleDirectory": ["node_modules", "web_modules"],
    "extensions": [".pcss", ".js"],
    "alwaysTryRelative": 1,
    "alias": { "@src": "src" },
    "main": "style"
  }
}

```

Then in `pkg/index.js` we can go to the correct files:
```js
require('x') // "moduleDirectory": ["node_modules", "web_modules"]
require('y') // "extensions": [".pcss", ".js"],
require('z') // "alwaysTryRelative": 1
require('@src/test') // "alias": { "@src": "src" }

```

**Note**: The `alias` option can only be specified in this way.

The `alias` option can also be specified as a string:

```json
{
  "vim-gotofile": {
    "moduleDirectory": ["node_modules", "web_modules"],
    "extensions": [".pcss", ".js"],
    "alwaysTryRelative": 1,
    "alias": "config.json|alias",
    "main": "style"
  }
}

```

The alias will be looked up in the `alias` field of file `pkg/config.json`.


