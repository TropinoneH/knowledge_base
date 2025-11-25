---
type: system
tags:
  - software
  - system/linux
  - cli
done: false
topic:
 - "[[System]]"
---
# Linux File System Permission

在 Linux 和其他类 Unix 操作系统中，文件系统权限是实现多用户环境安全性的核心基石。它规定了谁可以对文件或目录执行何种操作。理解这个系统对于任何 Linux 用户或管理员都至关重要。

## Permission

Linux 的权限模型围绕三个基本维度构建：

1. 访问者 (Who):
    - `u` - 所有者 (User/Owner): 创建文件或目录的用户。
    - `g` - 所属组 (Group): 一个用户组，组内所有成员拥有相同的权限。这使得向多个用户授予权限变得容易。
    - `o` - 其他用户 (Others): 系统上既不是所有者也非所属组成员的任何其他用户。
    - `a` - 所有用户 (All): 代表以上三者的总和 (`u`, `g`, 和 `o`)。
2. 权限类型 (What):
    - `r` - 读 (Read): 读取文件内容或查看目录中的条目列表。
    - `w` - 写 (Write): 修改文件内容，或在目录中创建、删除、重命名文件。
    - `x` - 执行 (Execute): 将文件作为程序运行，或进入 (cd) 一个目录。

### Check Permission

使用 `ls -l` 命令可以查看文件和目录的详细信息，其中第一列就是权限描述。

例如，查看一个名为 `myscript.sh` 的文件：
```bash
$ ls -l myscript.sh
-rwxr-xr-- 1 user dev_team 4096 Oct 26 10:00 myscript.sh
```

让我们来分解这行信息的权限部分 `-rwxr-xr--`：

| 位置  | 字符 | 含义                                               |
| :---- | :--- | :------------------------------------------------- |
| 1 | `-`  | 文件类型。`-` 代表普通文件，`d` 代表目录，`l` 代表符号链接。 |
| 2-4 | `rwx`| 所有者 (u) 的权限：可读、可写、可执行。        |
| 5-7 | `r-x`| 所属组 (g) 的权限：可读、不可写、可执行。      |
| 8-10| `r--`| 其他用户 (o) 的权限：仅可读，不可写、不可执行。 |

## Permission for Folder and File

`r`, `w`, `x` 权限对于文件和目录的意义是不同的，这一点非常重要。

| 权限     | 对文件的作用                                     | 对目录的作用                                      |
| :----- | :----------------------------------------- | :------------------------------------------ |
| r (读)  | 可以查看文件的内容 (例如使用 `cat`, `less`, `more` 命令)。 | 可以列出目录中包含的文件和子目录名 (例如使用 `ls` 命令)。           |
| w (写)  | 可以修改或删除文件的内容。                              | 可以在目录中创建、删除、重命名文件和子目录 (即使文件本身不可写)。          |
| x (执行) | 可以将文件作为程序或脚本来运行。                           | 可以进入该目录 (例如使用 `cd` 命令)。**这是访问目录内任何内容的先决条件** |

关键点: 如果你想读取一个文件 (例如 `/dir/file.txt`)，你不仅需要该文件的 `r` 权限，还需要对 `dir` 目录拥有 `x` (执行) 权限，才能"进入"该目录。

# Change Permission

`chmod` (change mode) 命令是用来修改文件和目录权限的工具。它有两种主要的使用模式：**符号模式**和**数字模式**。

### Symbolic Mode

这种模式更直观，易于理解。其基本语法是：
`chmod [用户类别][操作符][权限] 文件/目录`

- 用户类别: `u`, `g`, `o`, `a` (如上所述)。
- 操作符:
    - `+`: 添加权限。
    - `-`: 移除权限。
    - `=`: 精确设置权限 (覆盖原有权限)。
- 权限: `r`, `w`, `x`。

示例:
```bash
# 为所有者添加执行权限
chmod u+x myscript.sh

# 移除所属组的写权限
chmod g-w shared_folder

# 为其他用户设置仅可读的权限
chmod o=r config.file

# 为所有用户（所有者、组、其他）都添加读权限
chmod a+r notice.txt

# 同时进行多个设置
chmod u=rwx,g=rx,o=r some_file
```

### Octal Mode

数字模式使用一个三位数的八进制数字来一次性设置所有者、组和其他用户的权限。每个数字由 `r`, `w`, `x` 的值相加而成。

- `r` (读) = 4
- `w` (写) = 2
- `x` (执行) = 1

**权限组合:**

