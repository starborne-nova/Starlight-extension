const settings = {
    theme: "",
    mike: "",
    mikeSound: "",
    TEST: "",
    TESTSound: "",
    rev: "",
    revSound: ""
}

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(settings, items);
    });


function saveOptions() {
    var Otheme = document.getElementById("setTheme").value;
    var OmikeN = document.getElementById("mikeNotifs").checked;
    var OmikeS = document.getElementById("mikeSound").checked;
    var OtestN = document.getElementById("testNotifs").checked;
    var OtestS = document.getElementById("testSound").checked;
    var OrevN = document.getElementById("revNotifs").checked;
    var OreveS = document.getElementById("revSound").checked;

    chrome.storage.sync.set({
        theme: Otheme,
        mike: OmikeN,
        mikeSound: OmikeS,
        TEST: OtestN,
        TESTSound: OtestS,
        rev: OrevN,
        revSound: OreveS
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        getAllStorageSyncData();
    });
};

function loadOptions() {
    chrome.storage.sync.get(["theme", "mike", "mikeSound", "TEST", "TESTSound", "rev", "revSound"], (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            document.getElementById("setTheme").value = items.theme;
            document.getElementById("mikeNotifs").checked = items.mike;
            document.getElementById("mikeSound").checked = items.mikeSound;
            document.getElementById("testNotifs").checked = items.TEST;
            document.getElementById("testSound").checked = items.TESTSound;
            document.getElementById("revNotifs").checked = items.rev;
            document.getElementById("revSound").checked = items.revSound;
        }

    });
}


function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["theme", "mike", "mikeSound", "TEST", "TESTSound", "rev", "revSound"], (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);

document.getElementById('save').addEventListener('click',
    saveOptions);