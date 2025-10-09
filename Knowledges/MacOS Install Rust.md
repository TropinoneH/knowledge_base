---
type: software
tags:
  - code/rust
  - system/MacOS
  - cli
  - software
done: true
---
# Install Rustup

使用[[Homebrew]]安装:
```bash
brew install rustup
rustup run --install stable cargo
rustup default stable
```

第一步结束之后, 会创建一个`~/.rustup`的文件夹. 第二步安装的stable [[Cargo|cargo等工具]]就应该放在`~/.rustup/toolchains/stable-aarch64-apple-darwin/bin`中. 需要手动将这个路径添加到`PATH`环境变量中.

然后, 运行第三步, 完成最后的设置, 指定rust的版本是stable

此时, 可以使用[[Cargo]]进行配置