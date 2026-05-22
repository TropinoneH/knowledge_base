---
type: skills
tags:
  - cli
  - code
  - software
done: true
topic:
  - "[[Note]]"
---
下面按 **`stdpath("config")` 目录**来讲，也就是通常的：

```text
Linux/macOS: ~/.config/nvim/
Windows:     ~/AppData/Local/nvim/
```

Neovim 官方文档说明：用户配置入口是 `$XDG_CONFIG_HOME/nvim/init.lua` 或 `init.vim`，二者只能选一个；也可以用 `:echo stdpath("config")` 查看实际目录。

---

## 1. 先理解：`~/.config/nvim` 不只是“配置目录”，也是 runtime 目录

[[Neovim]] 会把你的 config 目录放进 `'runtimepath'`，然后按约定去找里面的固定目录/文件，比如 `plugin/`、`ftplugin/`、`lsp/`、`lua/`、`after/` 等。官方 `'runtimepath'` 文档列出的可搜索目录包括：`autoload/`、`colors/`、`compiler/`、`doc/`、`ftplugin/`、`indent/`、`keymap/`、`lang/`、`lsp/`、`lua/`、`pack/`、`parser/`、`plugin/`、`queries/`、`rplugin/`、`scripts/`、`spell/`、`syntax/`、`tutor/` 等。

所以重点是：**不是 config 目录下所有文件都会自动加载，而是 Neovim 按固定名字和固定时机加载。**

---

## 2. 启动加载顺序，先有整体概念

v0.12.2 的启动大致是：

```text
启动 Nvim
  ↓
加载 init.lua / init.vim
  ↓
启用 filetype detection
  ↓
启用 syntax
  ↓
加载 plugin/**/*.vim 和 plugin/**/*.lua
  ↓
加载 pack/*/start/* 插件
  ↓
加载 after/ 里的后置覆盖文件
```

官方 `starting` 文档里明确写到：启动时用户配置文件是 `init.lua` 或 `init.vim`；之后 filetype detection 会执行 `:runtime! filetype.lua`；syntax 会执行 `:runtime! syntax/syntax.vim`；插件脚本会通过 `:runtime! plugin/**/*.{vim,lua}` 加载，且 `plugin/` 下 `.vim` 先于 `.lua`，同目录内按字母顺序加载。

---

## 3. 根目录文件

|路径|作用|典型用途|
|---|---|---|
|`init.lua`|Neovim 的 Lua 主配置入口|加载插件管理器、设置 option/keymap/autocmd、`require("xxx")`|
|`init.vim`|Neovim 的 Vimscript 主配置入口|老式 Vimscript 配置入口|
|`filetype.lua` / `filetype.vim`|自定义文件类型检测规则|根据文件名、扩展名设置 `filetype`|
|`scripts.vim`|通过文件内容检测 filetype|比如看 shebang、文件第一行内容|
|`menu.vim`|GUI 菜单相关，普通终端配置很少用|一般不用管|

`filetype.lua/filetype.vim` 的作用是建立文件类型检测规则；每次打开新文件或已有文件时，Neovim 会尝试识别文件类型并设置 `'filetype'`，然后触发 `FileType` 事件。

如果你写的是根目录 `filetype.vim`，它会在默认 filetype autocmd 之前被 source，适合“提前覆盖/补充”文件名检测规则；如果写 `scripts.vim`，则适合用文件内容来判断类型，比如 shebang。

---

## 4. `lua/`

|路径|作用|典型用途|
|---|---|---|
|`lua/`|Lua 模块目录，不会自动全部执行|被 `require()` 按需加载|
|`lua/foo.lua`|对应 `require("foo")`|拆分配置|
|`lua/foo/init.lua`|也对应 `require("foo")`|一个模块一个目录|
|`lua/foo/bar.lua`|对应 `require("foo.bar")`|分层组织配置|

例如：

```text
~/.config/nvim/
  init.lua
  lua/
    options.lua
    keymaps.lua
    plugins/
      init.lua
      lsp.lua
```

`init.lua` 里写：

```lua
require("options")
require("keymaps")
require("plugins")
require("plugins.lsp")
```

官方Lua文档说明，Lua module 会在 `'runtimepath'` 下的 `lua/` 目录中查找；模块名里的 `.` 会被当成目录分隔符，例如 `require("foo.bar")` 会找 `lua/foo/bar.lua` 或 `lua/foo/bar/init.lua`。

---

## 5. `plugin/`

