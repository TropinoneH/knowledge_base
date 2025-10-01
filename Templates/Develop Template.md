---
type: template
---
<%*
tR = ""
let title = await tp.system.prompt("Project name(filename)");
if (title) {
	await tp.file.rename(title);
}

const tags = await tp.user.frontmatter.multiSuggester(tp, "tags")
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this lecture done?")
const rate = await tp.user.frontmatter.suggester(tp, "rate")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "project";
    frontmatter["tags"] = tags;
    frontmatter["done"] = isDone;
    frontmatter["rate"] = rate
  });
});
-%>
<%* tp.file.cursor() %>
