
document.addEventListener("DOMContentLoaded", async () => {

    let confirmDelete = false;
    let confirmTimeout = null;
    let saveTimeout = null;
    let deleteTimeout = null;
    const clearBtn = document.getElementById("clearBtn");
    const originalText = clearBtn.textContent || "Clear";

    const measureClearButtonWidth = (text) => {
        const probe = document.createElement("span");
        const computedStyle = window.getComputedStyle(clearBtn);

        probe.textContent = text;
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.whiteSpace = "nowrap";
        probe.style.font = computedStyle.font;
        probe.style.letterSpacing = computedStyle.letterSpacing;
        probe.style.textTransform = computedStyle.textTransform;
        probe.style.padding = computedStyle.padding;
        probe.style.border = computedStyle.border;
        probe.style.boxSizing = computedStyle.boxSizing;

        document.body.appendChild(probe);
        const width = probe.getBoundingClientRect().width;
        probe.remove();
        return width;
    };

    const setClearButtonText = (text, animate = true) => {
        const currentWidth = clearBtn.getBoundingClientRect().width;
        clearBtn.textContent = text;
        const targetWidth = `${measureClearButtonWidth(text)}px`;

        if (!animate) {
            clearBtn.style.width = targetWidth;
            return;
        }

        clearBtn.style.width = `${currentWidth}px`;
        clearBtn.offsetHeight;
        requestAnimationFrame(() => {
            clearBtn.style.width = targetWidth;
        });
    };
    clearBtn.style.minWidth = `${measureClearButtonWidth(originalText)}px`;

    let shortcut1 = document.getElementById("shortcut1");
    let shortcut2 = document.getElementById("shortcut2");
    let shortcut3 = document.getElementById("shortcut3");

    const inputFieldValues = await chrome.storage.local.get();

    shortcut1.value = inputFieldValues.shortcut1 || "";
    shortcut2.value = inputFieldValues.shortcut2 || "";
    shortcut3.value = inputFieldValues.shortcut3 || "";

    const saveBtn = document.getElementById("saveBtn");
    let statusDiv = document.getElementById("status");
    let statusClearTimeout = null;
    let statusSwapTimeout = null;

    const hideStatusMessage = (time) => {
        if (!statusDiv) {
            return;
        }

        if (statusClearTimeout)clearTimeout(statusClearTimeout);
        if (statusSwapTimeout) clearTimeout(statusSwapTimeout);

        statusDiv.style.transition = "opacity " + (time || 150) + "ms ease";
        statusDiv.classList.remove("is-visible");
        statusClearTimeout = setTimeout(() => {
            if (statusDiv && !statusDiv.classList.contains("is-visible")) {
                statusDiv.textContent = "";
            }
            statusClearTimeout = null;
        }, time || 150);
    };

    const showStatusMessage = (message) => {
        if (!statusDiv) {
            return;
        }

        if (statusClearTimeout) clearTimeout(statusClearTimeout);
        if (statusSwapTimeout) clearTimeout(statusSwapTimeout);

        const isVisible = statusDiv.classList.contains("is-visible");

        if (!isVisible || !statusDiv.textContent) {
            statusDiv.textContent = message;
            requestAnimationFrame(() => {
                if (statusDiv) {
                    statusDiv.classList.add("is-visible");
                }
            });
            return;
        }

        const transitionTime = 80;
        statusDiv.style.transition = "opacity " + transitionTime + "ms ease";
        statusDiv.classList.remove("is-visible");
        statusSwapTimeout = setTimeout(() => {
            if (!statusDiv) {
                return;
            }

            statusDiv.textContent = message;
            requestAnimationFrame(() => {
                if (statusDiv) {
                    statusDiv.classList.add("is-visible");
                }
            });
            statusSwapTimeout = null;
        }, transitionTime);
    };

    let openInNewTabCheckbox1 = document.getElementById("openInNewTab1");
    let openInNewTabCheckbox2 = document.getElementById("openInNewTab2");
    let openInNewTabCheckbox3 = document.getElementById("openInNewTab3");

    const openInNewTabValue1 = await chrome.storage.local.get("openInNewTab1");
    openInNewTabCheckbox1.checked = openInNewTabValue1.openInNewTab1 || false;

    const openInNewTabValue2 = await chrome.storage.local.get("openInNewTab2");
    openInNewTabCheckbox2.checked = openInNewTabValue2.openInNewTab2 || false;

    const openInNewTabValue3 = await chrome.storage.local.get("openInNewTab3");
    openInNewTabCheckbox3.checked = openInNewTabValue3.openInNewTab3 || false;

    let openInNewWindowCheckbox1 = document.getElementById("openInNewWindow1");
    let openInNewWindowCheckbox2 = document.getElementById("openInNewWindow2");
    let openInNewWindowCheckbox3 = document.getElementById("openInNewWindow3");

    const openInNewWindowValue1 = await chrome.storage.local.get("openInNewWindow1");
    openInNewWindowCheckbox1.checked = openInNewWindowValue1.openInNewWindow1 || false;

    const openInNewWindowValue2 = await chrome.storage.local.get("openInNewWindow2");
    openInNewWindowCheckbox2.checked = openInNewWindowValue2.openInNewWindow2 || false;

    const openInNewWindowValue3 = await chrome.storage.local.get("openInNewWindow3");
    openInNewWindowCheckbox3.checked = openInNewWindowValue3.openInNewWindow3 || false;

    setClearButtonText(originalText, false);

    // Save Shortcuts
    saveBtn.addEventListener("click", () => {
        if (saveTimeout) clearTimeout(saveTimeout); // Clear any pending save timeout
        if (deleteTimeout) clearTimeout(deleteTimeout); // Clear any pending delete timeout
        if (confirmTimeout) clearTimeout(confirmTimeout); // Clear any pending confirmation timeout

        confirmDelete = false;
        setClearButtonText(originalText);

        [shortcut1, shortcut2, shortcut3].forEach((input) => {
            if (input.value && !/^https?:\/\//i.test(input.value)) {
                input.value = "https://" + input.value;
            }
        });
        try {
            chrome.storage.local
                .set({
                    shortcut1: shortcut1.value,
                    shortcut2: shortcut2.value,
                    shortcut3: shortcut3.value,
                })
                .then(() => {
                    showStatusMessage("Shortcuts saved!");
                    saveTimeout = setTimeout(() => {
                        hideStatusMessage();
                    }, 2000);
                });
        } catch (error) {
            showStatusMessage("Error saving shortcuts!");
        }
    });

    // Clear Shortcuts with confirmation
    clearBtn.addEventListener("click", () => {
        if (saveTimeout) clearTimeout(saveTimeout); // Clear any pending save timeout
        if (deleteTimeout) clearTimeout(deleteTimeout); // Clear any pending delete timeout
        if (confirmTimeout) clearTimeout(confirmTimeout); // Clear any pending confirmation timeout
        
        if (!confirmDelete) {
            hideStatusMessage(60); // Clear any previous status messages
            // first press: ask for confirmation
            confirmDelete = true;
            setClearButtonText("Are you sure?");

            // reset confirmation after 5 seconds
            confirmTimeout = setTimeout(() => {
                confirmDelete = false;
                setClearButtonText(originalText);
                confirmTimeout = null;
            }, 5000);

            return;
        }

        confirmDelete = false;
        setClearButtonText(originalText);

        shortcut1.value = "";
        shortcut2.value = "";
        shortcut3.value = "";

        try {
            chrome.storage.local
                .set({
                    shortcut1: "",
                    shortcut2: "",
                    shortcut3: "",
                })
                .then(() => {
                    showStatusMessage("Shortcuts cleared!");
                    deleteTimeout = setTimeout(() => {
                        hideStatusMessage();
                    }, 2000);
                });
        } catch (error) {
            showStatusMessage("Error clearing shortcuts!");
        }
    });

    openInNewTabCheckbox1.addEventListener("change", () => {
        if (openInNewWindowCheckbox1.checked && openInNewTabCheckbox1.checked) {
            openInNewWindowCheckbox1.checked = false;
        }
        chrome.storage.local.set({ openInNewTab1: openInNewTabCheckbox1.checked });
        chrome.storage.local.set({ openInNewWindow1: openInNewWindowCheckbox1.checked });
    });
    openInNewTabCheckbox2.addEventListener("change", () => {
        if (openInNewWindowCheckbox2.checked && openInNewTabCheckbox2.checked) {
            openInNewWindowCheckbox2.checked = false;
        }
        chrome.storage.local.set({ openInNewTab2: openInNewTabCheckbox2.checked });
        chrome.storage.local.set({ openInNewWindow2: openInNewWindowCheckbox2.checked });
    });
    openInNewTabCheckbox3.addEventListener("change", () => {
        if (openInNewWindowCheckbox3.checked && openInNewTabCheckbox3.checked) {
            openInNewWindowCheckbox3.checked = false;
        }
        chrome.storage.local.set({ openInNewTab3: openInNewTabCheckbox3.checked });
        chrome.storage.local.set({ openInNewWindow3: openInNewWindowCheckbox3.checked });
    });

    openInNewWindowCheckbox1.addEventListener("change", () => {
        if (openInNewTabCheckbox1.checked && openInNewWindowCheckbox1.checked) {
            openInNewTabCheckbox1.checked = false;
        }
        chrome.storage.local.set({ openInNewWindow1: openInNewWindowCheckbox1.checked });
        chrome.storage.local.set({ openInNewTab1: openInNewTabCheckbox1.checked });
    });
    openInNewWindowCheckbox2.addEventListener("change", () => {
        if (openInNewTabCheckbox2.checked && openInNewWindowCheckbox2.checked) {
            openInNewTabCheckbox2.checked = false;
        }
        chrome.storage.local.set({ openInNewWindow2: openInNewWindowCheckbox2.checked });
        chrome.storage.local.set({ openInNewTab2: openInNewTabCheckbox2.checked });
    });
    openInNewWindowCheckbox3.addEventListener("change", () => {
        if (openInNewTabCheckbox3.checked && openInNewWindowCheckbox3.checked) {
            openInNewTabCheckbox3.checked = false;
        }
        chrome.storage.local.set({ openInNewWindow3: openInNewWindowCheckbox3.checked });
        chrome.storage.local.set({ openInNewTab3: openInNewTabCheckbox3.checked });
    });

});