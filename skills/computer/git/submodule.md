# add

if we use some others' git repo, we should use submodule to specify.

use command below to add a git submodule.

```shell
git submodule add <repo-url> <path/to/repo>
```

after the command, git will create a new file `.gitmodule` to keep the infomation about submodule.

> tips: some times, if the `<path/to/repo>` has been add into the cache, we should remove the folder from the cache first.
> use `git rm <path/to/repo>` to remote it from cache, then use `git submodule ...` add it back to the cache

# pull

## clone

sometimes, we clone the repo without `--recursive`.

if we want to clone the submodule, we can simply run the command below:

```shell
git submodule update --init --recursive
```

## sync

use `git submodule sync` to sync the submodule with remote repo.
