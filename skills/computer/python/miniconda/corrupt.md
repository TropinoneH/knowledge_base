# The current environment has been corruptted

查看在哪个package出现了问题，直接删掉相关的包（文件夹`~/miniconda3/pkgs/<pkg_name>`和文件`~/miniconda3/pkgs/<pkg_name>.conda`，还有文件`~/miniconda3/conda-meta/<pkg_name>.json`）

删除掉之后，重新运行`conda update --all`，即可恢复
