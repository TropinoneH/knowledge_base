# Run
运行一个image, 启动成为一个container.

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

## 查看
```shell
sudo docker container ls
```

## 停止
```shell
sudo docker container stop <container_id> -f
```

# attach
如果想要进入一个container, 那么需要使用
```shell
sudo docker attach <container_id>
```
进入container

如果想要结束一个container, 那么直接使用exit退出或者<kbd>Ctrl+d</kbd>结束这个shell

如果退出但不结束容器, 可以使用<kbd>Ctrl+p+q</kbd>(<kbd>Ctrl</kbd>键不松开即可)
