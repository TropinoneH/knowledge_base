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

// 2. 设置元数据
const selectedType = await tp.system.suggester((type) => type, app.metadataCache.getFrontmatterPropertyValuesForKey("type"), true, "Topic type");

const selectedTags = await tp.user.frontmatter.multiSuggester(tp, "tags", ["topic"])

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = selectedType;
    frontmatter["tags"] = selectedTags;
  });
});
%>