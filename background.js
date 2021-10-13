const url = "https://jabroni-server.herokuapp.com/pulse";
const localStorage = {
    streamers: {
        mike: false,
        limes: true,
        rev: true,
        fred: true
    },
    activeGame: {
        mikeGame: "",
        limesGame: "",
        revGame: "",
        fredGame: ""
    },
    options: {
        mikeNotif: true,
        limesNotif: true,
        revNotif: true,
        fredNotif: true,
        theme: "purple",
    }
};
const mikeNotif = {
    type: "basic",
    message: "Jabroni_Mike is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/mike.png",
    eventTime: Date.now()
};
const revNotif = {
    type: "basic",
    message: "RevScarecrow is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/rev.png",
    eventTime: Date.now()
}
const limesNotif = {
    type: "basic",
    message: "Limealicious is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/limes.png",
    eventTime: Date.now()
}
const fredNotif = {
    type: "basic",
    message: "Fred Knudsen is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/limes.png",
    eventTime: Date.now()
}
const outAuth = "coomcheugger";

//const objFilter = ["jabroni", "jabroniGame", "vineRev", "revGame", "limes", "limesGame", "fredK", "fredGame"];

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
        Object.assign(localStorage, items);

    })
    .then(() => {
        setBadge();
    });

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.storage.sync.set({
            streamers: {
                mike: false,
                limes: true,
                rev: true,
                fred: true
            },
            activeGame: {
                mikeGame: "",
                limesGame: "",
                revGame: "",
                fredGame: ""
            },
            options: {
                mikeNotif: true,
                limesNotif: true,
                revNotif: true,
                fredNotif: true,
                theme: "purple",
            }
        }
            , function () {
                console.log("ONINSTALL: Initialized")
            });
    };

})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    if (changes.hasOwnProperty("streamers")) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes.streamers)) {
            console.log(key);
            if (newValue === true) {
                chrome.notifications.getPermissionLevel(function (level) {
                    if (level === "granted") {
                        if (changes.streamers.mike === true) {
                            sendNotification("mike", mikeNotif);
                            localStorage.streamers.mike = true;
                            console.log("FROM BACKGROUND: Mike value is now TRUE");
                        }
                        else if (changes.streamers.rev === true) {
                            sendNotification("rev", revNotif);
                            localStorage.streamers.rev = true;
                            console.log("FROM BACKGROUND: Rev value is now TRUE")
                        }
                        else if (changes.streamers.limes === true) {
                            sendNotification("limes", limesNotif);
                            localStorage.streamers.limes = true;
                            console.log("FROM BACKGROUND: Limes value is now TRUE")
                        }
                        else if (changes.streamers.fred === true) {
                            sendNotification("fred", fredNotif);
                            localStorage.streamers.fred = true;
                            console.log("FROM BACKGROUND: Fred value is now TRUE")
                        }
                    }
                })
            }
            else if (newValue === false) {
                if (changes.streamers.mike === false) {
                    localStorage.streamers.mike = false;
                    console.log("FROM BACKGROUND: Mike value is now FALSE")
                }
                else if (changes.streamers.rev === false) {
                    localStorage.streamers.rev = false;
                    console.log("FROM BACKGROUND: Rev value is now FALSE")
                }
                else if (changes.streamers.limes === false) {
                    localStorage.streamers.limes = false;
                    console.log("FROM BACKGROUND: Limes value is now FALSE")
                }
                else if (changes.streamers.fred === false) {
                    localStorage.streamers.fred = false;
                    console.log("FROM BACKGROUND: Fred value is now FALSE")
                }
            }
        }
    }

    setBadge();

});

function pulse() {
    fetch(
        url,
        {
            method: "POST",
            mode: "cors",
            headers:
            {
                "Content-type": "application/json",
                "chrome": outAuth
            },
        })
        // KEY IS A STRING THAT"S WHY IT"S FUCKING EVERYTHING UP
        .then(response => response.json())
        .then(data => {
            console.log(data)
            Object.assign(localStorage.streamers, data.streamers)
            Object.assign(localStorage.activeGame, data.activeGame)
            chrome.storage.sync.set({streamers:localStorage.streamers},()=>{
                console.log("FROM PULSE: Streamers updated")
            })
            chrome.storage.sync.set({activeGame:localStorage.activeGame},()=>{
                console.log("FROM PULSE: Active Game updated")
            })
            // switch (true) {
            //     case (key === "jabroni"):
            //         localStorage.jabroni = value;
            //         chrome.storage.sync.set({ jabroni: value }, function () {
            //             console.log("FROM BACKGROUND: Mike " + value);
            //             setBadge();
            //         });
            //         break;
            //     case (key === "jabroniGame"):
            //         localStorage.jabroniGame = value;
            //         chrome.storage.sync.set({ jabroniGame: value }, function () {
            //             console.log("FROM BACKGROUND: Mike" + value);
            //         });
            //         break;
            //     case (key === "vineRev"):
            //         localStorage.vineRev = value;
            //         chrome.storage.sync.set({ vineRev: value }, function () {
            //             console.log("FROM BACKGROUND: Rev" + value);
            //             setBadge();
            //         });
            //         break;
            //     case (key === "revGame"):
            //         localStorage.revGame = value;
            //         chrome.storage.sync.set({ revGame: value }, function () {
            //             console.log("FROM BACKGROUND: Rev" + value);
            //         });
            //         break;
            //     case (key === "limes"):
            //         localStorage.limes = value;
            //         chrome.storage.sync.set({ limes: value }, function () {
            //             console.log("FROM BACKGROUND: Limes" + value);
            //             setBadge();
            //         });
            //         break;
            //     case (key === "limesGame"):
            //         localStorage.limesGame = value;
            //         chrome.storage.sync.set({ limesGame: value }, function () {
            //             console.log("FROM BACKGROUND: Limes" + value);
            //         });
            //         break;
            //     case (key === "fredK"):
            //         localStorage.fredK = value;
            //         chrome.storage.sync.set({ fredK: value }, function () {
            //             console.log("FROM BACKGROUND: Fred " + value);
            //             setBadge();
            //         });
            //         break;
            //     case (key === "fredGame"):
            //         localStorage.fredGame = value;
            //         chrome.storage.sync.set({ fredGame: value }, function () {
            //             console.log("FROM BACKGROUND: Fred " + value);
            //         });
            //         break;
            //     default:
            //         console.log("FROM BACKGROUND: Error")
            // }


        })
        .then(() => {
            chrome.storage.sync.get(null,(items)=>{
                console.log(items)
            });
            setBadge()
        });

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

function setBadge() {
    var badgeCount = 0;

    Object.entries(localStorage.streamers).forEach(function ([key, value]) {
        if (value === true) {
            console.log("SETBADGE:" + key + " is live.")
            badgeCount++;
        }
    })
    var badgeText = badgeCount.toString()
    console.log("FROM SETBADGE: " + badgeText);

    chrome.action.setBadgeText({ text: badgeText }, function () { console.log("FROM BACKGROUND:badge text changed") });
}

function sendNotification(streamer, notif) {
    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 5000)
    })
}