| 数字 | 权限 (`rwx`) | 描述           |
| :--- | :----------- | :------------- |
| 7    | `rwx`        | 读、写、执行   |
| 6    | `rw-`        | 读、写         |
| 5    | `r-x`        | 读、执行       |
| 4    | `r--`        | 只读           |
| 3    | `-wx`        | 写、执行       |
| 2    | `-w-`        | 只写           |
| 1    | `--x`        | 只执行         |
| 0    | `---`        | 无任何权限     |

语法:
`chmod [所有者权限数字][组权限数字][其他用户权限数字] 文件/目录`

常用示例:
- `chmod 755 my_script.sh`
    - 所有者: 7 (`rwx`)
    - 所属组: 5 (`r-x`)
    - 其他用户: 5 (`r-x`)
    - 结果: `-rwxr-xr-x` (这是脚本和程序的典型权限)
- `chmod 644 data.txt`
    - 所有者: 6 (`rw-`)
    - 所属组: 4 (`r--`)
    - 其他用户: 4 (`r--`)
    - 结果: `-rw-r--r--` (这是普通文本文件的典型权限)
- `chmod 777 temporary_data`
    - 所有者, 组, 其他用户: 均为 7 (`rwx`)
    - 结果: `-rwxrwxrwx` (这是一个非常宽松的权限，任何用户都有完全的控制权，请谨慎使用)

## Recursive

如果你想修改一个目录以及其下所有文件和子目录的权限，可以添加 `-R` (recursive) 参数。

```bash
# 递归地为 shared_docs 文件夹及其所有内容移除其他用户的写权限
chmod -R o-w shared_docs
```

**警告:** 使用 `chmod -R` 时要格外小心，因为它会无差别地改变所有子项的权限。如您之前的问题所述，对文件和目录应用相同的权限通常不是最佳实践。更好的方法是结合 `find` 命令进行精细化操作。

## For Specific Files

如果想要针对特定条件的文件执行操作, 如, 仅对文件夹执行chmod, 那么可以结合`find`指令搜索:
```bash
find <path> -type d -exec chmod +x {} +
```
最后的加号表示将多条指令合并成一个指令执行

> [!example] 
> ```bash
> # 1. 给所有文件夹添加 rwx 权限
> find my_folder -type d -exec chmod o+rwx {} +
> # 2. 给所有文件添加 rw 权限
> find my_folder -type f -exec chmod o+rw {} +
> # 3. 给原本可执行的文件额外添加 x 权限
> find my_folder -type f -perm /a=x -exec chmod o+x {} +
> ```

# Group
在 Linux 系统中，Group（组）不仅仅是一个权限标签，它是系统管理员高效管理多用户权限的核心机制。通过将用户归类到不同的组中，管理员可以一次性对一组用户授予对特定文件或资源的访问权限，而无需针对每个用户单独设置。

## Group Concepts

Linux 用户组主要分为两种类型。第一种是主组（Primary Group），这是用户在创建文件时默认赋予该文件的组，通常与用户名相同。第二种是附加组（Secondary or Supplementary Group），用户可以属于多个附加组，这通常用于授予用户对特定项目或系统资源的额外访问权限。

## Group Management Commands

对于组本身的增删改查，系统提供了一套直观的命令。这些操作通常需要 root 权限或使用 `sudo` 执行。

### Creating a Group

使用 `groupadd` 命令可以在系统中创建一个新的组。这是搭建协作环境的第一步。例如，若要创建一个名为 `developers` 的组，只需运行命令:
```bash
sudo groupadd developers
```

系统会将新的组信息写入 `/etc/group` 文件中。
### Deleting a Group

当一个项目结束或组不再需要时，可以使用 `groupdel` 命令将其移除。例如，删除名为 `developers` 的组使用命令 `sudo groupdel developers`。需要注意的是，如果该组是某个用户的主组，系统通常会阻止删除操作，必须先修改该用户的主组设置。

### Modifying a Group

如果需要更改组的名称，可以使用 `groupmod` 命令配合 `-n` 选项。例如，将 `developers` 组重命名为 `dev_team`，命令:
```bash
sudo groupmod -n dev_team developers
```
这个操作只会修改组名，组的 ID（GID）保持不变，因此文件系统中的权限关联通常不会受到影响。

## User Management Commands

用户是组的成员，因此管理组权限往往离不开对用户的创建与管理。

### Creating a User

`useradd` 命令用于创建新用户。虽然它有许多选项，但在实践中通常建议使用 `-m` 选项来自动创建用户的家目录，并使用 `-s` 指定默认的 Shell。

