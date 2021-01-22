" Vim javascript filetype plugin for enhancing the native gf command
" Last Change:	2016 Aug 14
" Maintainer:	Bin Zou <zoubin04@gmail.com>
" License:	This file is placed in the public domain.

if exists('g:loaded_gotofile')
  finish
endif
let g:loaded_gotofile = 1

" make '@' can be included in path names
exe 'set isfname='.&isfname.',@-@'

let s:cmd = expand('<sfile>:h:h') . '/bin/resolve.js'

fun s:GotoFile()
  let id = expand('<cfile>:S')
  let parent = expand('%:p:S')
  let res = system(join([shellescape(s:cmd), id, parent], ' '))
  if res == ''
    echo join(['Cannot find module', id, 'from', parent], ' ')
  else
    exec 'e ' . res
  endif
endf

fun s:Init()
  let ext = '.' .. expand('%:e')
  if exists('g:gotofile_extensions')
    let extensions = g:gotofile_extensions
  else
    let extensions = ['.js', '.ts', '.jsx', '.tsx', '.es6', '.json']
  endif
  if index(extensions, ext) >= 0
    if !exists("no_plugin_maps") && !exists("no_mail_maps")
      if !hasmapto('<Plug>GotoFile')
        "nmap [f :call <SID>GotoFile()<CR>
        nmap <buffer> gf <Plug>GotoFile
      endif
      nmap <buffer> <Plug>GotoFile :call <SID>GotoFile()<CR>
    endif
  endif
endf

au BufNewFile,BufRead *.* call s:Init()
