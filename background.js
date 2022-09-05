/* eslint-disable no-undef */
//TODO LIST:
//See if you can make modules on extensions or if it's just fucking stupid
//Rewrite options functions to use await instead of 15000 thens

const outAuth = "stealthystars";
const url = "https://star-reactor.fly.dev/pulse";
const starUrl = "https://star-reactor.fly.dev/starpulse";
const localStorage = {};
const initStorage = getAllStorageSyncData()
    .then(items => {

        Object.assign(localStorage, items);
        console.log("Storage Loaded")
    })
    .then(() => {
        localStorage.code.enabled ? starPulse() : pulse();
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
        chrome.storage.sync.get(null, (items) => {
            if (items.code.enabled === false) {
                console.log("FROM BACKGROUND: Alarm twitchpulse has triggered")
                pulse();
            }
            else if (items.code.enabled === true) {
                console.log("FROM BACKGROUND: STARPULSE TRIGGERED")
                starPulse();
            }
        })
    }
});
console.log("FROM BACKGROUND: Listener Created");

//SET BADGE BACKGROUND(because white looks bad)----//
chrome.action.setBadgeBackgroundColor({ color: "#7f7f7f" }, function () { console.log("FROM BACKGROUND:background color changed") });

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
            contextMessage: "Background optimizations and fixed an options bug",
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
                const startT = new Date(changes[prop].newValue.online);
                const nowT = new Date();
                const elapsed = Math.abs(nowT - startT);
                const eMinutes = Math.ceil(elapsed / (1000 * 60));

                if (localStorage.options[prop + "Notif"] === true && eMinutes <= 60) {
                    sendNotification(prop);
                    setBadge()
                }
            }
            if (changes[prop].newValue.ticker != undefined && changes[prop].newValue.ticker != changes[prop].oldValue.ticker && changes[prop].oldValue.ticker != undefined) {
                const startT = new Date(changes[prop].newValue.update);
                const nowT = new Date();
                const elapsed = Math.abs(nowT - startT);
                const eMinutes = Math.ceil(elapsed / (1000 * 60));

                if (localStorage.options[prop + "Tick"] === true && eMinutes <= 60) {
                    sendTickerUpdate(prop);
                    setBadge()
                }
            }
        }
    });
})

async function auditStorage() {
    try{
        const loadData = await getAllStorageSyncData()
        const writeOp = await Object.assign(localStorage, loadData)
        if (localStorage.code.enabled){
            const sendPulse = await starPulse()
        }
        else{
            const sendPulse = await pulse()
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
        }
        return new Promise((resolve, reject)=>{
            resolve(chrome.storage.sync.set(localStorage, () => {
                console.log("AUDIT: Operation complete")
                setBadge();
            }))
        })
    }
    catch(e){
        console.log(e)
    }
}

