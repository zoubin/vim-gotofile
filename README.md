# vim-gotofile
A vim plugin to enhance the native `gf` command to act like [node-resolve](https://github.com/browserify/resolve)

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

```vim
" files with specific extensions will use the enhanced gf
" this is the default configuration
let g:gotofile_extensions = ['.js', '.ts', '.jsx', '.tsx', '.es6', '.json']

```

```vim
" gf in css files
let g:gotofile_extensions = ['.js', '.ts', '.jsx', '.tsx', '.es6', '.json', '.css', '.scss']

```

A `.vim.gotofile.config.js` in your home directory can be used to provide more configurations.

```javascript
const path = require('path')
const fixture = tail => path.join(__dirname, 'path/to/my/project', tail)
module.exports = [
  {
    fileType: ['.js', '.ts', '.jsx', '.tsx', '.es6', '.json'],
    alias: {
      // gf require('@as/utils')
      '@as/utils': fixture('src/utils'),
      // gf require('@as/components/awesome')
      '@as/components': fixture('src/components')
    },
    // the default option is 'node_modules'
    moduleDirectory: ['node_modules', 'web_modules']
  },
  {
    fileType: ['.css', '.scss'],
    // use the 'style' field in package.json to locate entries
    main: 'style'
  }
]

```
