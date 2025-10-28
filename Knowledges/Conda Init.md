---
type: command
tags:
  - cli
  - code/python
done: true
topic:
  - "[[Conda]]"
  - "[[Coding]]"
---
# Init

在[[Conda Install|安装]]的时候, 会询问是否全部初始化[[Shell]], 默认是`no`

针对单一的[[Shell]]进行初始化:
```bash
conda init <shell>
```

会在shell的配置脚本中出现:
#system/linux/ubuntu zsh shell:
```zsh
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$($HOME/miniconda3/bin/conda 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$HOME/miniconda3/etc/profile.d/conda.sh" ]; then
        . "$HOME/miniconda3/etc/profile.d/conda.sh"
    else
        export PATH="$HOME/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

#system/MacOS fish shell, 使用[[Homebrew]]安装:
```fish
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
if test -f /opt/homebrew/Caskroom/miniconda/base/bin/conda
    eval /opt/homebrew/Caskroom/miniconda/base/bin/conda "shell.fish" "hook" $argv | source
else
    if test -f "/opt/homebrew/Caskroom/miniconda/base/etc/fish/conf.d/conda.fish"
        . "/opt/homebrew/Caskroom/miniconda/base/etc/fish/conf.d/conda.fish"
    else
        set -x PATH "/opt/homebrew/Caskroom/miniconda/base/bin" $PATH
    end
end
# <<< conda initialize <<<
```

这个会导致shell启动速度变慢

# Mirror

换源, 编辑(或创建)`~/.condarc`:
```yaml
channels:
- defaults
show_channel_urls: true
default_channels:
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
- conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
- pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

# Hide Environment in Prompt

激活环境之后会在shell的prompt中展示环境名称(如, `(base)`), 如果已经配置了别的显示方法, 那么需要隐藏这个环境名称. 在`~/.condarc`中写入:

```yaml
changeps1: false
```
