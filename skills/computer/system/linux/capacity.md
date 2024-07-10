# show disk capacity

```shell
df -lh
```

# show file size

```shell
ls -alh
```

# show folder size

use `ls` cannot show the total size of the folder. `ls` only show the size of the "folder" file: 4k

use the command below to show the size of a folder:

```shell
du -h --max-depth=1 | sort -h
```