|路径|作用|加载时机|
|---|---|---|
|`plugin/*.lua`|全局启动脚本|启动时自动加载|
|`plugin/*.vim`|全局启动脚本|启动时自动加载|
|`plugin/subdir/*.lua`|也会被递归加载|启动时自动加载|

`plugin/` 适合放“启动时就应该生效”的全局脚本，比如全局 autocmd、command、小型插件入口。官方文档说明启动时会搜索所有 `'runtimepath'` 下的 `plugin/` 目录，并 source 里面的 `.vim` / `.lua` 文件。

例子：

```text
~/.config/nvim/plugin/
  commands.lua
  autocmds.lua
```

它们会自动执行，不需要在 `init.lua` 里 `require()`。

---

## 6. `after/`

`after/` 是“后置覆盖目录”。它不是单独一种功能，而是表示：**里面的同名 runtime 文件在默认 runtime、插件 runtime 之后再加载**。官方 `'runtimepath'` 文档说明，`after/` 子目录用于覆盖或追加默认设置、系统设置。

常见结构：

```text
~/.config/nvim/after/
  plugin/
  ftplugin/
  syntax/
  indent/
  lsp/
  queries/
```

### `after/plugin/`

|路径|作用|
|---|---|
|`after/plugin/*.lua`|在普通 `plugin/` 和 start packages 之后加载|
|`after/plugin/*.vim`|同上|

适合放“必须等插件加载后再覆盖”的配置。例如某插件默认设置被覆盖，或者你想在所有启动插件加载后再定义某些 autocmd。启动文档说明，普通 `plugin/` 加载时会跳过 `after/`，packages 加载后才加载 `after/` 目录里的插件脚本。

### `after/ftplugin/`

|路径|作用|
|---|---|
|`after/ftplugin/python.lua`|在默认 Python ftplugin 之后执行|
|`after/ftplugin/lua.lua`|在默认 Lua ftplugin 之后执行|

这是非常常用的目录。比如你想覆盖默认 ftplugin 或插件设置的 buffer-local option，就放这里。官方文档明确举例：如果全局 filetype plugin 不符合需求，可以创建 `~/.config/nvim/after/ftplugin/fortran.vim`，在里面只修改你想覆盖的设置。

---

## 7. `ftplugin/`

|路径|作用|例子|
|---|---|---|
|`ftplugin/python.lua`|只在 `filetype=python` 的 buffer 加载|Python 专属缩进、快捷键、LSP 辅助|
|`ftplugin/lua.lua`|只在 `filetype=lua` 的 buffer 加载|Lua 专属配置|
|`ftplugin/go.lua`|只在 `filetype=go` 的 buffer 加载|Go 专属配置|
|`ftplugin/python/foo.lua`|Python filetype 的额外脚本|拆分 Python 配置|

`ftplugin/` 里的设置一般应该用 buffer-local：

```lua
vim.bo.shiftwidth = 4
vim.bo.tabstop = 4
vim.bo.expandtab = true

vim.keymap.set("n", "<leader>r", ":!python %<CR>", { buffer = true })
```

官方 filetype 文档说明，启用 filetype plugin 后，当文件类型被检测出来时，会加载对应 filetype 的 plugin 文件；这些设置和映射是 buffer-local 的，不会影响其他文件。
命名规则通常是：

```text
ftplugin/<filetype>.vim
ftplugin/<filetype>.lua
ftplugin/<filetype>_<name>.vim
ftplugin/<filetype>/<name>.vim
```

官方文档也说明 `<filetype>` 部分必须匹配实际 filetype，后面的 `<name>` 可以用来区分多个同 filetype 文件。

---

## 8. `indent/`

|路径|作用|
|---|---|
|`indent/python.lua`|Python 专属缩进规则|
|`indent/lua.lua`|Lua 专属缩进规则|
|`after/indent/python.lua`|覆盖默认 Python 缩进规则|

`indent/` 只负责缩进相关内容，例如 `indentexpr`、`cindent`、`smartindent`、`shiftwidth` 等。filetype 文档说明，`:filetype indent on`会加载 `indent.vim`，之后当文件被识别为某个 filetype 时，会加载对应的 indent 文件。

实践上，如果只是想设置 `shiftwidth/tabstop/expandtab`，放 `ftplugin/xxx.lua` 也可以；如果你要写真正的缩进表达式，才更适合放 `indent/xxx.lua`。

---

## 9. `syntax/`

|路径|作用|
|---|---|
|`syntax/mylang.vim`|给 `filetype=mylang` 提供 Vim regex syntax 高亮|
|`after/syntax/python.vim`|在默认 Python syntax 后追加/覆盖高亮|

