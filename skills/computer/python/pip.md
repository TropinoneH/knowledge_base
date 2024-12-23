# install

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

# cache

只有`pip --version`大于23的时候才有cache这个命令(至少`v20.0`的时候没有)

时常会出现缓存内容过多的问题, 可以通过清理缓存的方式减少空间占用.

```bash
pip cache info # 展示缓存信息
pip cache remove [partten] # 删除单个文件
pip cache purge # 清理所有的缓存信息
```
