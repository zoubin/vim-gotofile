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

[Vundle](https://github.com/VundleVim/Vundle.vim) is recommend:

```vim
Plugin "zoubin/vim-gotofile"

```

## Mappings
The native `gf` is remapped by default.

But you can use it with other mappings:

```vim
nmap [f <Plug>GotoFile

```

