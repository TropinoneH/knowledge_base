---
type: template
---
<%*
tR = ""
const pdf = await tp.user.frontmatter.suggestFile(tp, "Paper/PDF", "pdf");

let filename = "";
if (pdf) {
    const match = pdf.match(/\d{4}\.\d{4,5}/);
    if (match) {
        filename = match[0];
    } else {
        filename = await tp.system.prompt("未找到arxiv编号, 请手动输入文件名:");
    }
} else {
    filename = await tp.system.prompt("Paper name(filename)");
}

if (filename) {
    await tp.file.rename(filename);
}

const allRate = ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"];

const selectedTags = await tp.user.frontmatter.multiSuggester(tp, "tags");
const publish = await tp.user.frontmatter.suggester(tp, "publish");
const rate = await tp.system.suggester(allRate, allRate, false, "Rate of this paper");
const isDone = await tp.system.suggester(["true", "false"], [true, false], true, "Is this note done?")
const title = await tp.system.prompt("Paper title")

tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["type"] = "paper";
    frontmatter["tags"] = selectedTags;
    frontmatter["publish"] = publish;
    frontmatter["pdf"] = pdf;
    frontmatter["rate"] = rate;
    frontmatter["done"] = isDone;
    frontmatter["aliases"] = title;
  });
});

tR += `> [!note]- paper\n!${pdf}\n`
%>
