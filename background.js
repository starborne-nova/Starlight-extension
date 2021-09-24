const url = "https://jabroni-server.herokuapp.com/pulse";
const streamerStatus = {
    jabroni: false,
    vineRev: false,
    limes: false
};
const mikeNotif = {
    type: "basic",
    message: "Jabroni_Mike is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
};
const revNotif = {
    type: "basic",
    message: "RevScarecrow is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
}
const limesNotif = {
    type: "basic",
    message: "Limealicious is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
}


chrome.alarms.create("twitchPulse", {
    delayInMinutes: 1,
    periodInMinutes: 3
});
console.log("FROM BACKGROUND: Alarm Created")
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        console.log("FROM BACKGROUND: Alarm twitchpulse has triggered")
        pulse();
    }
});
console.log("FROM BACKGROUND: Listener Created");
chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("FROM BACKGROUND:background color changed") });



const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(streamerStatus, items);

    })
    .then(() => {
        setBadge();
    });

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    switch (true) {
        case (changes.hasOwnProperty("jabroni")):
            if (changes.jabroni.newValue === true) {
                chrome.storage.sync.set({ jabroni: true }, function () {
                    console.log("FROM BACKGROUND: Mike is currently online");
                });
                chrome.notifications.getPermissionLevel(function (level) {
                    if (level === "granted") {
                        chrome.notifications.create("mikeLive", mikeNotif, function () {
                            setTimeout(() => {
                                chrome.notifications.clear("mikeLive", (cleared) => {
                                    console.log("Notification Cleared = " + cleared)
                                })
                            }, 5000)
                        })
                    }
                });
            }
            else {
                chrome.storage.sync.set({ jabroni: false }, function () {
                    console.log("FROM BACKGROUND: Mike is currently offline");
                });
            }

            setBadge();
            break;
        case (changes.hasOwnProperty("vineRev")):
            if (changes.vineRev.newValue === true) {

                chrome.storage.sync.set({ vineRev: true }, function () {
                    console.log("FROM BACKGROUND: Rev is currently online");
                    chrome.notifications.getPermissionLevel(function (level) {
                        if (level === "granted") {
                            chrome.notifications.create("revLive", revNotif, function () {
                                setTimeout(() => {
                                    chrome.notifications.clear("revLive", (cleared) => {
                                        console.log("Notification Cleared = " + cleared)
                                    })
                                }, 5000)
                            })
                        }

                    })
                });
            }

            else {
                chrome.storage.sync.set({ vineRev: false }, function () {
                    console.log("FROM BACKGROUND: Rev is currently offline");
                })
            }
            setBadge();
            break;
        case (changes.hasOwnProperty("limes")):
            if (changes.limes.newValue === true) {

                chrome.storage.sync.set({ limes: true }, function () {
                    console.log("FROM BACKGROUND: Limes is currently online");
                    chrome.notifications.getPermissionLevel(function (level) {
                        if (level === "granted") {
                            chrome.notifications.create("limesLive", limesNotif, function () {
                                setTimeout(() => {
                                    chrome.notifications.clear("limesLive", (cleared) => {
                                        console.log("Notification Cleared = " + cleared)
                                    })
                                }, 5000)
                            })
                        }

                    });
                });
            }
            else {
                chrome.storage.sync.set({ limes: false }, function () {
                    console.log("FROM BACKGROUND: Limes is currently offline");
                })
            }
            setBadge();
            break;
        default:

            console.log("non-status change detected")

            break;
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
        })

        .then(response => response.json())
        .then(data => {
            console.log(data)
            for (const [key, value] of Object.entries(data)) {
                switch (true) {
                    case (key === "jabroni"):
                        chrome.storage.sync.set({ jabroni: value }, function () {
                            console.log("FROM BACKGROUND: Mike" + value);
                        });
                        break;
                    case (key === "vineRev"):
                        chrome.storage.sync.set({ vineRev: value }, function () {
                            console.log("FROM BACKGROUND: Rev" + value);
                        });
                        break;
                    case (key === "limes"):
                        chrome.storage.sync.set({ limes: value }, function () {
                            console.log("FROM BACKGROUND: Limes" + value);
                        });
                        break;
                    default:
                        console.log("FROM BACKGROUND: Error")
                }
            }
        })
        .then(() => {
            setBadge()
        });

}

function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["jabroni", "limes", "vineRev"], (items) => {
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
    var badgeCount = 0;

    Object.entries(streamerStatus).forEach(function ([key, value]) {
        if (value === true) {
            console.log("SETBADGE:" + key + " is live.")
            badgeCount++;
        }
    })
    var badgeText = badgeCount.toString()

    chrome.action.setBadgeText({ text: badgeText }, function () { console.log("FROM BACKGROUND:badge text changed") });
}