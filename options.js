const settings = {
    notifs: false,
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

var notifOptions = {
    type: "basic",
    title: "JabroniNotify",
    message: "This is a test!",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
}

function saveOptions() {
    var Otheme = document.getElementById("setTheme").value;
    var OmikeN = document.getElementById("mikeNotifs").checked ? true : false;
    var OmikeS = document.getElementById("mikeSound").checked ? true : false;
    var OtestN = document.getElementById("testNotifs").checked ? true : false;
    var OtestS = document.getElementById("testSound").checked ? true : false;
    var OrevN = document.getElementById("revNotifs").checked ? true : false;
    var OreveS = document.getElementById("revSound").checked ? true : false;

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
            document.getElementById("notifStatus").innerText = items.notifs ? "Active" : "Inactive";
            document.getElementById("setTheme").value = items.theme;
            document.getElementById("mikeNotifs").checked = items.mike ? true : false;
            document.getElementById("mikeSound").checked = items.mikeSound ? true : false;
            document.getElementById("testNotifs").checked = items.TEST ? true : false;
            document.getElementById("testSound").checked = items.TESTSound ? true : false;
            document.getElementById("revNotifs").checked = items.rev ? true : false;
            document.getElementById("revSound").checked = items.revSound ? true : false;
        }

    });
}

function handleTestNotif() {
    chrome.notifications.getPermissionLevel(function (level) {
        if (level === "granted") {
            chrome.notifications.create("testNote", notifOptions, function (id) {
                setTimeout(() => {
                    chrome.notifications.clear("testNote", (cleared) => {
                        console.log("Notification Cleared = " + cleared)
                    })
                }, 5000)
            })
        }

    });
}

function handleNotif() {

    chrome.permissions.request(
        {
            permissions: ["notifications"],
        },
        function (granted) {
            if (granted) {
                chrome.storage.sync.set({ notifs: true }, function () {
                    document.getElementById("notifStatus").innerText = "Active";
                })
            } else {
                chrome.storage.sync.set({ notifs: false }, function () {
                    document.getElementById("notifStatus").innerText = "Inactive";
                })
            }
        }
    );

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

document.getElementById("testNotif").addEventListener("click", handleTestNotif);

document.getElementById("notifRequest").addEventListener("click", handleNotif);

document.addEventListener('DOMContentLoaded', loadOptions);

document.getElementById('save').addEventListener('click',
    saveOptions);