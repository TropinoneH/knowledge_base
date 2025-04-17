---
tags:
  - tutorial
  - system
  - linux
---
# Install
arch:
```shell
sudo pacman -S docker
```

Ubuntu/windows:
参考官网
# pull

从docker hub上下载一个docker, 但是可能需要换源.

## mirror

```shell
sudo vim /etc/docker/daemon.json
```

注意可能需要手动创建一个docker文件夹

然后里面输入

```json
{
  "registry-mirrors": [
    "https://a.ussh.net",
    "https://hub.rat.dev",
    "https://docker.1ms.run",
    "https://dytt.online",
    "https://func.ink",
    "https://docker.mybacc.com",
    "https://docker.yomansunter.com",
    "https://dockerhub.websoft9.com"
  ]
}
```

镜像源可能过期, 及时清理

更新镜像源之后, 重启docker服务

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```
## commit

将运行的container的修改保存成一个新的镜像

```shell
sudo docker commit <container_id> <image_name>:<image_tag>
```

## save

将一个image导出成`.tar`文件

```shell
sudo docker save <image_name>:<image_id> > <path/to/file.tar>
```

## load
将`.tar`文件加载成一个image

```shell
sudo docker load -i <path/to/file.tar>
```


# image

从docker hub拉取得到的是一个image, 相当于是一个虚拟机, 里面含有全部的环境和配置.

## list

```shell
sudo docker image ls
```

## remove

```shell
sudo docker image rm <image_hash>
# or
sudo docker rmi <image_hash>
```

# Run

使用Docker运行一个image, 启动成为一个container.
## GPU
需要下载nvidia-container-toolkit, 然后使用
```shell
nvidia-ctk runtime configure --runtime=docker
```
配置docker的nvidia runtime包

然后使用
```shell
sudo docker run --runtime=nvidia --gpus all -dit <docker_name>:<docker_tag>
```

## mount
```shell
sudo docker run -v <path/to/host>:<path/to/mount/in/docker> -dit <docker_name>:<docker_tag>
```

# container
启动一个image之后, 创建一个container. 所有在container里面的修改, 如果不使用commit保存, 那么不会对image产生影响

## list
列出所有正在运行的container:
```shell
sudo docker container ls
```
列出所有的docker(不管是否正在运行):
```shell
sudo docker container ls -a
```
## stop
```shell
sudo docker container stop <container_id> -f
```
## attach
如果想要进入一个container, 如果这个container还没有启动, 首先启动container:
```shell
sudo docker container start <container_id>
```
然后进入container:
```shell
sudo docker attach <container_id>
```
进入container

如果想要推出并stop一个container, 那么直接使用exit退出或者<kbd>Ctrl+d</kbd>结束这个shell. 这时container仍然存在, 但是不会运行, 此时仍可以通过上述命令进入

如果退出但不stop容器, 可以使用<kbd>Ctrl+p+q</kbd>(<kbd>Ctrl</kbd>键不松开即可)
