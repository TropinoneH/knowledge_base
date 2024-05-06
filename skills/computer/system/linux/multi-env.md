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

和上面类似的，也是可以通过`sudo update-alternatives --config java`

安装也是类似的，使用`sudo update-alternatives --install "/etc/alternatives/java" "java" "<path/to/java/folder>" <priority>`进行配置

一般java安装位置在`/usr/lib/jvm/java-xx-openjdk-amd64`这个文件夹的位置
