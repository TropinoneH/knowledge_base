---
type: template
---
<%*
tR = ""
let title = await tp.system.prompt("Lecture name(filename)");
if (title) {
	await tp.file.rename(title);
}
const tags = await tp.user.frontmatter.multiSuggester(tp, "tags", ["lecture"])
const teachers = await tp.user.frontmatter.multiSuggester(tp, "teacher")
const alias = await tp.system.prompt("Please enter your class id:")
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this lecture done?")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "lecture note";
    frontmatter["tags"] = tags;
    frontmatter["teacher"] = teachers;
    frontmatter["aliases"] = alias;
    frontmatter["done"] = isDone;
  });
});
-%>
