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
if exists('g:gotofile_extensions')
  let s:extensions = g:gotofile_extensions
else
  let s:extensions = '.js,.mjs,.es6,.jsx,.vue,.ts,.tsx,.json,.jsonc,.css,.scss,.wxss'
endif

fun s:Callback(winid, choice)
  if a:choice > -1
    exec 'e ' . a:winid->winbufnr()->getbufline(1, '$')->get(a:choice - 1, '')
  endif
endfun

fun s:GotoFile()
  let file = expand('<cfile>')
  if isabsolutepath(file) == 0
    let file = expand('%:h') .. '/' .. expand('<cfile>')
  endif
  if filereadable(file)
    exec 'e' file
    return
  endif
  let id = expand('<cfile>:S')
  let parent = expand('%:p:S')
  let res = system(join([shellescape(s:cmd), id, parent, shellescape(s:extensions)], ' '))
  if res == ''
    echo join(['[vim-gotofile]Cannot find module', id, 'from', parent], ' ')
  else
    let lines = split(res, '\n')
    if len(lines) == 1
      exec 'e ' . res
    else
      call popup_menu(lines, #{
        \ pos: 'topleft',
        \ line: 'cursor+1',
        \ col: 'cursor',
        \ border: [0, 0, 0, 0],
        \ callback: function('s:Callback'),
      \ })
    endif
  endif
endf

fun s:Init()
  let ext = '.' .. expand('%:e')
  if stridx(s:extensions, ext) >= 0
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
