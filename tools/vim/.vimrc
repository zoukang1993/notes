set nocompatible " not compatible with vi
set autoread " detect when a file is changed
set backspace=indent,eol,start
set history=1000 " change history to 1000
set textwidth=98
let mapleader = ','
let g:mapleader = ','
nnoremap <leader>R :source ~/.vimrc<cr>
set mouse=a " mouse
"set clipboard+=unnamedplus
""set clipboard=unnamed " todo need more digging
set nu " line number
set completeopt=longest,menuone " ctrl+p ctrl+n
"Make Vim completion popup menu work just like in an IDE
"http://vim.wikia.com/wiki/Make_Vim_completion_popup_menu_work_just_like_in_an_IDE
set laststatus=2 " always show status line
set nolazyredraw " don't redraw while executing macros
set magic " Set magic on, for regex
set showmatch " show matching braces
"set mat=2 " how many tenths of a second to blink
"检测文件类型
filetype on
"vim使用自动对齐，也就是把当前行的对齐格式应用到下一行
set autoindent
"依据上面的对齐格式，只能的选择对齐方式
set smartindent
"设置匹配模式，类似当输入一个左括号时会匹配相应的那个右括号
set showmatch
set incsearch
set guifont=Courier_new:h14:b:cDEFAULT
set autowriteall
" color
syntax enable
set t_Co=256
set background=dark
colorscheme atom-dark
"NERD
" 在 vim 启动的时候默认开启 NERDTree（autocmd 可以缩写为 au）
autocmd VimEnter * NERDTree
" 按下 F2 调出/隐藏 NERDTree
map :silent! NERDTreeToggle
" 将 NERDTree 的窗口设置在 vim 窗口的右侧（默认为左侧）
let NERDTreeWinPos="left"
" 当打开 NERDTree 窗口时，自动显示 Bookmarks
let NERDTreeShowBookmarks=1
" Search
set ignorecase " case insensitive searching
set smartcase " case-sensitive if expresson contains a capital letter
set hlsearch
set incsearch " set incremental search, like modern browsers
" Tab & indent control
set expandtab " insert space characters whenever the tab key is pressed
set tabstop=4 " insert 4 spaces for a tab
set shiftwidth=4 " number of spaces to use for indent and unindent
set ai
retab " To change all the existing tab characters to match the current tab settings,
set autoindent " automatically set indent of new line
set smartindent
set smarttab " tab respects 'tabstop', 'shiftwidth', and 'softtabstop'
set softtabstop=4 " edit as if the tabs are 4 characters wide
set shiftround " round indent to a multiple of 'shiftwidth'
" Toggle invisible characters
set listchars=tab:▸\ ,eol:¬,trail:⋅,extends:❯,precedes:❮
set showbreak=↪
nnoremap <leader>l :set list!<cr>
set backupdir=~/.vim/tmp
set directory=~/.vim/tmp
let g:auto_save_no_updatetime = 1 " do not change the updatetime option
" indent-guides
" 随 vim 自启动
let g:indent_guides_enable_on_vim_startup=1
" 从第二层开始可视化显示缩进
let g:indent_guides_start_level=2
" 色块宽度
let g:indent_guides_guide_size=1
" 快捷键 i 开/关缩进可视化
:nmap <silent> <Leader>i <Plug>IndentGuidesToggle
" 基于缩进或语法进行代码折叠 za，打开或关闭当前折叠；zM，关闭所有折叠；zR，打开所有折叠
"set foldmethod=indent
set foldmethod=syntax
" 启动 vim 时关闭折叠代码
set nofoldenable
" jump
:set tags+=/data/workplace/example/tags
" 开启文件类型侦测
filetype on
" 根据侦测到的不同类型加载对应的插件
filetype plugin on
" 开启实时搜索功能
set incsearch
" 搜索时大小写不敏感
set ignorecase
" 关闭兼容模式
set nocompatible
" vim 自身命令行模式智能补全
set wildmenu
filetype plugin on
autocmd FileType php set omnifunc=phpcomplete#CompletePHP
