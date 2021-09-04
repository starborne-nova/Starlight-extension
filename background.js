const url = "https://jabroni-server.herokuapp.com/pulse";
const streamerStatus = {
    jabroniLive: false,
    testDev: false
};

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(streamerStatus, items)
    })
    .then(() => {
        populate();
    });

chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("background color changed") });
chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });

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
    if (changes.jabroniLive === true && streamerStatus.testDev === false) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
    };
    if (changes.jabroniLive === false && streamerStatus.testDev === false) {
        chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });
    };
    if (changes.jabroniLive === true && streamerStatus.testDev === true) {
        chrome.action.setBadgeText({ text: "2" }, function () { console.log("badge text changed") });
    };
    if (changes.jabroniLive === false && streamerStatus.testDev === true) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
    };
    if (changes.testDev === true && streamerStatus.jabroniLive === false) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
    };
    if (changes.testDev === false && streamerStatus.jabroniLive === false) {
        chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });
    };
    if (changes.testDev === true && streamerStatus.jabroniLive === true) {
        chrome.action.setBadgeText({ text: "2" }, function () { console.log("badge text changed") });
    };
    if (changes.testDev === false && streamerStatus.jabroniLive === true) {
        chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
    };
    chrome.storage.sync.set({ badgeStatus: badgeNumber }, function () { console.log("badge number changed") });

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

            if (data === true) {
                chrome.storage.sync.set({ jabroniLive: true }, function () {
                    console.log("Mike is currently online");
                });
            }
            if (data === false) {
                chrome.storage.sync.set({ jabroniLive: false }, function () {
                    console.log("Mike is currently offline");
                });
            }
        })
        .then(fetch(
            url,
            {
                method: "post",
                mode: 'cors',
                headers:
                {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ streamer: "TEST" })
            })
            .then(response => response.json())
            .then(data => {

                console.log(data);

                if (data === true) {
                    chrome.storage.sync.set({ testDev: true }, function () {
                        console.log("TEST is currently online");
                    });
                }
                if (data === false) {
                    chrome.storage.sync.set({ testDev: false }, function () {
                        console.log("TEST is currently offline");
                    })
                }
            }
            ))
}

function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}