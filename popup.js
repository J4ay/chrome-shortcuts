
document.addEventListener("DOMContentLoaded", async () => {

    let confirmDelete = false;
    let confirmTimeout = null;
    const clearBtn = document.getElementById("clearBtn");
    const originalText = clearBtn.textContent || "Clear";

    let shortcut1 = document.getElementById("shortcut1");
    let shortcut2 = document.getElementById("shortcut2");
    let shortcut3 = document.getElementById("shortcut3");

    const inputFieldValues = await chrome.storage.local.get();

    shortcut1.value = inputFieldValues.shortcut1 || "";
    shortcut2.value = inputFieldValues.shortcut2 || "";
    shortcut3.value = inputFieldValues.shortcut3 || "";

    const saveBtn = document.getElementById("saveBtn");
    let statusDiv = document.getElementById("status");

    let openInNewTabCheckbox = document.getElementById("openInNewTab");
    const openInNewTabValue = await chrome.storage.local.get("openInNewTab");
    openInNewTabCheckbox.checked = openInNewTabValue.openInNewTab || false;

    // Save Shortcuts
    saveBtn.addEventListener("click", () => {
        confirmDelete = false;
        clearBtn.textContent = originalText;

        [shortcut1, shortcut2, shortcut3].forEach((input) => {
            if (input.value && !/^https?:\/\//i.test(input.value)) {
                input.value = "https://" + input.value;
            }
        });

        chrome.storage.local
            .set({
                shortcut1: shortcut1.value,
                shortcut2: shortcut2.value,
                shortcut3: shortcut3.value,
            })
            .then(() => {
                if (statusDiv) {
                    statusDiv.textContent = "Shortcuts saved!";
                    setTimeout(() => {
                        if (statusDiv) {
                            statusDiv.textContent = "";
                        }
                    }, 2000);
                }
            });
    });

    // Clear Shortcuts with confirmation
    clearBtn.addEventListener("click", () => {
        if (!confirmDelete) {
            // first press: ask for confirmation
            confirmDelete = true;
            clearBtn.textContent = "Are you sure?";

            // reset confirmation after 5 seconds
            confirmTimeout = setTimeout(() => {
                confirmDelete = false;
                clearBtn.textContent = originalText;
                if (statusDiv) statusDiv.textContent = "";
                confirmTimeout = null;
            }, 5000);

            return;
        }

        // second press within timeframe: proceed to clear
        if (confirmTimeout) {
            clearTimeout(confirmTimeout);
            confirmTimeout = null;
        }
        confirmDelete = false;
        clearBtn.textContent = originalText;

        shortcut1.value = "";
        shortcut2.value = "";
        shortcut3.value = "";
        chrome.storage.local
            .set({
                shortcut1: "",
                shortcut2: "",
                shortcut3: "",
            })
            .then(() => {
                if (statusDiv) {
                    statusDiv.textContent = "Shortcuts cleared!";
                    setTimeout(() => {
                        if (statusDiv) {
                            statusDiv.textContent = "";
                        }
                    }, 2000);
                }
            });
    });

    openInNewTabCheckbox.addEventListener("change", () => {
        chrome.storage.local.set({ openInNewTab: openInNewTabCheckbox.checked });
    });

});