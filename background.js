const url = "https://jabroni-server.herokuapp.com/pulse";
const localStorage = {
    streamers: {
        mike: false,
        limes: false,
        rev: false,
        fred: false,
        vine: false,
        joel: false
    },
    activeGame: {
        mikeGame: "",
        limesGame: "",
        revGame: "",
        fredGame: "",
        vineGame: "",
        joelGame: ""
    },
    title: {
        mikeTitle: "",
        limesTitle: "",
        revTitle: "",
        fredTitle: "",
        vineTitle: "",
        joelTitle: ""
    },
    options: {
        mikeNotif: true,
        limesNotif: true,
        revNotif: true,
        fredNotif: true,
        vineNotif: true,
        joelNotif: true,
        theme: "purple",
    }
};
const mikeNotif = {
    type: "basic",
    message: "Jabroni_Mike is Live!",
    title: "Starlight",
    iconUrl: "./images/mike.png",
    eventTime: Date.now()
};
const revNotif = {
    type: "basic",
    message: "RevScarecrow is Live!",
    title: "Starlight",
    iconUrl: "./images/rev.png",
    eventTime: Date.now()
}
const limesNotif = {
    type: "basic",
    message: "Limealicious is Live!",
    title: "Starlight",
    iconUrl: "./images/limes.png",
    eventTime: Date.now()
}
const fredNotif = {
    type: "basic",
    message: "Fred Knudsen is Live!",
    title: "Starlight",
    iconUrl: "./images/fred.png",
    eventTime: Date.now()
}
const vineNotif = {
    type: "basic",
    message: "Vinesauce is Live!",
    title: "Starlight",
    iconUrl: "./images/vine.png",
    eventTime: Date.now()
}
const joelNotif = {
    type: "basic",
    message: "Joel is Live!",
    title: "Starlight",
    iconUrl: "./images/vine.png",
    eventTime: Date.now()
}
const outAuth = "coomcheugger";

//--------------------------------------------------------END OF INIT VARIABLES-----------------------------------------------------------------//

//CREATE PULSE ALARM------//
chrome.alarms.create("twitchPulse", {
    delayInMinutes: 1,
    periodInMinutes: 2
});
console.log("FROM BACKGROUND: Alarm Created")
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        console.log("FROM BACKGROUND: Alarm twitchpulse has triggered")
        pulse();
    }
});
console.log("FROM BACKGROUND: Listener Created");

//SET BADGE BACKGROUND(because white looks bad)----//
chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("FROM BACKGROUND:background color changed") });


//INIT AND SET LOCAL STORAGE-----//
const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(localStorage, items);

    })
    .then(() => {
        setBadge();
    });

//FIRST RUN INITIALIZE CLOUD STORAGE----//
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.storage.sync.set({
            streamers: {
                mike: false,
                limes: false,
                rev: false,
                fred: false,
                vine: false,
                joel: false
            },
            activeGame: {
                mikeGame: "",
                limesGame: "",
                revGame: "",
                fredGame: "",
                vineGame: "",
                joelGame: ""
            },
            title: {
                mikeTitle: "",
                limesTitle: "",
                revTitle: "",
                fredTitle: "",
                vineTitle: "",
                joelTitle: ""
            },
            options: {
                mikeNotif: true,
                limesNotif: true,
                revNotif: true,
                fredNotif: true,
                vineNotif: true,
                joelNotif: true,
                theme: "purple",
            }
        }
            , function () {
                console.log("ONINSTALL: Initialized")
            });
    }
    else if (details.reason === "update") {
        const newSettings = {
            streamers: {
                mike: false,
                limes: false,
                rev: false,
                fred: false,
                vine: false,
                joel: false
            },
            activeGame: {
                mikeGame: "",
                limesGame: "",
                revGame: "",
                fredGame: "",
                vineGame: "",
                joelGame: ""
            },
            title: {
                mikeTitle: "",
                limesTitle: "",
                revTitle: "",
                fredTitle: "",
                vineTitle: "",
                joelTitle: ""
            },
            options: {
                vineNotif: false,
                joelNotif: false,
            }
        }

        Object.assign(newSettings, localStorage)

        chrome.storage.sync.set(newSettings, function () {
            console.log("ONUPDATE: Initialized")
        });
    }

})

//CREATE STORAGE CHANGE LISTENER TO DEPLOY NOTIFS WHEN NEEDED---//
chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    if (changes.hasOwnProperty("streamers")) {
        for (let [key, value] of Object.entries(changes.streamers.newValue)) {
            console.log(key);
            if (value === true) {
                if (key === "mike" && changes.streamers.oldValue.mike === false && localStorage.options.mikeNotif === true) {
                    sendNotification("mike", mikeNotif);
                    console.log("FROM BACKGROUND: Mike value is now TRUE");
                    setBadge();
                }
                else if (key === "rev" && changes.streamers.oldValue.rev === false && localStorage.options.revNotif === true) {
                    sendNotification("rev", revNotif);
                    console.log("FROM BACKGROUND: Rev value is now TRUE");
                    setBadge();
                }
                else if (key === "limes" && changes.streamers.oldValue.limes === false && localStorage.options.limesNotif === true) {
                    sendNotification("limes", limesNotif);
                    console.log("FROM BACKGROUND: Limes value is now TRUE");
                    setBadge();
                }
                else if (key === "fred" && changes.streamers.oldValue.fred === false && localStorage.options.fredNotif === true) {
                    sendNotification("fred", fredNotif);
                    console.log("FROM BACKGROUND: Fred value is now TRUE");
                    setBadge();
                }
                else if (key === "vine" && changes.streamers.oldValue.vine === false && localStorage.options.vineNotif === true) {
                    sendNotification("vine", vineNotif);
                    console.log("FROM BACKGROUND: Vine value is now TRUE");
                    setBadge();
                }
                else if (key === "joel" && changes.streamers.oldValue.joel === false && localStorage.options.joelNotif === true) {
                    sendNotification("joel", joelNotif);
                    console.log("FROM BACKGROUND: Joel value is now TRUE");
                    setBadge();
                }
            }
            else if (value === false) {
                console.log("FROM BACKGROUND: " + key + " value is now FALSE")
            }
        }
        setBadge();
    }
});

//PING THE SERVER FOR INFO AND UPDATE LOCAL AND CLOUD STORAGE(google give me webhooks pls)----//
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
            console.log(data[0])
            Object.assign(localStorage, data[0])
            chrome.storage.sync.set(localStorage, () => {
                console.log("FROM PULSE: Data updated")
            })
        })
        .then(() => {
            setBadge()
        });

}


//FUNCTION TO INIT LOCAL STORAGE---//
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

//FUNCTION TO SET BADGE NUMBER; PARSES DATA AND COUNTS LIVE STREAMERS----//
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


//FUNCTION TO DEPLOY NOTIFS-----//
function sendNotification(streamer, notif) {
    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 5000)
    })
}