const url = "https://jabroni-server.herokuapp.com/pulse";
const streamerStatus = {
    jabroni: false,
    jabroniGame: "",
    vineRev: false,
    revGame: "",
    limes: false,
    limesGame: ""
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
const outAuth = "coomcheugger"

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

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.storage.sync.set({
            theme: "purple",
            mike: true,
            lime: true,
            rev: true,
        }, function(){
            console.log("ONINSTALL: Initialized")
        });
    };

})

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    if (changes.hasOwnProperty("jabroni") && changes.jabroni.newValue === true) {
        console.log("FROM BACKGROUND: Mike is currently online");
        streamerStatus.jabroni = true;
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

    if (changes.hasOwnProperty("vineRev") && changes.vineRev.newValue === true) {
        streamerStatus.vineRev = true;
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

        });
    }

    if (changes.hasOwnProperty("limes") && changes.limes.newValue === true) {
        streamerStatus.limes = true;
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

    }

    if (changes.hasOwnProperty("jabroni") && changes.jabroni.newValue === false) {
        streamerStatus.jabroni = false;
        console.log("FROM BACKGROUND: Mike is currently offline");

    }

    if (changes.hasOwnProperty("vineRev") && changes.vineRev.newValue === false) {
        streamerStatus.vineRev = false;
        console.log("FROM BACKGROUND: Rev is currently offline");

    }

    if (changes.hasOwnProperty("limes") && changes.limes.newValue === false) {
        streamerStatus.limes = false;
        console.log("FROM BACKGROUND: Limes is currently offline");

    }

    else {
        console.log("Non-status change detected");
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

        .then(response => response.json())
        .then(data => {
            console.log(data)
            for (const [key, value] of Object.entries(data)) {
                switch (true) {
                    case (key === "jabroni"):
                        streamerStatus.jabroni = value;
                        chrome.storage.sync.set({ jabroni: value }, function () {
                            console.log("FROM BACKGROUND: Mike " + value);
                            setBadge();
                        });
                        break;
                    case (key === "jabroniGame"):
                        streamerStatus.jabroniGame = value;
                        chrome.storage.sync.set({ jabroniGame: value }, function () {
                            console.log("FROM BACKGROUND: Mike" + value);
                        });
                        break;
                    case (key === "vineRev"):
                        streamerStatus.vineRev = value;
                        chrome.storage.sync.set({ vineRev: value }, function () {
                            console.log("FROM BACKGROUND: Rev" + value);
                            setBadge();
                        });
                        break;
                    case (key === "revGame"):
                        streamerStatus.revGame = value;
                        chrome.storage.sync.set({ revGame: value }, function () {
                            console.log("FROM BACKGROUND: Rev" + value);
                        });
                        break;
                    case (key === "limes"):
                        streamerStatus.limes = value;
                        chrome.storage.sync.set({ limes: value }, function () {
                            console.log("FROM BACKGROUND: Limes" + value);
                            setBadge();
                        });
                        break;
                    case (key === "limesGame"):
                        streamerStatus.limesGame = value;
                        chrome.storage.sync.set({ limesGame: value }, function () {
                            console.log("FROM BACKGROUND: Limes" + value);
                        });
                        break;
                    default:
                        console.log("FROM BACKGROUND: Error")
                }
            }

        });

}

function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["jabroni", "limes", "vineRev", "jabroniGame", "limesGame", "revGame"], (items) => {
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
    console.log("FROM SETBADGE: " + badgeText);

    chrome.action.setBadgeText({ text: badgeText }, function () { console.log("FROM BACKGROUND:badge text changed") });
}