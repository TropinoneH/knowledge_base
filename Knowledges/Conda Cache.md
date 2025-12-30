---
type: command
tags:
  - cli
  - code/python
  - software
done: true
topic:
  - "[[Coding]]"
  - "[[Conda]]"
---
# Conda Cache CLI Notes

## View Cache Information

查看当前 [[Conda Config|Conda配置]]的缓存路径以及各个路径的使用情况.

`conda info`

在输出信息中寻找 `package cache` 字段, 它列出了当前所有用于存储包文件的目录路径.

## Cleanup Commands

核心命令是 `conda clean`. 该命令用于清理不再需要的文件以释放磁盘空间. 建议定期运行.

### Delete Downloaded Tarballs

`conda clean -t`

或者完整写法:
`conda clean --tarballs`

该命令删除 `pkgs` 目录下已下载的压缩包 (如 `.tar.bz2` 或 `.conda` 文件).
由于 Conda 安装时是解压后链接到虚拟环境, 删除这些压缩包不会影响已安装环境的正常运行. 这是最安全的清理方式.

### Delete Unused Packages

`conda clean -p`

或者完整写法:
`conda clean --packages`

该命令删除 `pkgs` 目录下那些未被任何当前虚拟环境引用的解压后的包目录.
通常发生在环境被删除或包被更新后, 旧版本的解压文件残留. 执行前 Conda 会列出将被删除的文件清单供确认.

### Delete Index Cache

`conda clean -i`

或者完整写法:
`conda clean --index-cache`

该命令清除缓存的索引文件 (repodata).
当镜像源更新了包但本地搜索不到, 或者出现莫名其妙的依赖解析错误时, 执行此命令强制重新下载最新的索引数据.

### Delete All Cache

`conda clean -a`

或者完整写法:
`conda clean --all`

这是最彻底的清理命令. 它等同于同时执行 `-t`, `-p`, `-i` 以及移除锁文件.
执行后可以释放最大量的磁盘空间, 但下次安装包时需要重新下载索引和包文件.

### Non-Interactive Execution

`conda clean -a -y`

添加 `-y` (或 `--yes`) 参数可以跳过确认步骤, 直接执行删除. 常用于 Dockerfile 构建脚本或自动化脚本中.

## Cache Configuration

### Custom Cache Location

如果不希望缓存占用系统盘空间, 可以修改 `.condarc` 文件 (通常位于用户主目录) 中的 `pkgs_dirs` 设置.

配置示例:

```yaml
pkgs_dirs:
  - /path/to/large/disk/conda_pkgs
  - /opt/anaconda/pkgs
```

Conda 会按顺序读取路径, 并将新下载的包写入第一个具有写权限的目录.

### Verify Configuration

配置修改后, 再次运行以下命令确认生效:

`conda config --show pkgs_dirs`