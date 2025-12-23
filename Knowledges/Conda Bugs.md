---
type: command
tags:
  - cli
  - code/python
  - error
done: false
topic:
  - "[[Conda]]"
  - "[[Coding]]"
---
# Fish Shell Status

使用[[Shell#Fish|fish shell]]并使用[[Conda Activate]]的时候, 返回值是`4`而不是`0`, 虽然不影响功能, 但是这个error会很不好看

> [!question]- 原因
> 详情参考[Conda Issue #14659](https://github.com/conda/conda/issues/14659)
> 
> 是因为为了修复[[Shell#PowerShell|PowerShell]]的bug, 将 environment variable 的值从`""`改成了`None`, 导致这个var在fish shell中消失. 但是在[activate.py](https://github.com/conda/conda/blob/main/conda/activate.py#L971)中, 仍然尝试清除这两个shell, 导致return status 为`4`

解决方案: 这个[pr](https://github.com/conda/conda/pull/14517), 但是不知道为什么没有[[Git Merge|merge]]到主分支, 也没有[[Git Release|release]]

> [!question]- 解决方案
> 在`miniconda3/lib/python3.x/site-packages/conda/activate.py`中, 搜索`set -e`(大概在961行), 有一个`unset_var_tmpl = "set -e %s"`, 改成`unset_var_tmpl = "set -e %s || true"`即可
# Fish Source Activate

[[Shell#Fish|fish shell]]无法使用下面的命令直接启动:
```bash
source <path/to/miniconda3>/bin/activate <env_name>
```

因为`activate`是[[Shell#Bash|bash]]语法, 无法使用fish运行

这个没有解决方案, 只能使用[[Conda Activate]](即`conda init fish`然后`conda activate <env_name>`)

# `conda: command not found` or `conda: error: argument COMMAND`

使用命令`conda init <shell>`进行初始化（`<shell>`指的是你想要使用conda的shell）
# The current environment has been corrupted

查看在哪个package出现了问题，直接删掉相关的包（文件夹`~/miniconda3/pkgs/<pkg_name>`和文件`~/miniconda3/pkgs/<pkg_name>.conda`，还有文件`~/miniconda3/conda-meta/<pkg_name>.json`）

删除掉之后，重新运行`conda update --all`，即可恢复

# `environment.yml` not exist

没有进入conda环境(没有activate base或者其他env), 使用:
```shell
conda activate
```
