module.exports = async (tp, key, defaultKeys = []) => {
    const existingValues = await app.metadataCache.getFrontmatterPropertyValuesForKey(key);
    let selectedItems = [];
    defaultKeys.forEach(key => {
        const index = existingValues.indexOf(key);
        if (index > -1) {
            existingValues.splice(index, 1);
        }
        selectedItems.push(key);
    });

    const addNewOption = `add new ${key}`;
    const suggesterOptions = [addNewOption, ...existingValues];
    let chooseMore = true;
    while (chooseMore) {
        const choice = await tp.system.suggester(
            suggesterOptions,
            suggesterOptions,
            false,
            (selectedItems.length === 0 ? `Choose ${key}` : `Selected ${key}: ` + selectedItems.join(",")) + " , or press Esc to finish"
        );
        if (choice) {
            if (choice === addNewOption) {
                const newValue = await tp.system.prompt(`please enter new ${key}:`);
                if (!selectedItems.includes(newValue)) {
                    selectedItems.push(newValue);
                }
            } else {
				selectedItems.push(choice);
				suggesterOptions.remove(choice);
            }
        } else {
            chooseMore = false;
        }
    }
    return selectedItems;
}