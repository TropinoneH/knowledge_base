---
type: template
---
<%*
tR = ""
let title = await tp.system.prompt("Project name(filename)");
if (title) {
	await tp.file.rename(title);
}

const allRate = ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"];

const tags = await tp.user.frontmatter.multiSuggester(tp, "tags")
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this project done?")
const rate = await tp.system.suggester(allRate, allRate, false, "Rate of this project")

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
