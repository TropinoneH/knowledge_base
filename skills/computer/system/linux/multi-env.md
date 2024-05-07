# conda

可以使用miniconda(推荐)或者anaconda来进行多个环境的管理，但是也可以使用`python -m venv ./venv`在当前文件夹下创建一个venv文件夹，通过`source ./venv/bin/activate`来激活当前的虚拟环境。

conda相关的内容请参考[这里](../../python/miniconda/init.md)

# cuda

如果电脑上安装了多个Cuda环境，可以直接在zshrc里面引用`/usr/local/cuda/bin`作为cuda的目录，然后就可以通过下面的指令切换Cuda：

```shell
sudo update-alternatives --config cuda
```

如果是新安装了一个Cuda，那么需要通过下面的指令进行识别：

```shell
sudo update-alternatives --install "/usr/local/cuda" "cuda" "<path/to/cuda/folder>" <priority>
```

`<priority>`指的是默认的权重，`<path/to/cuda/folder>`通常是`/usr/local/cuda-xx.x`这样的路径

# Java

首先先下载对应版本的java包，通常是使用`wget`来下载。

解压安装包，然后将解压后的文件夹移动到`/usr/lib/jvm/java-xx-openjdk-amd64`文件夹下，其中`xx`表示版本号。

然后通过`update-alternatives`来设置默认的java对应的版本：

```shell
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/bin/jvm/java-xx-openjdk-amd64/bin/java" <priority>
```

其中，`<priority>`需要替换成优先级，优先级越高，auto模式就会优先调用。

# update-alternatives

使用参数`--install`时接受三个参数

第一个参数表示目标软连接的位置（相当于将你自己的版本直接存在了`<path>`里面）

第二个参数用于后续快捷调整版本（相当于label）

第三个参数是用于替换的位置，只需要在zshrc里面引用这个位置就可以直接通过`sudo update-alternatives --config <label>`进行选择版本

但是这个只是创建了一个软连接，而不是直接修改默认配置
