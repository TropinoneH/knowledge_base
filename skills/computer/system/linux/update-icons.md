# 更改gtk图标

默认的图标位置在`/usr/share/icons/`

可以通过更改`/usr/share/icons/default/index.theme`来更改默认图标

如果在图标中找不到对应的`iconName`那么会到hicolor里面去寻找(fallback)

# 手动更新图标缓存

使用命令

```shell
gtk-update-icon-cache <path/to/icons: /usr/share/icons>
gtk4-update-icon-cache <path/to/icons: /usr/share/icons>
```
