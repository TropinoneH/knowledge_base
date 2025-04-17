---
tags:
  - tutorial
  - python
---
# pip
## Install

临时使用镜像源:
```bash
pip install pkg -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

持久化设置镜像源:
```bash
pip config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple
```

配置多个镜像源:
```bash
pip config set global.extra-url "<extra-url-1> <extra-url-2> ..."
```

安装本地whl:
1. 下载whl文件到本地
2. 运行`pip install <path/to/whl>`, 不需要其他参数指定

安装仓库(`setup.py`)
1. 本地仓库:
  ```bash
  pip install -e .
  ```
2. 远程仓库
  使用`git`下载到本地, 或者使用:
  ```bash
  pip install "git+https://github.com/.../..."
  ```

更新方式:
```bash
python -m pip install --upgrade pip
```

### `requirements.txt`

some project has their own requirements, and write into a file named `requirements.txt`.

use `pip install -r requirements.txt` to install all dependencies(usually not all, maybe make mistake by project owner)

## Cache

只有`pip --version`大于23的时候才有cache这个命令(至少`v20.0`的时候没有)

时常会出现缓存内容过多的问题, 可以通过清理缓存的方式减少空间占用.

```bash
pip cache info # 展示缓存信息
pip cache remove [partten] # 删除单个文件
pip cache purge # 清理所有的缓存信息
```

# import package from other position

```python
import sys

sys.path.append("<parent/path/to/package>")
```

then, we can import the package from other location.

some packages are built-in with python, such as `os`, `sys`, `math`, etc.

some packages need to download(by pip), such as `numpy`, `pandas`, etc.

# run a module

use `python -m <path/to/module>` to run a module directly.

args can simply append of the command: `python -m <path/to/module> <args...>`