async function getShortcuts() {
    try {
        const result = await chrome.storage.local.get([
            "shortcut1",
            "shortcut2",
            "shortcut3",
            "openInNewTab",
        ]);
        return result;
    } catch (error) {
        console.error("Error getting shortcuts from storage:", error);
        return {};
    }
}

chrome.commands.onCommand.addListener(async function (command) {
    const shortcuts = await getShortcuts();

    if (shortcuts.openInNewTab) {
        if (command === "Command_1") {
            chrome.tabs.create({ url: shortcuts.shortcut1 || "popup.html" });
        } else if (command === "Command_2") {
            chrome.tabs.create({ url: shortcuts.shortcut2 || "popup.html" });
        }
        else if (command === "Command_3") {
            chrome.tabs.create({ url: shortcuts.shortcut3 || "popup.html" });
        }
    } else {
        if (command === "Command_1") {
            chrome.tabs.update({ url: shortcuts.shortcut1 || "popup.html" });
        } else if (command === "Command_2") {
            chrome.tabs.update({ url: shortcuts.shortcut2 || "popup.html" });
        }
        else if (command === "Command_3") {
            chrome.tabs.update({ url: shortcuts.shortcut3 || "popup.html" });
        }
    }
});