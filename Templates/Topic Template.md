<%*
// 1. 设置文件名
let title = await tp.system.prompt("请输入文件名");
await tp.file.rename(title);

// 2. 设置元数据
// 2.2 设置标签 (tags)
const allTags = Object.keys(app.metadataCache.getTags());
let selectedTags = [];
let chooseMore = true;

while (chooseMore) {
    let choice = await tp.system.suggester(
        (tag) => tag.slice(1),
        allTags,
        false,
        (selectedTags.length === 0 ? "Choose tags" : "Selected Tags: " + selectedTags.map(tag => tag.slice(5)))
    );

    if (choice) {
        if (!selectedTags.includes(choice)) {
	        allTags.
            selectedTags.push("\n  - " + choice.slice(1));
        }
    } else {
        chooseMore = false;
    }
}
const tags = selectedTags.join("")

// 2.3 设置 done 状态 (布尔值)
const doneStatus = await tp.system.suggester(["true", "false"], [true, false], false, "任务是否已完成?");
-%>
---
type: topic
tags: <%* tR += tags %>
done: <%* tR += doneStatus %>
---