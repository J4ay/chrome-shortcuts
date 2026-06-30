async function getShortcuts() {
    try {
        const result = await chrome.storage.local.get([
            "shortcut1",
            "shortcut2",
            "shortcut3",
            "openInNewTab1",
            "openInNewTab2",
            "openInNewTab3",
            "openInNewWindow1",
            "openInNewWindow2",
            "openInNewWindow3"
        ]);
        return result;
    } catch (error) {
        console.error("Error getting shortcuts from storage:", error);
        return {};
    }
}

chrome.commands.onCommand.addListener(async function (command) {
    const shortcuts = await getShortcuts();

    if (command === "Command_1") {
        if (shortcuts.openInNewTab1) {
            chrome.tabs.create({ url: shortcuts.shortcut1 || "popup.html" });
        } else if (shortcuts.openInNewWindow1) {
            chrome.windows.create({ url: shortcuts.shortcut1 || "popup.html" });
        } else {
            chrome.tabs.update({ url: shortcuts.shortcut1 || "popup.html" });
        }
    } else if (command === "Command_2") {
        if (shortcuts.openInNewTab2) {
            chrome.tabs.create({ url: shortcuts.shortcut2 || "popup.html" });
        } else if (shortcuts.openInNewWindow2) {
            chrome.windows.create({ url: shortcuts.shortcut2 || "popup.html" });
        } else {
            chrome.tabs.update({ url: shortcuts.shortcut2 || "popup.html" });
        }
    } else if (command === "Command_3") {
        if (shortcuts.openInNewTab3) {
            chrome.tabs.create({ url: shortcuts.shortcut3 || "popup.html" });
        } else if (shortcuts.openInNewWindow3) {
            chrome.windows.create({ url: shortcuts.shortcut3 || "popup.html" });
        } else {
            chrome.tabs.update({ url: shortcuts.shortcut3 || "popup.html" });
        }
    }
});