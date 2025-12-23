---
type: skills
tags:
  - software
  - GUI
  - code/rust
  - cli
done: false
topic:
  - "[[Coding]]"
---
[official website](https://gtk-rs.org/)

[rust repository reference](https://docs.rs/gtk/latest/gtk/)

[github](https://github.com/gtk-rs)

[tutorial](https://gtk-rs.org/gtk4-rs/git/book/introduction.html)

this is a rust program for gnome based GUI window.

# Installation

1. [[Rust#Installation|install rust]], [[Rust#Cargo|cargo]]
2. install dependencies:
	-  Linux
		- Fedora and derivatives:
		```shell
		sudo dnf install gtk4-devel gcc
		```
	    - Debian and derivatives:
		```shell
		sudo apt install libgtk-4-dev build-essential
		```
	    - Arch and derivatives:
		```shell
		sudo pacman -S gtk4 base-devel
		```
	- macOS
	    ```shell
	    brew install gtk4
		```

# Create first project

```shell
cargo new <project_name>
cd <project_name>
```

find out your gtk version:
```shell
pkg-config --modversion gtk4
```

the output should be a 3-number version: `<major>.<median>.<minor>`

we only use the former two: `<major>_<median>`, for adding `gtk-rs` lib:
```shell
cargo add gtk4 --rename gtk --features v<major>_<median>
```

## create first widget

the entry of program is `src/main.rs`

we can simply create a widget by code below:
```rust
use gtk::{Application, ApplicationWindow, glib, prelude::*};

const APP_ID: &str = "io.eniverz.simpleWidget";

fn main() -> glib::ExitCode {
    let app = Application::builder().application_id(APP_ID).build();

    app.connect_activate(build_ui);

    app.run()
}

fn build_ui(app: &Application) {
    let window = ApplicationWindow::builder()
        .application(app)
        .title("Simple Widget")
        .build();

    window.present();
}
```

the `APP_ID` is the unique id of current project, also the gtk class of the application.

`app` is the main program thread.

`build_ui` is the function of initialize the window GUI. when app emit the signal `activate`, this function will be called.

and `window` is a `ApplicationWindow` maintained by `app`, with title(also gtk title) `Simple Widget`.

we can also add some component into the window:
```rust
// first import the Button class
use gtk::{..., Button};

// in the build_ui function
let button = Button::builder()
	.label("Press Me")
	.margin_bottom(12)
	.margin_top(12)
	.margin_start(12)
	.margin_end(12)
	.build();
let window = ApplicationWindow::builder()
	.application(app)
	.title("Simple Widget")
	.child(&button)
	.build();
```

same as `gjs`, the child only contain one widget except `box` widget.

the margin could be set as `.margin_top` or CSS class. unlike `gjs`, gtk-rs only enable css_class but not inline css properties.

# CSS

include css file:
```rust
fn main() -> glib::ExitCode {
	// ...
	app.connect_startup(|_| load_css());
	// ...
}

fn load_css() {
	// Load the CSS file and add it to the provider
    let provider = CssProvider::new();
    provider.load_from_string(include_str!("style.css"));

    // Add the provider to the default screen
    gtk::style_context_add_provider_for_display(
        &Display::default().expect("Could not connect to a display."),
        &provider,
        gtk::STYLE_PROVIDER_PRIORITY_APPLICATION,
    );
}
```

the css file is same as normal css file.

use `builder().css_classes(vec!["<class_name>"])` to add class name for widget, use `builder().name("<widget_name>")` to set widget's id.

also, you can use `widget.set_css_classes(vec![])` to set css class names, use `widget.add_css_class("")` to add a class name, use `widget.remove_css_class("")` to remove a class name.

if we use [[#Template]] to create a UI, the style will be as follow:
```xml
 <?xml version="1.0" encoding="UTF-8"?>
<gresources>
	<gresource prefix="/org/gtk_rs/Todo3/">
		...
		<file compressed="true">style.css</file>
	</gresource>
</gresources>
```

or
```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<template class="MyGtkAppWindow" parent="GtkApplicationWindow">
		<property name="title" translatable="yes">My GTK App</property>
		<child>
			<object class="GtkBox">
				...
				<child>
					<object class="GtkButton">
						...
						<style>
							<class name="destructive-action"/>
						</style>
					</object>
				</child>
				...
			</object>
		</child>
	</template>
</interface>

```
or
```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<template class="MyGtkAppWindow" parent="GtkApplicationWindow">
		...
		<child>
			<object class="GtkButton">
				...
				<property name="name">button-1</property>
			</object>
		</child>
	</template>
</interface>
```

# GObject
## Memory Management

because rust is a high security language, the life-cycle of variable is important. that is, this is not allow because the closure borrow the `num` owned by outside function:
```rust
let button = Button.builder().build()
let mut num = 1;
button.connect_clicked(|_| num += 1)
```
if we use keyword `move`, still not allowed because the `num` will be drop after closure, but the closure will be called multiple time:
```rust
button.connect_clicked(move |_| num += 1)
```
so we need to use [[Rust#Reference|reference]].

`gtk::glib` provide some macro, such as `clone!`, `#[weak]` and `#[strong]` for reference.

then use `std::{Rc, Cell}` to create references:
```rust
let number = Rc::new(Cell::new(0));
```

GObject is already a reference, so just clone and use:
```rust
button_increase.connect_clicked(clone!(
	#[weak]
	number,
	#[weak]
	button_decrease,
	move |_| {
		number.set(number.get() + 1);
		button_decrease.set_label(&number.get().to_string());
	}
));
button_decrease.connect_clicked(clone!(
	#[weak]
	button_increase,
	move |_| {
		number.set(number.get() - 1);
		button_increase.set_label(&number.get().to_string());
	}
));
```

use weak reference to avoid [[Rust#Reference Loop|reference cycle]].

```rust
use std::{cell::Cell, rc::Rc};

use gtk::{
    self, Application, ApplicationWindow, Button, Orientation,
    glib::{self, *},
    prelude::*,
};

const APP_ID: &str = "io.eniverz.simpleWidget";

fn main() -> glib::ExitCode {
    let app = Application::builder().application_id(APP_ID).build();

    app.connect_activate(build_ui);

    app.run()
}

fn build_ui(app: &Application) {
    let num = Rc::new(Cell::new(0));
    let button = Button::builder()
        .label("Press Me")
        .margin_bottom(12)
        .margin_top(12)
        .margin_start(12)
        .margin_end(12)
        .build();
    let button2 = Button::builder()
        .label("2")
        .margin_bottom(12)
        .margin_top(12)
        .margin_start(12)
        .margin_end(12)
        .build();
    button.connect_clicked(clone!(
        #[weak]
        num,
        #[weak]
        button2,
        move |_| {
            num.set(num.get() + 1);
            button2.set_label(&num.get().to_string());
        }
    ));
    button2.connect_clicked(clone!(
        #[weak]
        button,
        move |_| {
            num.set(num.get() + 2);
            button.set_label(&num.get().to_string());
        }
    ));
    let gtk_box = gtk::Box::builder()
        .orientation(Orientation::Vertical)
        .build();
    gtk_box.append(&button);
    gtk_box.append(&button2);
    let window = ApplicationWindow::builder()
        .application(app)
        .title("Simple Widget")
        .child(&gtk_box)
        .build();

    window.present();
}
```

## Sub Class

GObject有严重的继承开发需求. 
