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

const allRate = ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"];

const selectedTags = await tp.user.frontmatter.multiSuggester(tp, "tags");
const publish = await tp.user.frontmatter.suggester(tp, "publish");
const pdf = await tp.user.frontmatter.suggestFile(tp, "Paper/PDF", "pdf");
const rate = await tp.system.suggester(allRate, allRate, true, "Rate of this paper");
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this note done?")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "paper";
    frontmatter["tags"] = selectedTags;
    frontmatter["publish"] = publish;
    frontmatter["pdf"] = pdf;
    frontmatter["rate"] = rate;
    frontmatter["done"] = isDone;
  });
});
-%>
