---
type: software
tags:
  - cli
  - code
  - code/python
  - system/linux
  - docker
done: false
topic:
  - "[[System]]"
---

# Installation

首先安装必要的依赖:
```shell
apt install wget curl
```

安装必须的软件:
```shell
apt install git zsh tmux htop ranger
```

starship需要通过官网脚本进行安装:
```shell
curl -sS https://starship.rs/install.sh | sh
```

注意脚本会自动检测服务器架构. 请你记住, 后续会使用

前往github的[btop仓库](https://github.com/aristocratos/btop). 找到右侧的Release, 点击进入. 部分架构的release包可能被隐藏.

根据自己的服务器架构找到合适的release包. 
```shell
tar -xjf .tbz
```

安装lazygit: github. 解压:
```shell
tar -xvzf .tar.gz
```

编程相关:
conda:
```shell
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```



# Configuration

install zsh plugins:

```shell
git clone https://github.com/zsh-users/zsh-syntax-highlighting .zsh/zsh-syntax-highlighting
```

```shell
git clone https://github.com/zsh-users/zsh-autosuggestions .zsh/zsh-autosuggestions
```

zshrc:
```
export PATH="$HOME/.local/bin":$PATH

eval "$(starship init zsh)"

export TERM=xterm-256color
export HISTFILE=~/.zsh_history
export HISTSIZE=100000
export SAVEHIST=100000
setopt SHARE_HISTORY
setopt INC_APPEND_HISTORY
setopt EXTENDED_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE

# auto suggestions history configuration
bindkey -e
# [PageUp] - Up a line of history
if [[ -n "${terminfo[kpp]}" ]]; then
  bindkey -M emacs "${terminfo[kpp]}" up-line-or-history
  bindkey -M viins "${terminfo[kpp]}" up-line-or-history
  bindkey -M vicmd "${terminfo[kpp]}" up-line-or-history
fi
# [PageDown] - Down a line of history
if [[ -n "${terminfo[knp]}" ]]; then
  bindkey -M emacs "${terminfo[knp]}" down-line-or-history
  bindkey -M viins "${terminfo[knp]}" down-line-or-history
  bindkey -M vicmd "${terminfo[knp]}" down-line-or-history
fi
# Start typing + [Up-Arrow] - fuzzy find history forward
autoload -U up-line-or-beginning-search
zle -N up-line-or-beginning-search
bindkey -M emacs "^[[A" up-line-or-beginning-search
bindkey -M viins "^[[A" up-line-or-beginning-search
bindkey -M vicmd "^[[A" up-line-or-beginning-search
if [[ -n "${terminfo[kcuu1]}" ]]; then
  bindkey -M emacs "${terminfo[kcuu1]}" up-line-or-beginning-search
  bindkey -M viins "${terminfo[kcuu1]}" up-line-or-beginning-search
  bindkey -M vicmd "${terminfo[kcuu1]}" up-line-or-beginning-search
fi
# Start typing + [Down-Arrow] - fuzzy find history backward
autoload -U down-line-or-beginning-search
zle -N down-line-or-beginning-search
bindkey -M emacs "^[[B" down-line-or-beginning-search
bindkey -M viins "^[[B" down-line-or-beginning-search
bindkey -M vicmd "^[[B" down-line-or-beginning-search
if [[ -n "${terminfo[kcud1]}" ]]; then
  bindkey -M emacs "${terminfo[kcud1]}" down-line-or-beginning-search
  bindkey -M viins "${terminfo[kcud1]}" down-line-or-beginning-search
  bindkey -M vicmd "${terminfo[kcud1]}" down-line-or-beginning-search
fi

# [Home] - Go to beginning of line
bindkey -M emacs "^[[H" beginning-of-line
bindkey -M viins "^[[H" beginning-of-line
bindkey -M vicmd "^[[H" beginning-of-line
# [End] - Go to end of line
bindkey -M emacs "^[[F"  end-of-line
bindkey -M viins "^[[F"  end-of-line
bindkey -M vicmd "^[[F"  end-of-line

# [Shift-Tab] - move through the completion menu backwards
if [[ -n "${terminfo[kcbt]}" ]]; then
  bindkey -M emacs "${terminfo[kcbt]}" reverse-menu-complete
  bindkey -M viins "${terminfo[kcbt]}" reverse-menu-complete
  bindkey -M vicmd "${terminfo[kcbt]}" reverse-menu-complete
fi

# [Delete]
bindkey -M emacs "^[[3~" delete-char
bindkey -M viins "^[[3~" delete-char
bindkey -M vicmd "^[[3~" delete-char

# [Ctrl-Delete] - delete whole forward-word
bindkey -M emacs '^[[3;5~' kill-word
bindkey -M viins '^[[3;5~' kill-word
bindkey -M vicmd '^[[3;5~' kill-word

# [Ctrl-Backspace] - delete whole forward-word
bindkey -M emacs '^H' backward-kill-word
bindkey -M viins '^H' backward-kill-word
bindkey -M vicmd '^H' backward-kill-word

# [Ctrl-RightArrow] - move forward one word
bindkey -M emacs '^[[1;5C' forward-word
bindkey -M viins '^[[1;5C' forward-word
bindkey -M vicmd '^[[1;5C' forward-word
# [Ctrl-LeftArrow] - move backward one word
bindkey -M emacs '^[[1;5D' backward-word
bindkey -M viins '^[[1;5D' backward-word
bindkey -M vicmd '^[[1;5D' backward-word

# [Ctrl-d] - delete whole line
bindkey -M emacs '^D' kill-whole-line
bindkey -M viins '^D' kill-whole-line
bindkey -M vicmd '^D' kill-whole-line

source $HOME/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
source $HOME/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

alias cls=clear
alias ls="ls --color=tty"
alias ll="ls -alFh"
alias lg="lazygit"
alias btop="btop --force-utf"
```

dotfile: from github.com/eniverz/dotfiles

将tmux文件夹, 和starship的toml移动到.config文件夹中