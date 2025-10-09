---
type: template
---
<%*
tR = ""
// 1. 设置文件名
let title = await tp.system.prompt("Topic name(filename)");
if (title) {
	await tp.file.rename(title);
}

const selectedTags = await tp.user.frontmatter.multiSuggester(tp, "tags")
const published = await tp.user.frontmatter.suggester(tp, "publish")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "paper";
    frontmatter["tags"] = selectedTags;
  });
});
-%>