`syntax/` 是传统 Vim syntax 高亮目录。Neovim 启动时会启用 syntax highlighting，等 filetype 被设置后再加载对应的 syntax 文件。启动文档里写到 syntax 会执行 `:runtime! syntax/syntax.vim`。

现在很多人用 Treesitter，高亮逻辑通常在 `queries/` 和 `parser/` 里，但 `syntax/` 仍然对自定义语言、旧式高亮、补充高亮有用。

---

## 10. `ftdetect/`

|路径|作用|
|---|---|
|`ftdetect/mine.vim`|添加自定义 filetype 检测|
|`ftdetect/mine.lua`|Lua 版自定义检测|

例子：

```vim
" ~/.config/nvim/ftdetect/mine.vim
au BufRead,BufNewFile *.mine setfiletype mine
```

官方文档说明，`ftdetect/` 里的文件用于新增文件类型检测；它们在默认检查之后使用，因此可以覆盖之前检测到的 filetype，也可以用 `:setfiletype` 避免覆盖已经检测到的类型。

---

## 11. `lsp/`：v0.12.2 非常重要

|路径|作用|
|---|---|
|`lsp/lua_ls.lua`|定义 `lua_ls` 的 LSP config|
|`lsp/pyright.lua`|定义 `pyright` 的 LSP config|
|`after/lsp/lua_ls.lua`|覆盖/追加前面的 `lua_ls` 配置|

v0.12.2 中，LSP 配置可以通过两种方式定义：直接调用 `vim.lsp.config()`，或者创建 `lsp/<config-name>.lua` 文件。官方 LSP 文档示例就是创建 `stdpath('config') .. '/lsp/foo.lua'`，然后用 `vim.lsp.enable('foo')` 启用。

例如：

```text
~/.config/nvim/
  init.lua
  lsp/
    lua_ls.lua
    pyright.lua
```

`lsp/lua_ls.lua`：

```lua
return {
  cmd = { "lua-language-server" },
  filetypes = { "lua" },
  root_markers = { ".luarc.json", ".git" },
  settings = {
    Lua = {
      runtime = { version = "LuaJIT" },
    },
  },
}
```

`init.lua`：

```lua
vim.lsp.enable("lua_ls")
```

注意：**只放 `lsp/lua_ls.lua` 不等于自动启动 LSP**，你仍然需要 `vim.lsp.enable("lua_ls")`，或者用 `:lsp enable lua_ls`。官方文档明确说定义 config 后要调用 `vim.lsp.enable()` 才会 auto-activate。

`after/lsp/<name>.lua` 的优先级更高。官方 LSP 文档说明，LSP config 合并顺序包括：`lsp/<config>.lua`，然后 `after/lsp/<config>.lua`，后者用于覆盖插件提供的默认 LSP 配置，比如 nvim-lspconfig。

---

## 12. `colors/`

|路径|作用|
|---|---|
|`colors/mytheme.lua`|定义 `:colorscheme mytheme`|
|`colors/mytheme.vim`|Vimscript 版 colorscheme|

例子：

```text
~/.config/nvim/colors/mytheme.lua
```

然后：

```vim
:colorscheme mytheme
```

`colors/` 是 `'runtimepath'` 中被 Neovim 搜索的标准 runtime 目录之一，用于 colorscheme 文件。

---

## 13. `compiler/`

|路径|作用|
|---|---|
|`compiler/gcc.vim`|定义 `:compiler gcc` 行为|
|`compiler/mypy.vim`|定义 `:compiler mypy` 行为|
|`after/compiler/gcc.vim`|覆盖默认 compiler 配置|

`compiler/` 用来配置 `:make`、`makeprg`、`errorformat` 这类编译/错误解析规则。它也是 `'runtimepath'` 的标准搜索目录之一。

---

## 14. `autoload/`

|路径|作用|
|---|---|
|`autoload/foo.vim`|Vimscript autoload 函数|
|`autoload/foo/bar.vim`|Vimscript 分层 autoload 函数|

这是 Vimscript 时代的“按需加载函数”机制。Lua 配置里通常用 `lua/` + `require()` 替代它。官方 `'runtimepath'` 文档仍然把 `autoload/` 列为自动加载脚本目录。

---

## 15. `doc/`

|路径|作用|
|---|---|
|`doc/myplugin.txt`|自己写的 help 文档|
|`doc/tags`|help tag 索引|

如果你写了本地插件文档，可以放到 `doc/`，然后执行：

```vim
:helptags ~/.config/nvim/doc
```

