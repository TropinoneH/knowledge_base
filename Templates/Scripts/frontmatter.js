const multiSuggester = async (tp, key, defaultKeys = []) => {
    const existingValues = await app.metadataCache.getFrontmatterPropertyValuesForKey(key);
    let selectedItems = [];
    let continueChoose = true;
    defaultKeys.forEach(key => {
        const index = existingValues.indexOf(key);
        if (index > -1) {
            existingValues.splice(index, 1);
        }
        selectedItems.push(key);
    });

    const addNewOption = `add new ${key}`;
    const suggesterOptions = [addNewOption, ...existingValues];
    while (continueChoose) {
        const choice = await tp.system.suggester(
            suggesterOptions,
            suggesterOptions,
            false,
            (selectedItems.length === 0 ? `Choose ${key}` : `Selected ${key}: ` + selectedItems.join(",")) + " , or press Esc to finish"
        );
        if (choice) {
            if (choice === addNewOption) {
                const newValue = await tp.system.prompt(`please enter new ${key}:`);
                if (newValue !== null && !selectedItems.includes(newValue)) {
                    selectedItems.push(newValue);
                }
            } else {
				selectedItems.push(choice);
				suggesterOptions.remove(choice);
            }
        } else {
            continueChoose = false;
        }
    }
    return selectedItems;
}

const suggester = async (tp, key) => {
    const addNewOption = `add new ${key}`;
    const existingValues = [addNewOption, ...(await app.metadataCache.getFrontmatterPropertyValuesForKey(key))];
    const choice = await tp.system.suggester(
        existingValues,
        existingValues,
        false,
        `Choose ${key}`
    );
    if (choice === addNewOption) {
        const newValue = await tp.system.prompt(`please enter new ${key}:`, null, true);
        return newValue;
    }
    return choice;
}

module.exports = { multiSuggester, suggester }