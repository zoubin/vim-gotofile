" Vim javascript filetype plugin for enhancing the native gf command
" Last Change:	2016 Aug 14
" Maintainer:	Bin Zou <zoubin04@gmail.com>
" License:	This file is placed in the public domain.

if exists('g:loaded_gotofile')
  finish
endif
let g:loaded_gotofile = 1

let s:cmd = expand('<sfile>:h:h') . '/bin/resolve.js'
fun s:GotoFile()
  let res = system(shellescape(s:cmd) . ' ' . expand('%:p:S') . ' ' . expand('<cfile>:S'))
  if res == ''
    echo 'File not found!'
  else
    exec 'e ' . res
  endif
endf

fun s:Init()
  if !exists("no_plugin_maps") && !exists("no_mail_maps")
    if !hasmapto('<Plug>GotoFile')
      "nmap [f :call <SID>GotoFile()<CR>
      nmap <buffer> gf <Plug>GotoFile
    endif
    nmap <buffer> <Plug>GotoFile :call <SID>GotoFile()<CR>
  endif
endf

au BufNewFile,BufRead *.js,*.jsx call s:Init()

