# 初始化一个conda环境

首先，下载conda的sh文件（推荐使用`miniconda`，base环境比较简洁）

使用sudo运行（`sudo sh Miniconda3-latest-Linux-x86_64.sh`），然后按照引导进行安装

选择使用的shell进行初始化

## 可能出现问题的解决

如果会有`conda: command not found`或者`conda: error: argument COMMAND`的问题，那么需要对shell初始化。

使用命令`conda init $(shell)`进行初始化（$(shell)指的是你想要使用conda的shell）
