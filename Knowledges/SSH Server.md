---
type: command
tags:
  - ssh
  - cli
  - system/windows
  - system/linux
  - system/MacOS
done: true
topic:
  - "[[SSH]]"
  - "[[System]]"
---
# SSHD

sshd, 指的是ssh daemon, 是ssh服务器的后台进程.

当一台主机配置了sshd, 其他的主机才能连接. 这里的连接包括了[[SSH Login]], [[SSHFS]], [[Scp]]等连接方式

## Linux Setup

使用对应平台的包管理器下载`openssh-server`, 如:
- #system/linux/archlinux -> [[Pacman]]
- #system/linux/ubuntu -> [[APT]]

然后, 使用[[Systmectl]]启动openssh-server:
```bash
sudo systemctl enable --noe sshd
```

## MacOS Setup

可以简单的使用[[Homebrew]]安装:
```bash
brew install openssh
```

但是实际上, MacOS已经自带了这些功能, 需要进入设置中搜索`ssh`, 然后打开`共享->远程登陆`, 并在其中配置允许ssh登陆的用户列表

## Windows Setup

这个可能比较繁琐.

需要在设置中找到: 可选功能(设置->系统->可选功能), 在里面搜索"OpenSSH", 下载安装`OpenSSH Client`和`OpenSSH Server`.

如果没找到, 可以使用命令行激活: 首先按下<kbd>Win+X</kbd>然后找到"终端(管理员)", 进入管理员权限的终端; 然后输入下面的命令:
```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```
输出的结果应该为:
```
Name  : OpenSSH.Client~~~~0.0.1.0
State : NotPresent

Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```

输入命令:
```powershell
# Install the OpenSSH Client
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0

# Install the OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```
输出:
```
Path          :
Online        : True
RestartNeeded : False
```

输入命令:
```powershell
# Start the sshd service
Start-Service sshd

# OPTIONAL but recommended:
Set-Service -Name sshd -StartupType 'Automatic'

# Confirm the Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue)) {
    Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
    Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}
```

# Configure SSHD

配置文件是一样的写法.

#system/MacOS 和 #system/linux 的配置文件都在路径`/etc/ssh/sshd_config`中, 需要sudo[[Linux File Permission|权限]]进行编辑

#system/windows 配置文件通常位于`C:\ProgramData\ssh\sshd_config`
## `sshd_config`

- `Port 22`
    - **意义**: 指定 `sshd` 守护进程监听的端口号。
    - **默认值**: `22`。
    - **建议**: 为了降低被自动化工具扫描和攻击的风险，可以将其更改为一个不常用的高位端口（例如 `2222`）。但请注意，这是一种“安全混淆”（Security through obscurity），不能替代真正的安全措施（如防火墙、密钥认证等）。
- `ListenAddress 0.0.0.0`
    - **意义**: 指定 `sshd` 监听的网络接口 IP 地址。可以有多个 `ListenAddress` 项。
    - **默认值**: `0.0.0.0` (监听所有 IPv4 地址) 和 `::` (监听所有 IPv6 地址)。
    - **用途**: 如果服务器有多个网卡，你可以用它来指定 SSH 服务只在内网或特定的 IP 地址上可用。例如 `ListenAddress 192.168.1.1`。
- `AddressFamily any`
    - **意义**: 指定 `sshd` 使用的 IP 地址族。
    - **可选值**:
        - `any`: 同时使用 IPv4 和 IPv6 (默认)。
        - `inet`: 只使用 IPv4。
        - `inet6`: 只使用 IPv6。
- `HostKey /etc/ssh/ssh_host_rsa_key`
    - **意义**: 指定服务器用于向客户端证明自己身份的私钥文件路径。当客户端第一次连接服务器时，会收到这些密钥的公钥部分，并提示用户确认。
    - **建议**: 通常不需要修改。确保这些文件的权限是安全的（通常是 `600`），只有 `root` 用户可读写。现代推荐优先使用 `ed25519` 和 `ecdsa`。
- `LoginGraceTime 2m`
    - **意义**: 指定客户端在发起连接后必须完成认证的时间。如果在指定时间内未能成功登录，服务器将断开连接。
    - **默认值**: `120` 秒 (`2m`)。
    - **建议**: 可以适当缩短此时间（如 `30s`）以减少未认证连接占用的资源。
- `PermitRootLogin prohibit-password`
    - **意义**: 控制是否允许 `root` 用户通过 SSH 登录。**这是最重要的安全配置之一**。
    - **可选值**:
        - `yes`: 允许 `root` 用户以任何方式登录（非常不推荐）。
        - `no`: 完全禁止 `root` 用户登录。这是**最安全**的设置。管理员应使用普通用户登录，然后通过 `su` 或 `sudo` 提权。
        - `prohibit-password`: (现代版本的默认值) 禁止使用密码登录 `root`，但允许使用密钥对登录。这是一个很好的折中方案。
        - `forced-commands-only`: 只允许 `root` 通过密钥登录，并且只能执行 `authorized_keys` 文件中指定的命令。
    - **强烈建议**: 设置为 `no` 或 `prohibit-password`。
- `StrictModes yes`
    - **意义**: `sshd` 在接受登录前，会检查用户的主目录、`~/.ssh` 目录和 `authorized_keys` 文件的权限是否安全（即不应被其他用户写入）。
    - **默认值**: `yes`。
    - **强烈建议**: 保持为 `yes`。如果设为 `no`，当用户目录权限配置不当时，会带来严重的安全风险。
