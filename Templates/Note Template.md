---
type: template
---
<%*
tR = ""
let title = await tp.system.prompt("Lecture name(filename)");
if (title) {
	await tp.file.rename(title);
}
const type = await tp.user.frontmatter.suggester(tp, "type")
const tags = await tp.user.frontmatter.multiSuggester(tp, "tags", ["lecture"])
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this lecture done?")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = type;
    frontmatter["tags"] = tags;
    frontmatter["done"] = isDone;
  });
});
-%>
<%* tp.file.cursor() %>