async function installStorage() {
    try{
        const fresh = {}
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
        const incData = await fetch(
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
        const converted = await incData.json()
        Object.assign(fresh, converted[0])
        Object.keys(fresh).forEach(prop => {
            if (prop != "options") {
                storage.options[prop + "Notif"] = true;
                storage.options[prop + "Tick"] = true;
            }
        })
        Object.assign(fresh, storage)
        return new Promise((resolve, reject)=>{
            resolve(chrome.storage.sync.set(fresh, () => {
                console.log("INSTALL OPTIONS BLOCK INITIALIZED")
                setBadge()
            }))
        })
    }
    catch(e){
        console.log(e)
    }
}


//PING THE SERVER FOR INFO AND UPDATE LOCAL AND CLOUD STORAGE(google give me webhooks pls)----//
async function pulse() {
    try {
        const incData = await fetch(
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
        const converted = await incData.json()
        console.log(converted[0])
        Object.keys(localStorage).forEach(prop => {
            if (!converted[0].hasOwnProperty(prop) && prop != "options" && prop != "code") {
                chrome.storage.sync.remove(prop)
                chrome.storage.sync.remove([(prop + "Notif"), (prop + "Tick")])
                delete localStorage[prop]
                delete localStorage.options[prop + "Notif"]
                delete localStorage.options[prop + "Tick"]
                console.log("PULSE: " + prop + " has been removed")
            }
        })
        Object.assign(localStorage, converted[0])
        Object.keys(localStorage).forEach(prop => {
            if (prop != "options" && prop != "code" && localStorage.options[prop + "Notif"] === undefined) {
                localStorage.options[prop + "Notif"] = true;
                localStorage.options[prop + "Tick"] = true;
                console.log("PULSE: Options for " + prop + " added")
            }
        })
        return new Promise((resolve, reject) => {
            resolve(chrome.storage.sync.set(localStorage, () => {
                console.log("FROM PULSE: Data updated")
                console.log(localStorage);
                setBadge()
            }))
        })
    }
    catch (e) {
        console.log(e)
    }
}

async function starPulse() {
    try {
        const sync = await chrome.storage.sync.get(null, (items) => { Object.assign(localStorage, items) })
        const incData = await fetch(
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
        const converted = await incData.json()
        console.log(converted)
        if (Object.keys(converted).length > 0) {
            Object.keys(localStorage).forEach(prop => {
                if (!converted.hasOwnProperty(prop) && prop != "options" && prop != "code") {
                    chrome.storage.sync.remove(prop)
                    chrome.storage.sync.remove([(prop + "Notif"), (prop + "Tick")])
                    delete localStorage[prop]
                    delete localStorage.options[prop + "Notif"]
                    delete localStorage.options[prop + "Tick"]
                    console.log("STARPULSE: " + prop + " has been removed")
                }
            })
        }
        Object.assign(localStorage, converted)
        Object.keys(localStorage).forEach(prop => {
            if (prop != "options" && prop != "code" && localStorage.options[prop + "Notif"] === undefined) {
                localStorage.options[prop + "Notif"] = true;
                localStorage.options[prop + "Tick"] = true;
                console.log("STARPULSE: Options for " + prop + " added")
            }
        })
        return new Promise((resolve, reject) => {
            resolve(
                chrome.storage.sync.set(localStorage, () => {
                    console.log("FROM STARPULSE: Data updated")
                    console.log(localStorage);
                    setBadge()
                })
            )
        })
    }
    catch (e) {
        console.log(e)
    }
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
function sendNotification(streamer) {
    const notif = {
        type: "basic",
        message: localStorage[streamer].game,
        title: (streamer + " is Live!"),
        buttons: [{ title: "Open Twitch" }],
        iconUrl: ("./images/icon48.png"),
        eventTime: Date.now()
    };

    chrome.notifications.getAll((notifications) => {
        if (Object.keys(notifications).length === 0) {
            chrome.notifications.create(streamer, notif, function () {
                chrome.notifications.onButtonClicked.addListener(() => {
                    chrome.tabs.create({ url: ("https://www.twitch.tv/" + streamer.toLowerCase()) })
                })
                setTimeout(() => {
                    chrome.notifications.clear(streamer, (cleared) => {
                        console.log("Notification Cleared = " + cleared)
                    })
                }, 6000)
            })
        }
    })
}

function sendTickerUpdate(streamer) {
    const notif = {
        type: "basic",
        message: localStorage[streamer].ticker,
        title: (streamer + " has updated their ticker!"),
        iconUrl: ("./images/icon48.png"),
        eventTime: Date.now()
    };
    chrome.notifications.getAll((notifications) => {
        if (Object.keys(notifications).length === 0) {
            chrome.notifications.create(streamer, notif, function () {
                setTimeout(() => {
                    chrome.notifications.clear(streamer, (cleared) => {
                        console.log("Notification Cleared = " + cleared)
                    })
                }, 6000)
            })
        }
    })
}