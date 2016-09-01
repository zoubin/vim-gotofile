" Vim javascript filetype plugin for enhancing the native gf command
" Last Change:	2016 Aug 14
" Maintainer:	Bin Zou <zoubin04@gmail.com>
" License:	This file is placed in the public domain.

if exists('g:loaded_gotofile')
  finish
endif
let g:loaded_gotofile = 1

let s:cmd = expand('<sfile>:h:h') . '/bin/resolve.js'

fun s:AddArgs(args, name, value)
  call add(a:args, '--' . a:name)
  if type(a:value) == 3
    call extend(a:args, a:value)
  else
    call add(a:args, a:value)
  endif
endfun

fun s:GotoFile()
  let args = []
  let options = { 'extensions': ['.js', '.jsx', '.es6'] }
  if exists('b:gotofile_options')
    call extend(options, b:gotofile_options, 'force')
  endif
  for key in keys(options)
    call s:AddArgs(args, key, options[key])
  endfor
  call s:AddArgs(args, 'filename', expand('%:p:S'))
  let res = system(join([shellescape(s:cmd), expand('<cfile>:S'), join(args, ' ')], ' '))
  if res == ''
    echo join(['Cannot find module', expand('<cfile>:S'), 'from', expand('%:p:S')], ' ')
  else
    exec 'e ' . res
  endif
endf

fun s:Init()
  let ext = expand('%:e')
  if exists('g:gotofile_extensions')
    let extensions = g:gotofile_extensions
  else
    let extensions = ['js', 'jsx', 'es6']
  endif
  if index(extensions, ext) > 0
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

