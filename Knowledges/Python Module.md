---
type: skills
tags:
  - code/python
  - cli
done: true
topic:
  - "[[Coding]]"
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

注意, 部分package的whl的名字和module的名字不一致, 如: `import cv2`需要下载`pip install opencv-python`.

### requirements.txt

类似[[Conda Environment#Create by Config|conda的yml文件]], pip也有一个自己的配置文件, 叫做`requirements.txt`.

这个文件中一般存放了所有的依赖想, 可以直接安装:
```shell
pip install -r requirements.txt
```

也可以将当前环境中安装的所有第三方库导出:
```shell
pip freeze > requirements.txt
```

但是经常是无法直接成功安装, 因为各种各样的问题, 如, 版本冲突, 编译失败等(对, 说你呢, [[PyTorch3D Install Error|pytorch3d]])

## Cache

只有`pip --version`大于23的时候才有cache这个命令(至少`v20.0`的时候没有)

时常会出现缓存内容过多的问题, 可以通过清理缓存的方式减少空间占用.

```bash
pip cache info # 展示缓存信息
pip cache remove [partten] # 删除单个文件
pip cache purge # 清理所有的缓存信息
```

# Import package

部分的packages是内置的, 如, `os`, `time`, `math`, `sys`, 等

还有一些packages是需要pip下载的, 如, `numpy`, `pytorch`, `cv2`(下载的package的名字叫做`opencv-python`), 等

还有一些packages是需要手动编译安装的, 如, `isaaclab`, `robosuite`, `robocasa`, 等. 使用


## import package from other position

如果当前的文件需要引用一个package(就是有`__init__.py`的文件夹)的时候, 如果通过相对文件路径找到的方式比较~~苦难~~困难, 那么可以直接将这个package的父文件夹的路径加到sys.path中, 或者加入到env中的`PYTHONPATH`中:

```python
import sys

sys.path.append("<parent/path/to/package>")
```

```shell
export PYTHONPAY=$PYTHONPAYH:<parent/path/to/package>
```

# Run Module

使用下面的命令直接运行一个python的module:
```shell
python -m <path/to/module>
```
如果是安装的库, 如`pip`或者`uvicorn`, 可以这样:
```shell
python -m <module_name>
```

参数可以直接附加在后面:
```shell
python -m <path/to/module> <args...>
# or
python -m <module_name> <args...>
```