例如，创建一个名为 `alice` 的新用户，为其创建家目录并指定 Bash 为 Shell：
```bash
sudo useradd -m -s /bin/bash alice
```

新创建的用户默认处于锁定状态，需要使用 `passwd` 命令为其设置密码才能登录：
```bash
sudo passwd alice
```

### Deleting a User

当需要从系统中移除用户时，使用 `userdel` 命令。为了彻底清理，通常建议加上 `-r` 选项，这会在删除用户账号的同时一并删除其家目录和邮件池。

命令示例：
```bash
sudo userdel -r alice
```

### Modifying a User

`usermod` 是一个非常强大的命令，用于修改现有用户的属性。除了修改组归属（将在下一节详细介绍），它还可以用来锁定用户账户（`-L`）或解锁用户账户（`-U`），以及修改用户的登录 Shell 或主目录。

## Managing User Group Membership

这是权限管理中最频繁使用的操作之一。将用户添加到特定组，即可让该用户获得该组拥有的文件访问权限。

### Adding a User to a Group

将用户添加到附加组时，务必小心使用 `usermod` 的参数。必须同时使用 `-a` (append) 和 `-G` (groups) 选项。`-a` 选项至关重要，因为它告诉系统将用户追加到新组中，而不是覆盖用户当前所属的所有附加组。

例如，将用户 `alice` 添加到 `developers` 组：
```bash
sudo usermod -aG developers alice
```

如果遗漏了 `-a` 选项，用户将被移出除了 `developers` 之外的所有其他附加组，这可能会导致严重的权限丢失问题。

### Checking Group Membership

在修改权限后，可以使用 `groups` 命令查看特定用户所属的所有组。例如 `groups alice`。另外，`id` 命令可以提供更详细的信息，包括用户的 UID、主组 GID 以及所有附加组的 GID。

值得注意的是，当用户被添加到新组后，更改不会立即在当前登录的会话中生效。用户通常需要注销并重新登录，或者使用 `newgrp` 命令来刷新当前的组会话。

## Changing File Ownership

在 Linux 中，每个文件都属于一个所有者和一个组。`ls -l` 输出的第三列和第四列分别显示了这两个属性。要修改文件的归属，主要使用 `chown` 和 `chgrp` 命令。

### Using chown

`chown` (change owner) 功能最为全面，它可以同时修改文件的所有者和所属组。其语法格式通常为 `用户:组`。

例如，将 `project_code.py` 的所有者改为 `alice`，所属组改为 `developers`：
```bash
sudo chown alice:developers project_code.py
```

如果只想修改所有者，可以省略冒号和组名：
```bash
sudo chown alice project_code.py
```

如果只想修改所属组，可以在冒号前留空（或者使用 `chgrp` 命令）：
```bash
sudo chown :developers project_code.py
```

### Using chgrp

`chgrp` (change group) 命令专门用于修改文件的所属组，功能比 `chown` 单一，但在某些脚本或特定场景下语义更明确。

例如，将 `docs` 目录的所属组改为 `editors`：
```bash
sudo chgrp editors docs
```

与 `chmod` 类似，`chown` 和 `chgrp` 都支持 `-R` 选项，用于递归地修改目录及其内部所有文件的归属。

## Collaborative Directories and SGID

在团队协作场景中，仅仅创建组和添加用户往往是不够的。默认情况下，用户在一个目录下创建新文件时，文件的所属组是该用户的主组，而不是目录的所属组。这意味着团队中的其他成员可能只有只读权限，甚至无法访问。

为了解决这个问题，可以使用特殊权限位 **SGID** (Set Group ID)。

当在一个目录上设置了 SGID 位后，在该目录下创建的任何新文件或子目录，将自动继承父目录的所属组，而不是创建者的主组。这确保了属于同一组的成员可以持续地共享和编辑彼此创建的文件。

### Setting SGID

设置 SGID 的方法是在 `chmod` 命令中使用 `g+s`。

假设我们有一个共享目录 `/var/www/html`，属于 `webdev` 组。为了让组内成员能够协作编辑：

1. 确保目录属于正确的组：
   ```bash
   sudo chgrp webdev /var/www/html
   ```
2. 赋予组写权限，以便成员可以创建文件：
   ```bash
   sudo chmod g+w /var/www/html
   ```
3. 设置 SGID 位：
   ```bash
   sudo chmod g+s /var/www/html
   ```

设置完成后，使用 `ls -l` 查看权限时，你会发现组权限的执行位变为了 `s`（例如 `drwxrwsr-x`）。这标志着该目录已配置为协作友好的共享空间。