- `MaxAuthTries 6`
    - **意义**: 每个连接允许的最大认证尝试次数。达到此限制后，连接将被断开。
    - **建议**: 设置为一个较低的数字（如 `3` 或 `4`）可以有效防止密码暴力破解攻击。
- `PubkeyAuthentication yes`
    - **意义**: 是否启用公钥认证（即使用 SSH 密钥对登录）。
    - **默认值**: `yes`。
    - **强烈建议**: 保持为 `yes`。密钥认证远比密码认证安全。
- `AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys2`
    - **意义**: 指定存储用户公钥的文件路径。路径是相对于用户主目录的。
    - **建议**: 通常使用默认值即可。
- `PasswordAuthentication yes`
    - **意义**: 是否启用密码认证。
    - **默认值**: `yes`。
    - **强烈建议**: 如果你的所有用户都已配置密钥登录，请将其设置为 `no`。**禁用密码认证是提升 SSH 安全性的关键步骤**，可以完全杜绝密码暴力破解攻击。
- `PermitEmptyPasswords no`
    - **意义**: 是否允许使用空密码的账户登录。
    - **默认值**: `no`。
    - **强烈建议**: 必须保持为 `no`。
- `ChallengeResponseAuthentication no`
    - **意义**: 是否启用质询-响应式认证。这是一种交互式认证，通常也表现为密码输入提示。
    - **建议**: 如果 `PasswordAuthentication` 设置为 `no`，此项也应设为 `no`。在某些系统（如启用了 PAM）中，禁用密码登录需要同时将这两项都设为 `no`。
- `UsePAM yes`
    - **意义**: 是否启用 PAM (Pluggable Authentication Modules) 认证。PAM 允许系统集成多种认证机制（如密码、指纹、LDAP 等）。
    - **建议**: 在大多数现代 Linux 发行版上，应保持为 `yes`，因为它与系统级的用户和认证策略紧密集成。
- `KerberosAuthentication no` / `GSSAPIAuthentication no`
    - **意义**: 是否启用基于 Kerberos 或 GSSAPI 的企业级认证。
    - **建议**: 如果你不在企业 Kerberos/GSSAPI 环境中，请将它们设置为 `no`，以减少不必要的攻击面。
- `X11Forwarding yes`
    - **意义**: 是否允许 X11 转发。这允许用户在 SSH 会话中运行图形化 (GUI) 程序。
    - **建议**: 如果你不需要在服务器上运行图形化应用，请设置为 `no`，因为 X11 转发存在一定的安全风险。
- `AllowTcpForwarding yes`
    - **意义**: 是否允许 TCP 转发（也称为 SSH 隧道）。这是一个非常强大的功能，但也可能被滥用。
    - **建议**: 如果不需要此功能，可以设置为 `no`。
- `PermitTunnel no`
    - **意义**: 是否允许 `ssh` 的 `tun` 设备转发（即创建 VPN）。
    - **建议**: 除非你有明确的 VPN 需求，否则保持为 `no`。
- `PrintMotd yes`
    - **意义**: 用户登录后是否显示 `/etc/motd` (Message Of The Day) 文件中的内容。
    - **建议**: 根据需求设置。通常用于向登录用户显示系统公告。
- `Banner none`
    - **意义**: 指定一个文件，其内容将在用户输入密码或密钥之前显示。
    - **用途**: 常用于显示法律声明或安全警告。例如 `Banner /etc/ssh/ssh_banner`。
- `Subsystem sftp /usr/lib/openssh/sftp-server`
    - **意义**: 配置外部子系统，最常见的就是 SFTP 服务。
    - **建议**: 保持默认值以确保 SFTP 功能正常。如果想禁用 SFTP，可以注释掉此行。
- `ClientAliveCountMax 3`
    - **意义**: 服务器端空闲超时机制。服务器会每隔 `ClientAliveInterval` 秒向客户端发送一个空包，如果连续 `ClientAliveCountMax` 次没有收到客户端的响应，则断开连接。
    - **用途**: 可以防止因网络问题或客户端无响应而产生的“僵尸”会话。例如，设置为 `ClientAliveInterval 60` 和 `ClientAliveCountMax 3` 意味着如果客户端在 3 分钟内无响应，连接将被断开。
- `SyslogFacility AUTH`
    - **意义**: `sshd` 日志消息发送到 `syslog` 时的设施（facility）类型。`AUTH` 或 `AUTHPRIV` 是常见设置。
- `LogLevel INFO`
    - **意义**: `sshd` 记录日志的详细级别。
    - **可选值**: `QUIET`, `FATAL`, `ERROR`, `INFO`, `VERBOSE`, `DEBUG`, `DEBUG1`, `DEBUG2`, `DEBUG3`
    - **建议**: 日常使用 `INFO` 即可。在排查问题时可以临时调整为 `VERBOSE` 或 `DEBUG`。

## Reload Config

1.  **编辑文件**:
    ```bash
    sudo nano /etc/ssh/sshd_config
    ```

2.  **测试配置语法**:
    在重启服务前，务必检查配置文件语法是否正确，否则可能导致 SSH 服务启动失败，让你无法远程登录。
    ```bash
    sudo sshd -t
    ```
    如果没有任何输出，说明语法正确。

3.  **重新加载或重启服务**:
    为了让新配置生效，需要重新加载或重启 `sshd` 服务。推荐使用 `reload`，因为它不会断开当前的 SSH 连接。
    ```bash
    # 对于使用 systemd 的系统 (Ubuntu, CentOS 7+, Debian 8+)
    sudo systemctl reload sshd
    
    # 如果 reload 不可用或你想彻底重启
    sudo systemctl restart sshd
    ```