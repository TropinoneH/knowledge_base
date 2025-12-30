---
type: command
tags:
  - cli
  - code/python
  - software
done: true
topic:
  - "[[Coding]]"
  - "[[Conda]]"
---
# Conda Config CLI Notes

## View Configuration

### Display All Settings

`conda config --show`

输出当前生效的所有配置项及其值. 这会合并系统级、用户级和环境级的所有配置文件结果.

### Display Configuration Sources

`conda config --show-sources`

列出所有被读取的配置文件路径 (如 `.condarc`) 以及每个文件中具体的配置内容. 当你不确定某个配置是在哪里被设置时, 此命令用于定位配置文件位置非常有效.

### Get Specific Setting

`conda config --get <key>`

仅查看某个特定配置项的值. 例如 `conda config --get channels` 查看当前的镜像源列表.

## Channel Management

管理软件包的下载源 (Channel), 常用于添加国内镜像以加速下载.

### Add Channel (High Priority)

`conda config --add channels <url_or_name>`

将新的 Channel 添加到列表的**最顶部**. Conda 安装包时会优先从顶部的 Channel 搜索.
例如添加 conda-forge:
`conda config --add channels conda-forge`

### Append Channel (Low Priority)

`conda config --append channels <url_or_name>`

将新的 Channel 添加到列表的**最底部**. 仅当其他 Channel 找不到包时才会从这里搜索.

### Remove Channel

`conda config --remove channels <url_or_name>`

从配置中移除指定的 Channel.

### Show Channel URLs

`conda config --set show_channel_urls true`

设置在执行 `conda list` 或安装包时, 显示包的具体来源 URL. 这有助于确认包是来自默认源还是镜像源.

## General Behavior Settings

### Auto Activate Base

`conda config --set auto_activate_base false`

禁止终端启动时自动激活 `base` 环境. 设置后, 打开终端将默认处于系统 Shell 环境, 需要手动运行 `conda activate` 才会进入 Conda 环境.

### Always Yes

`conda config --set always_yes true`

将所有的确认提示 (Proceed [y]/n?) 默认为 `yes`. 等同于在每次命令后手动加 `-y` 参数.

### Solver Choice

`conda config --set solver libmamba`

将依赖解析器 (Solver) 切换为 `libmamba`. 相比经典的解析器, `libmamba` 在处理复杂环境依赖时速度极快, 能显著减少 "Solving environment" 的等待时间.

## Path Configuration

### Environment Directories

`conda config --add envs_dirs /path/to/new/envs`

添加新的虚拟环境存储路径. 创建新环境时, Conda 会尝试写入列表中的第一个路径. 适用于系统盘空间不足, 需要将环境迁移到数据盘的场景.

### Package Cache Directories

`conda config --add pkgs_dirs /path/to/new/pkgs`

添加新的包缓存路径. 下载的安装包和解压后的文件将存储在这里.

## Network Configuration

### Proxy Settings

`conda config --set proxy_servers.http http://user:pass@server:port`
`conda config --set proxy_servers.https https://user:pass@server:port`

配置 HTTP/HTTPS 代理. 适用于内网环境或需要通过代理访问外网源的情况.

### SSL Verification

`conda config --set ssl_verify false`

关闭 SSL 证书验证. 仅在遇到自签名证书错误或特殊的公司内网防火墙导致 SSL 握手失败时使用, 否则不建议关闭.

## Reset Configuration

### Remove Specific Key

`conda config --remove-key <key>`

删除某个配置项的所有设置, 使其恢复默认值.
例如 `conda config --remove-key channels` 会移除所有自定义镜像源, 恢复为默认的 defaults 源.