if exists('g:gotofile_autoloaded')
  finish
endif
let g:gotofile_autoloaded = 1

fun! gotofile#SetOptions(options)
  let b:gotofile_options = a:options
endf

