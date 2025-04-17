---
tags:
  - tutorial
  - system
  - linux
---
# Basics
## 创建账号

使用下面的命令创建一个基本的git用户

```shell
git config --global user.name <username>
git config --global user.email <email>
```

## 创建私钥公钥

```shell
ssh-keygen -o
```

配置一般保存在`~/.ssh`里面，`~/.ssh/id_rsa`是私钥，`~/.ssh/id_rsa.pub`是公钥。

将公钥上传至github的ssh配置里面即可使用ssh进行clone

## github连接不通

clone使用ssh通道报错443

> 使用`ssh -T git@github.com`进行测试

在`~/.ssh/config`里面添加一个新的Host:

```
Host github.com
  User git
  Hostname ssh.github.com
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa
  Port 443
```

然后测试应该就可以了。

# Pull and Push

## create repo

```shell
mkdir <repo_name> # create a folder
cd <repo_name> # change directory into the repo folder
git init # init a git repo
```


## branch

there could be many branch in one git repository.

use `git branch -M <name>` to change current branch name into `<name>`

use `git checkout <name>` to change to the branch named `<name>`. (advance usage of checkout [[git#checkout|here]])
## remote

use `git remote add <alias> <remote-url>` to add new remote repo.

use `git remote -v` to see all the remote and its alias.

use `git remote set-url <alias> <remote-url>` to change remote repo.

remote URL usually be `https://github.com/<username>/<repo_name>` or `git@github.com:<username>/<repo_name>` if already set ssh key.
## push

if we want to make our first push, we should specify the remote repo and branch: `git push <remote:origin> <branch:master>`. or we can use `-u` to make it the default: `git push -u origin master`.

after push with `-u`, we can simply use `git push` instead of specify the remote and branch.

## pull

should use after set remote.

just use `git pull` to update the local repo

## clone

you can pull a new repo anywhere into `<target>`: `git clone <remote_url> <target>`

use `--recursive` to pull [[git#Sub Module|sub-module]] if remote repo had

use `-b <branch_name>` to specify the branch want to

# Draw back
## Reset branch

use `git reset <commit>` to reset branch to the commit with hash `<commit>`.

use `--soft`: just change the branch to the commit, not with local code.

use `--hard`: change current local code to the commit.

## fixup commit

use `git commit --fixup <commit>` to make a fixup commit, which is a new commit with 'fixup!' in front of the commit that fixed up.

## reset only one file

use `git checkout <commit> <path/to/file>` to roll back the `<path/to/file>` to the state in `<commit>`(hash code of commit)

## amend commit

use `git commit --amend` to amend a change you just change. you can use `git commit --amend -m "..."` to commit some amend message, or just simply `git commit --amend --no-edit` without changing commit message, which will replace the incomplete commit.

# Sub Module
## add

if we use some others' git repo, we should use submodule to specify.

use command below to add a git submodule.

```shell
git submodule add [-b <branch>] <repo-url> <path/to/repo>
```

after the command, git will create a new file `.gitmodule` to keep the infomation about submodule.

> [!tips]
> some times, if the `<path/to/repo>` has been add into the cache, we should remove the folder from the cache first.
> 
> use `git rm <path/to/repo>` to remote it from cache, then use `git submodule ...` add it back to the cache

## pull

### clone

sometimes, we clone the repo without `--recursive`.

if we want to clone the submodule, we can simply run the command below:

```shell
git submodule update --init --recursive
```

### sync for url

this is not for update the repository.

sometimes, the upstream project change the submodule to point to a different url. but git doesn't allow to change your local configuration, so your local submodule still point to the old url.

then, you should use `git submodule sync` to update the new url.

that is, use `sync` to re-synchronizes the information in `.git/config` with the information in `.gitmodules`.

## push

after we make change in submodule, the commit will not be pushed to the remote repo because that the submodule was deteach from remote repository.

so we should first connect to the remote at some branch:

```shell
git checkout <branch>
```

then we can push the code normally.

after pushing submodule, you should also commit the main repo.

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

# Log
## show commit

use `git log --oneline` or `git log` to check the commits.

## show stage

use `git status` to show the file that was changed locally.

# GUI

use `lazygit` to use a TUI program.