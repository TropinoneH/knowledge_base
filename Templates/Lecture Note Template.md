<%*
// 1. 设置文件名
let title = await tp.system.prompt("Lecture name(filename)");
if (title) {
	await tp.file.rename(title);
}
// 2. 设置元数据
const tags = await tp.user.frontmatterMultiSuggester(tp, "tags", ["lecture"])
const teachers = await tp.user.frontmatterMultiSuggester(tp, "teacher")
const classID = await tp.system.prompt("Please enter your class id:")
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this lecture done?")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "lecture note";
    frontmatter["tags"] = tags;
    frontmatter["teacher"] = teachers;
    frontmatter["ClassID"] = classID;
    frontmatter["done"] = isDone;
  });
});
-%>
<%* tp.file.cursor() %>