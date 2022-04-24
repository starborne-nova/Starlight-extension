/* eslint-disable no-undef */
//TODO LIST:
// Is there a less fucking stupid way to do this with Object.defineProperty?
//Package all CSS JS and Fonts in extension
//See if you can make modules on extensions or if it's just fucking stupid

const outAuth = "stealthystars";
const url = "https://jabroni-server.herokuapp.com/pulse";
const starUrl = "https://jabroni-server.herokuapp.com/starpulse";
const localStorage = {};
const initStorage = getAllStorageSyncData()
    .then(items => {

        Object.assign(localStorage, items);
        console.log("Storage Loaded")
    })
    .then(() => {
        setBadge();
        localStorage.code.enabled?starPulse():pulse();
    });

//--------------------------------------------------------END OF INIT VARIABLES-----------------------------------------------------------------//

//CREATE PULSE ALARM------//
chrome.alarms.create("twitchPulse", {
    delayInMinutes: 1,
    periodInMinutes: 3
});
console.log("FROM BACKGROUND: Alarm Created")
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        chrome.storage.sync.get(null, (items)=>{
            if(items.code.enabled === false){
                console.log("FROM BACKGROUND: Alarm twitchpulse has triggered")
                pulse();
            }
            else if(items.code.enabled === true){
                console.log("FROM BACKGROUND: STARPULSE TRIGGERED")
                starPulse();
            }
        })
    }
});
console.log("FROM BACKGROUND: Listener Created");

//SET BADGE BACKGROUND(because white looks bad)----//
chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("FROM BACKGROUND:background color changed") });

//FIRST RUN INITIALIZE CLOUD STORAGE----//
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        installStorage();
    }
    else if (details.reason === "update") {
        auditStorage();

        const manifest = chrome.runtime.getManifest();
        const updateNotif = {
            type: "basic",
            message: ("Updated to version " + manifest.version),
            contextMessage: "Check options page for changelog!",
            title: "Starlight",
            iconUrl: "./images/icon48.png",
            eventTime: Date.now()
        };

        chrome.notifications.create("update", updateNotif, function () {
            setTimeout(() => {
                chrome.notifications.clear("update", (cleared) => {
                    console.log("Notification Cleared = " + cleared)
                })
            }, 7500)
        })
    }
})

//CREATE STORAGE CHANGE LISTENER TO DEPLOY NOTIFS WHEN NEEDED---//
chrome.storage.onChanged.addListener(function (changes) {
    console.log(changes)

    Object.keys(changes).forEach(prop => {
        console.log(prop);
        if (changes[prop].hasOwnProperty("newValue") && changes[prop].hasOwnProperty("oldValue")) {
            if (changes[prop].newValue.status === true && changes[prop].oldValue.status === false && changes[prop].oldValue.status != undefined) {
                if (localStorage.options[prop + "Notif"] === true) {
                    sendNotification(prop);
                    setBadge()
                }}
            if (changes[prop].newValue.ticker != undefined && changes[prop].newValue.ticker != changes[prop].oldValue.ticker && changes[prop].oldValue.ticker != undefined) {
                if (localStorage.options[prop + "Tick"] === true) {
                    sendTickerUpdate(prop);
                    setBadge()
                }}
        }
    });
})

function auditStorage() {
    getAllStorageSyncData()
        .then(items => {
            // Copy the data retrieved from storage into storageCache.
            Object.assign(localStorage, items);
        })
        .then(() => {
            return fetch(
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
        })
        .then(response => response.json())
        .then(data => {
            console.log("AUDIT: Begin streamer audit")
            Object.assign(localStorage, data[0])
            Object.keys(localStorage).forEach(prop => {
                if (!data[0].hasOwnProperty(prop) && prop != "options" && prop != "code") {
                    chrome.storage.sync.remove(prop)
                    chrome.storage.sync.remove([(prop + "Notif"), (prop + "Tick")])
                    delete localStorage[prop]
                    delete localStorage.options[prop + "Notif"]
                    delete localStorage.options[prop + "Tick"]
                    console.log("AUDIT: " + prop + " has been removed")
                }
            })
            console.log("AUDIT: Streamer audit complete")
        })
        .then(() => {
            console.log("AUDIT: Begin options audit")
            Object.keys(localStorage).forEach(prop => {
                if (prop != "options" && prop != "code" && localStorage.options[prop + "Notif"] === undefined) {
                    localStorage.options[prop + "Notif"] = true;
                    localStorage.options[prop + "Tick"] = true;
                    console.log("AUDIT: Options for " + prop + " added")
                }
            })
            if (localStorage.code === undefined) {
                const codeBlock = {
                    code: {
                        generated: "",
                        userID: "",
                        req: {},
                        enabled: false
                    }
                }
                Object.assign(localStorage, codeBlock);
                console.log("AUDIT: No code block found, insertion complete")
            }
            console.log("AUDIT: Options audit complete")
        })
        .then(() => {
            chrome.storage.sync.set(localStorage, () => {
                console.log("AUDIT: Operation complete")
            })
        })
        .then(() => {
            setBadge();
        })
        .catch(e => { console.log(e) })
}

function installStorage() {
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
            Object.assign(localStorage, data[0])
            chrome.storage.sync.set(localStorage, () => {
                console.log("INSTALL PULSE: Data updated")
            })
        })
        .then(() => {
            const storage = {
                options: {
                    theme: "star"
                },
                code: {
                    generated: "",
                    userID: "",
                    req: {},
                    enabled: false
                }
            }
            Object.keys(localStorage).forEach(prop => {
                if (prop != "options") {
                    storage.options[prop + "Notif"] = true;
                    storage.options[prop + "Tick"] = true;
                }
            })
            Object.assign(localStorage, storage)
        })
        .then(() => {
            chrome.storage.sync.set(localStorage, () => {
                console.log("INSTALL OPTIONS BLOCK INITIALIZED")
            })
        })
        .then(() => {
            setBadge()
        })
        .catch(e => { console.log(e) })

}


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
                console.log(localStorage);
                setBadge()
            })
        })
        .then(()=>{
            Object.keys(localStorage).forEach(prop => {
                if (prop != "options" && prop != "code" && localStorage.options[prop + "Notif"] === undefined) {
                    localStorage.options[prop + "Notif"] = true;
                    localStorage.options[prop + "Tick"] = true;
                    console.log("PULSE: Options for " + prop + " added")
                    chrome.storage.sync.set(localStorage, () => {
                        console.log("FROM PULSE: New options saved")
                    })
                    sendAddedNotification(prop);
                }
            })
        })
        .catch((e) => {
            console.log(e)
        })

}

