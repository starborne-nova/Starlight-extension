const url = "https://jabroni-server.herokuapp.com/pulse";
const streamerStatus = {
    jabroniLive: false,
    vineRev: false,
    testDev: false
};

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(streamerStatus, items);
        setBadge();
    });

chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("FROM BACKGROUND:background color changed") });
chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });

chrome.alarms.create("twitchPulse", {
    delayInMinutes: 1,
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        pulse();
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    if (changes.jabroniLive) {
        if (changes.jabroniLive.newValue === true && streamerStatus.vineRev === false) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.jabroniLive.newValue === false && streamerStatus.vineRev === false) {
            chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
        if (changes.jabroniLive.newValue === true && streamerStatus.vineRev === true) {
            chrome.action.setBadgeText({ text: "2" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.jabroniLive.newValue === false && streamerStatus.vineRev === true) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
    }
    if (changes.testDev) {
        if (changes.testDev.newValue === true && streamerStatus.jabroniLive === false) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.testDev.newValue === false && streamerStatus.jabroniLive === false) {
            chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
        if (changes.testDev.newValue === true && streamerStatus.jabroniLive === true) {
            chrome.action.setBadgeText({ text: "2" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.testDev.newValue === false && streamerStatus.jabroniLive === true) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
    }
    if (changes.vineRev) {
        if (changes.vineRev.newValue === true && streamerStatus.jabroniLive === false) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.vineRev.newValue === false && streamerStatus.jabroniLive === false) {
            chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
        if (changes.vineRev.newValue === true && streamerStatus.jabroniLive === true) {
            chrome.action.setBadgeText({ text: "2" }, function () { console.log("FROM BACKGROUND:badge text changed") });

        };
        if (changes.vineRev.newValue === false && streamerStatus.jabroniLive === true) {
            chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
        };
    }
    else {
        console.log("FROM BACKGROUND: Non-streamer changes detected")
    }

});

function pulse() {
    fetch(
        url,
        {
            method: "POST",
            mode: "cors",
            headers:
            {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ streamer: "Jabroni Mike" })
        })

        .then(response => response.json())
        .then(data => {
            console.log(data)

            if (data.jabroni === true) {
                chrome.storage.sync.set({ jabroniLive: true }, function () {
                    console.log("FROM BACKGROUND:Mike is currently online");
                });
            }
            if (data.jabroni === false) {
                chrome.storage.sync.set({ jabroniLive: false }, function () {
                    console.log("FROM BACKGROUND:Mike is currently offline");
                });
            }
            if (data.TEST === true) {
                chrome.storage.sync.set({ testDev: true }, function () {
                    console.log("FROM BACKGROUND:TEST is currently online");
                });
            }
            if (data.TEST === false) {
                chrome.storage.sync.set({ testDev: false }, function () {
                    console.log("FROM BACKGROUND:TEST is currently offline");
                })
            }
            if (data.vineRev === true) {
                chrome.storage.sync.set({ testDev: true }, function () {
                    console.log("FROM BACKGROUND:Rev is currently online");
                });
            }
            if (data.vineRev === false) {
                chrome.storage.sync.set({ testDev: false }, function () {
                    console.log("FROM BACKGROUND:Rev is currently offline");
                })
            }
        })

}



function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["jabroniLive", "testDev", "vineRev"], (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}

function setBadge() {
    if (streamerStatus.jabroniLive === true && streamerStatus.vineRev === false) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.jabroniLive === false && streamerStatus.vineRev === false) {
        chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.jabroniLive === true && streamerStatus.vineRev === true) {
        chrome.action.setBadgeText({ text: "2" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.jabroniLive === false && streamerStatus.vineRev === true) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.vineRev === true && streamerStatus.jabroniLive === false) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.vineRev === false && streamerStatus.jabroniLive === false) {
        chrome.action.setBadgeText({ text: "0" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.vineRev === true && streamerStatus.jabroniLive === true) {
        chrome.action.setBadgeText({ text: "2" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
    if (streamerStatus.vineRev === false && streamerStatus.jabroniLive === true) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("FROM BACKGROUND:badge text changed") });
    };
}