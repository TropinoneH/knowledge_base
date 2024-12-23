# clean cache

```bash
conda clean --all
```

或者针对性清理:

```bash
conda clean -p # clean unused packages
```

```bash
conda clean -i # clean index
```

```bash
conda clean -l # remove log files
```

```bash
conda clean -t # remove package tarballs
```
