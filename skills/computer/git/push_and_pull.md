# push

firstly, we init a git repo by`git init`.

we can use `git remote add origin git@github.com:<user>/<repo.git>` to add remote repo alias origin.

also, we can use `git branch -M <name>` to change current branch name to `<name>`.

if we want to make our first push, we should specify the remote repo and branch: `git push <remote:origin> <branch:master>`. or we can use `-u` to make it the default: `git push -u origin master`.

after push with `-u`, we can simply use `git push` instead of specify the remote and branch.

# pull

should use after set remote.

just use `git pull` to update the local repo

# remote

use `git remote add <alias> <remote-url>` to add new remote repo.

use `git remote -v` to see all the remote and its alias.

use `git remote set-url <alias> <remote-url>` to change remote repo.
