# commit
将运行的container的修改保存成一个新的镜像

```shell
sudo docker commit <container_id> <image_name>:<image_tag>
```

# save
将一个image导出成`.tar`文件

```shell
sudo docker save <image_name>:<image_id> > <path/to/file>
```

# load
将`.tar`文件加载成一个image

```shell
sudo docker load -i <path/to/file>
```