之后可以：

```vim
:help myplugin
```

`doc/` 是 runtimepath 标准目录之一，用于本地帮助文档。

---

## 16. `queries/` 和 `parser/`

|路径|作用|
|---|---|
|`queries/lua/highlights.scm`|Treesitter Lua 高亮 query|
|`queries/python/injections.scm`|Treesitter Python 注入规则|
|`parser/lua.so`|Treesitter parser 动态库|
|`after/queries/lua/highlights.scm`|追加或覆盖 query|

`queries/` 和 `parser/` 是 Treesitter 相关目录；官方 `'runtimepath'` 文档把 `parser/` 标为 syntax parsers，把 `queries/` 标为 Treesitter queries。

实际配置中，如果你使用 `nvim-treesitter`，parser 通常放在 data 目录或插件目录里；你手写 query 覆盖时，才常在 config 下写 `queries/` 或 `after/queries/`。

 

## 17. `pack/`

|路径|作用|
|---|---|
|`pack/*/start/*`|启动时自动加载的 package 插件|
|`pack/*/opt/*`|需要 `:packadd` 才加载的可选插件|

例子：

```text
~/.config/nvim/pack/my/start/foo.nvim/
~/.config/nvim/pack/my/opt/bar.nvim/
```

不过更常见的位置是：

```text
~/.local/share/nvim/site/pack/
```

官方 package 文档说明：`pack/*/start/*` 会自动加载，`pack/*/opt/*` 只在需要时通过 `:packadd` 加载；`:runtime` 搜索会搜索 `'runtimepath'` 以及所有 `pack/*/start/*` 目录。

---

## 18. `spell/`

|路径|作用|
|---|---|
|`spell/en.utf-8.add`|自定义英文拼写词典|
|`spell/zh.utf-8.add`|自定义中文相关拼写词典，较少用|

`spell/` 是拼写检查相关目录，也是 `'runtimepath'` 标准目录之一。

---

## 19. `keymap/`

|路径|作用|
|---|---|
|`keymap/foo.vim`|输入法/keymap 文件|
|`keymap/russian-jcukenwin.vim`|类似键盘布局映射|

这个目录和普通 `vim.keymap.set()` 不是一回事。它更接近 Vim 的输入法/键盘布局机制，用得比较少。`keymap/` 是 runtimepath 标准目录之一。

---

## 20. `lang/`

|路径|作用|
|---|---|
|`lang/`|菜单翻译等语言资源|

普通用户基本不用。`lang/` 是 runtimepath 标准目录之一。

---

## 21. `rplugin/`

|路径|作用|
|---|---|
|`rplugin/python3/...`|Python remote plugin|
|`rplugin/node/...`|Node remote plugin|
|`rplugin/ruby/...`|Ruby remote plugin|

这是 remote plugin 机制用的目录，通常给 Python/Node/Ruby 插件作者使用。`rplugin/` 是 runtimepath 标准目录之一。

---

## 22. `tutor/`

|路径|作用|
|---|---|
|`tutor/`|`:Tutor` 教程文件|

普通用户几乎不用。`tutor/` 是 runtimepath 标准目录之一。

---

## 23. 推荐你实际使用的结构

如果你是写现代 Lua Neovim 配置，最常见、最清晰的是：

```text
~/.config/nvim/
  init.lua

  lua/
    options.lua
    keymaps.lua
    autocmds.lua
    plugins/
      init.lua
      lsp.lua
      treesitter.lua
      cmp.lua

  plugin/
    commands.lua

  ftplugin/
    python.lua
    lua.lua
    markdown.lua

  after/
    ftplugin/
      python.lua
      lua.lua
    lsp/
      lua_ls.lua
      pyright.lua
    queries/
      lua/
        highlights.scm

  lsp/
    lua_ls.lua
    pyright.lua

  ftdetect/
    mine.lua

  colors/
    mytheme.lua
```

最常用的几个目录可以这样记：

```text
init.lua        总入口
lua/            require() 用的模块
plugin/         启动自动加载
ftplugin/       按 filetype 加载
after/          后置覆盖
lsp/            v0.12.2 的内置 LSP config
after/lsp/      覆盖 LSP config
ftdetect/       自定义文件类型识别
queries/        Treesitter queries
colors/         colorscheme
```

一句话总结：**`init.lua` 管全局入口，`lua/` 管模块拆分，`plugin/` 管启动自动执行，`ftplugin/` 管单文件类型，`after/` 管覆盖默认/插件行为，`lsp/` 管 v0.12.2 内置 LSP server 配置。**