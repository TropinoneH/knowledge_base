# Reset branch

use `git reset <commit>` to reset branch to the commit with hash `<commit>`.

use `--soft`: just change the branch to the commit, not with local code.

use `--hard`: change current local code to the commit.

# fixup commit

use `git commit --fixup <commit>` to make a fixup commit, which is a new commit with 'fixup!' in front of the commit that fixed up.

# reset only one file

use `git checkout <commit> <path/to/file>` to roll back the `<path/to/file>` to the state in `<commit>`(hash code of commit)

# amend commit

use `git commit --amend` to amend a change you just change. you can use `git commit --amend -m "..."` to commit some amend message, or just simply `git commit --amend --no-edit` without changing commit message, which will replace the incomplete commit.
