---
tags:
  - tutorial
  - rust
---
# Installation

use command below to download and install rustup, rustc and cargo, etc:

```shell
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

if download is to slow, use ustc mirrors:

```shell
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup
export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
```

for Arch Linux, we can use [[Commands#pacman & paru|pacman]] to manage packages:

```shell
sudo pacman -S rustup
rustup run --install stable cargo
rustup default stable
```

## Update

```shell
rustup update
```

## Uninstall

```shell
rustup self uninstall
```

## Cargo

cargo will be installed with rust automatically. cargo is a rust lib manager like [[Vue#1.安装|npm]] or [[module#pip|pip]].

if the speed of download too slow, use mirrors by edit `~/.cargo/config.toml`:
```toml
[source.ustc]
registry = "sparse+https://mirrors.ustc.edu.cn/crates.io-index/"
```

### Create new project

```shell
cargo new <project_name> # create a bin project
cargo new <project_name> --lib # create a lib for rust
```

the standard Package folder:

```
.
├── Cargo.lock
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── main.rs
│   └── bin/
│       ├── named-executable.rs
│       ├── another-executable.rs
│       └── multi-file-executable/
│           ├── main.rs
│           └── some_module.rs
├── benches/
│   ├── large-input.rs
│   └── multi-file-bench/
│       ├── main.rs
│       └── bench_module.rs
├── examples/
│   ├── simple.rs
│   └── multi-file-example/
│       ├── main.rs
│       └── ex_module.rs
└── tests/
    ├── some-integration-tests.rs
    └── multi-file-test/
        ├── main.rs
        └── test_module.rs

```

### Add libs

into the project folder(with `Cargo.toml` exists)
```shell
cargo add <lib_name> [--features ...]
```

### Run project

the entry of the project is `fn main()` in `src/main.rs`.

run the project by
```shell
cargo run
cargo run --release # run in release mode
```

build the `target` folder by
```shell
cargo build # debug mode
cargo build --release # release mode
```

the size of bin with release mode is significantly smaller than debug mode.

### diagnostics

```shell
cargo check
```

check if the code could be complied.

rust analyzer = `clippy` + `cargo check`

### `Cargo.toml`

the file where the dependencies defined. just like the `package.json`

the dependencies defined as:
```toml
[dependencies]
hammer = "0.5.0" # added by cargo
rand = { version = "0.8.5", features = ["small_rng"], optional = true } # added by cargo
color = { git = "https://github.com/bjz/color-rs" } # github
geometry = { path = "crates/geometry" } # local
```

more details [here](https://course.rs/cargo/reference/specify-deps.html)