function starPulse() {
    console.log(localStorage.code.req)
    fetch(
        starUrl,
        {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(localStorage.code.req),
            headers:
            {
                "Content-type": "application/json",
                "chrome": outAuth
            },
        })
        .then(response=> response.json())
        .then(data => {
            console.log(data)
            Object.keys(localStorage).forEach(prop => {
                if (!data.hasOwnProperty(prop) && prop != "options" && prop != "code") {
                    chrome.storage.sync.remove(prop)
                    chrome.storage.sync.remove([(prop + "Notif"), (prop + "Tick")])
                    delete localStorage[prop]
                    delete localStorage.options[prop + "Notif"]
                    delete localStorage.options[prop + "Tick"]
                    console.log("STARPULSE: " + prop + " has been removed")
                }
            })
            Object.assign(localStorage, data)
            chrome.storage.sync.set(localStorage, () => {
                console.log("FROM STARPULSE: Data updated")
                console.log(localStorage);
                setBadge()
            })
        })
        .then(()=>{
            Object.keys(localStorage).forEach(prop => {
                if (prop != "options" && prop!= "code" && localStorage.options[prop + "Notif"] === undefined) {
                    localStorage.options[prop + "Notif"] = true;
                    localStorage.options[prop + "Tick"] = true;
                    console.log("STARPULSE: Options for " + prop + " added")
                    chrome.storage.sync.set(localStorage, () => {
                        console.log("STARPULSE: New options saved")
                    })
                }
            })
        })
        .catch((e) => {
            console.log(e)
        })

}


//FUNCTION TO INIT LOCAL STORAGE---//
function getAllStorageSyncData() {

    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    });
}

function storageReset() {
    chrome.storage.sync.clear(() => {
        installStorage();
    })
}
//FUNCTION TO SET BADGE NUMBER; PARSES DATA AND COUNTS LIVE STREAMERS----//
function setBadge() {
    var badgeCount = 0;
    chrome.storage.sync.get(null, (items) => {
        Object.entries(items).forEach(function ([key, value]) {
            if (items.options[key + "Notif"] === true) {
                if (value.status === true) {
                    console.log("SETBADGE:" + key + " is live.")
                    badgeCount++;
                }
                else if (value.status === undefined) {
                    console.log("SETBADGE: OPTIONS BLOCK " + key)
                }
            }
        })
        var badgeText = badgeCount.toString()
        console.log("FROM SETBADGE: " + badgeText);

        chrome.action.setBadgeText({ text: badgeText }, function () { console.log("FROM BACKGROUND:badge text changed") });
    })
}


//FUNCTION TO DEPLOY NOTIFS-----//
function sendAddedNotification(streamer) {
    const notif = {
        type: "basic",
        message: (streamer + " has been added!"),
        contextMessage: "The followed list has been updated, check the options page for more info",
        title: "Starlight",
        iconUrl: ("./images/icon48.png"),
        eventTime: Date.now()
    };

    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 6000)
    })
}

function sendNotification(streamer) {
    const notif = {
        type: "basic",
        message: (streamer + " is Live!"),
        contextMessage: localStorage[streamer].game,
        title: "Starlight",
        iconUrl: ("./images/" + streamer + ".png"),
        eventTime: Date.now()
    };

    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 6000)
    })
}

function sendTickerUpdate(streamer) {
    const notif = {
        type: "basic",
        message: (streamer + " has updated their ticker!"),
        contextMessage: localStorage[streamer].ticker,
        title: "Starlight",
        iconUrl: ("./images/" + streamer + ".png"),
        eventTime: Date.now()
    };

    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 6000)
    })
}