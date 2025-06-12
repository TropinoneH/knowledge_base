---
tags:
  - tutorial
  - python
---
# 初始化一个conda环境

首先，下载conda的sh文件（推荐使用`miniconda`，base环境比较简洁）

使用sudo运行（`sudo sh Miniconda3-latest-Linux-x86_64.sh`），然后按照引导进行安装

选择使用的shell进行初始化

## 可能出现问题的解决

### `conda: command not found`或者`conda: error: argument COMMAND`

使用命令`conda init $(shell)`进行初始化（$(shell)指的是你想要使用conda的shell）
### The current environment has been corrupted

查看在哪个package出现了问题，直接删掉相关的包（文件夹`~/miniconda3/pkgs/<pkg_name>`和文件`~/miniconda3/pkgs/<pkg_name>.conda`，还有文件`~/miniconda3/conda-meta/<pkg_name>.json`）

删除掉之后，重新运行`conda update --all`，即可恢复

### 没有`environment.yml`

没有进入conda环境(没有activate base或者其他env), 使用:
```shell
conda activate
```

### 使用fish shell的status为4(不为0)

有一个为了powershell的commit的修改, 导致会尝试删除一个不存在的environment variable([issue](https://github.com/conda/conda/issues/14659), [fix](https://github.com/conda/conda/pull/14660/files))

修改文件 `<path/to/miniconda>/lib/python3.13/site-packages/conda/activate.py`, 在1066行左右有一个变量叫做`unset_var_tmpl`, 原来是:
```python
    unset_var_tmpl = "set -e %s"
```
修改成
```python
    unset_var_tmpl = "set -e %s || true"
```

### Terminals database is inaccessible

针对kitty-term(暂时只测试了这一个)

推测是安装cuda的时候会额外安装一个`clear`在`</path/to/conda>/env/<env_name>/bin/clear`的位置

直接将这个删除掉或者使用`/bin/clear`即可

## 换源

```shell
vim ~/.condarc
```
 
写入 Tsinghua Mirror:

```yaml
channels:
- defaults
show_channel_urls: true
default_channels:
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
- https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```


# 创建一个conda虚拟环境

`conda create -n <name> python=<version> <other:torch,...>=<version>`

# clean cache

```bash
conda clean --all
```

或者针对性清理:

```bash
conda clean -p # clean unused packages
```

```bash
conda clean -i # clean index
```

```bash
conda clean -l # remove log files
```

```bash
conda clean -t # remove package tarballs
```
