---
type: command
tags:
  - cli
  - system/linux
done: true
---
# Pacman

是[[ArchLinux Install|Archlinux]]默认的包管理器. 由社区维护的包管理器(pacman增强版, 能够下载更多的pkg)是[[#Paru|paru]].

## Manual Install

一个包中只少包含`PKGBUILD`文件, 这个文件中配置了如何下载/编译/安装一个软件. 使用`makepkg`来安装一个包:
```bash
cd <path/to/pkg>
sudo makepkg -si
```

社区包可以通过[[Git Clone]]的方式下载:
```bash
git clone https://aur.archlinux.org/<pkg_name>
```

## Pacman Config

镜像源配置文件位于`/etc/pacman.d/mirrorlist`, 编辑这个文件以添加镜像:
```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

> [!tip]- 完整的`pacman.conf`
> ```
> #
> # /etc/pacman.conf
> #
> # See the pacman.conf(5) manpage for option and repository directives
> 
> #
> # GENERAL OPTIONS
> #
> [options]
> # The following paths are commented out with their default values listed.
> # If you wish to use different paths, uncomment and update the paths.
> #RootDir     = /
> #DBPath      = /var/lib/pacman/
> #CacheDir    = /var/cache/pacman/pkg/
> #LogFile     = /var/log/pacman.log
> #GPGDir      = /etc/pacman.d/gnupg/
> #HookDir     = /etc/pacman.d/hooks/
> HoldPkg     = pacman glibc
> #XferCommand = /usr/bin/curl -L -C - -f -o %o %u
> #XferCommand = /usr/bin/wget --passive-ftp -c -O %o %u
> #CleanMethod = KeepInstalled
> Architecture = auto
> 
> # Pacman won't upgrade packages listed in IgnorePkg and members of IgnoreGroup
> IgnorePkg   = linuxqq typora
> #IgnoreGroup =
> 
> #NoUpgrade   =
> #NoExtract   =
> 
> # Misc options
> #UseSyslog
> Color
> #NoProgressBar
> CheckSpace
> #VerbosePkgLists
> ParallelDownloads = 5
> DownloadUser = alpm
> #DisableSandbox
> ILoveCandy
> 
> # By default, pacman accepts packages signed by keys that its local keyring
> # trusts (see pacman-key and its man page), as well as unsigned packages.
> SigLevel    = Required DatabaseOptional
> LocalFileSigLevel = Optional
> #RemoteFileSigLevel = Required
> 
> # NOTE: You must run `pacman-key --init` before first using pacman; the local
> # keyring can then be populated with the keys of all official Arch Linux
> # packagers with `pacman-key --populate archlinux`.
> 
> #
> # REPOSITORIES
> #   - can be defined here or included from another file
> #   - pacman will search repositories in the order defined here
> #   - local/custom mirrors can be added here or in separate files
> #   - repositories listed first will take precedence when packages
> #     have identical names, regardless of version number
> #   - URLs will have $repo replaced by the name of the current repo
> #   - URLs will have $arch replaced by the name of the architecture
> #
> # Repository entries are of the format:
> #       [repo-name]
> #       Server = ServerName
> #       Include = IncludePath
> #
> # The header [repo-name] is crucial - it must be present and
> # uncommented to enable the repo.
> #
> 
> # The testing repositories are disabled by default. To enable, uncomment the
> # repo name header and Include lines. You can add preferred servers immediately
> # after the header, and they will be used before the default mirrors.
> 
> #[core-testing]
> #Include = /etc/pacman.d/mirrorlist
> 
> [core]
> Include = /etc/pacman.d/mirrorlist
> 
> #[extra-testing]
> #Include = /etc/pacman.d/mirrorlist
> 
> [extra]
> Include = /etc/pacman.d/mirrorlist
> 
> # If you want to run 32 bit applications on your x86_64 system,
> # enable the multilib repositories as required here.
> 
> #[multilib-testing]
> #Include = /etc/pacman.d/mirrorlist
> 
> [multilib]
> Include = /etc/pacman.d/mirrorlist
> 
> # An example of a custom package repository.  See the pacman manpage for
> # tips on creating your own repositories.
> #[custom]
> #SigLevel = Optional TrustAll
> #Server = file:///home/custompkgs
> ```

## Pacman Usage

**安装**
```shell
sudo pacman -S <pkg_name>
```

**更新packages索引**
```shell
sudo pacman -Sy
```

**滚动更新所有packages**
```shell
sudo pacman -Syyu
```

**卸载**
```shell
sudo pacman -Rsn <pkg_name>
```

**强制卸载**(ignore dependency):
> [!danger]
> this may cause lots of error.
> 
> please make sure you clearly know what you are doing
```shell
sudo pacman -Rdd <pkg_name>
```

**清理缓存**
```shell
sudo pacman -Scc
```

**在线搜索** (search all pkgs):
```
pacman -Ss <pkg_name>
```

**本地搜索** (with locally installed pkgs):
```shell
pacman -Qs <pkg_name>
```

# Paru

是[[#Pacman]]的增强版, 不仅包含了Pacman的官方源, 还包含了所有的[社区维护的软件](https://aur.archlinux.org)

用法与[[#Pacman Usage]]相同, 参数完全一致

## Install

下载`PKGBUILD`:
```bash
git clone https://aur.archlinux.org/paru
```

进入文件夹, 安装`paru`:
```bash
cd <path/to/paru/repo>
sudo makepkg -si
```

过程中会自动下载依赖, 包括 #code/go 语言的支持. 注意版本冲突