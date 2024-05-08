# add

if we use some others' git repo, we should use submodule to specify.

use command below to add a git submodule.

```shell
git submodule add [-b <branch>] <repo-url> <path/to/repo>
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

## sync for url

this is not for update the repository.

sometimes, the upstream project change the submodule to point to a different url. but git doesn't allow to change your local configuration, so your local submodule still point to the old url.

then, you should use `git submodule sync` to update the new url.

that is, use `sync` to re-synchronizes the information in `.git/config` with the information in `.gitmodules`.

# push

after we make change in submodule, the commit will not be pushed to the remote repo because that the submodule was deteach from remote repository.

so we should first connect to the remote at some branch:

```shell
git checkout <branch>
```

then we can push the code normally.

after pushing submodule, you should also commit the main repo.

e.g.

```shell
cd sub
git checkout master
git add .
git commit "..."
git push
# back to main repo
cd ..
git add sub
git commit "update submodule: sub"
git push
```

---

if we commit some changes before checkout, we can use some command below:

```shell
cd sub
git add .
git commit "..."
git checkout master
# supposed that the commit hash is 1234567
git branch new 1234567
git merge 1234567
git push
# same
cd ..
git add sub
git commit "......"
git push
```
