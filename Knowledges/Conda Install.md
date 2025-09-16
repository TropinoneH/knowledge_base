---
type: command
tags:
  - cli
  - code/python
done: true
---
# Conda Install

推荐使用[miniconda](https://www.anaconda.com/docs/getting-started/miniconda/install)(或者[miniforge](https://conda-forge.org/download/), 是开源版本, 没有商用风险). 相较于[anaconda](https://www.anaconda.com/docs/getting-started/anaconda/install), 这个的base环境比较小, 只有一些必要的packages, 减少了空间占用.

安装miniconda:
1. 下载安装程序(注意OS版本): `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh`
2. 添加运行权限: `chmod +x Miniconda3-latest-Linux-x86_64.sh`
3. 运行程序: `sh Miniconda3-latest-Linux-x86_64.sh`
	- 这里需要翻页到最下面, 然后手动输入`yes`以同意许可证. 这里注意不要按住<kbd>enter</kbd>翻页(或者按的速度过快), 可能会直接走默认的`no`导致结束安装

安装结束之后, 需要让[[Shell]]知道conda环境, 使用`conda init <shell>`对shell的config进行更新.

> [!warning]+ fish shell
> 使用`conda`+[[Shell#Fish|fish shell]]的时候会有很多的bug, 因为fish shell不支持原生的bash语法.
> 
> 如, [[Conda Bugs#Fish Shell Status|conda activate之后的status不是0]], [[Conda Bugs#Fish Source Activate|无法使用source activate]], 等
