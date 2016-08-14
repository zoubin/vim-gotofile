" Vim javascript filetype plugin for enhancing the native gf command
" Last Change:	2016 Aug 14
" Maintainer:	Bin Zou <zoubin04@gmail.com>
" License:	This file is placed in the public domain.

if exists('b:did_ftplugin')
  finish
endif
let b:did_ftplugin = 1

let b:cmd = expand('<sfile>:h:h') . '/bin/resolve.js'
if !exists('*s:GotoFile')
  fun s:GotoFile()
    let res = system(shellescape(b:cmd) . ' ' . expand('%:p:S') . ' ' . expand('<cfile>:S'))
    if res == ''
      echo 'File not found!'
    else
      exec 'e ' . res
    endif
  endf
endif

if !exists("no_plugin_maps") && !exists("no_mail_maps")
  if !hasmapto('<Plug>GotoFile')
    "nmap [f :call <SID>GotoFile()<CR>
    nmap <buffer> gf <Plug>GotoFile
  endif
  nmap <buffer> <Plug>GotoFile :call <SID>GotoFile()<CR>
endif

let b:undo_ftplugin = "setl fo< ofu< com< cms<"

