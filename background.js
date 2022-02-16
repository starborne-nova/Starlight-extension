const url = "https://jabroni-server.herokuapp.com/pulse";
const localStorage = {
    Vinesauce: {
        id: "25725272",
        status: false,
        game: " ",
        ticker: " "
    },
    FredrikKnudsen: {
        id: "27324958",
        status: false,
        game: " ",
        ticker: " "
    },
    Vargskelethor: {
        id: "28219022",
        status: false,
        game: " ",
        ticker: " "
    },
    RevScarecrow: {
        id: "28254552",
        status: false,
        game: " ",
        ticker: " "
    },
    Limealicious: {
        id: "28337972",
        status: false,
        game: " ",
        ticker: " "
    },
    Jabroni_Mike: {
        id: "79698024",
        status: false,
        game: " ",
        ticker: " "
    },
    options: {
        mikeNotif: true,
        limesNotif: true,
        revNotif: true,
        fredNotif: true,
        vineNotif: true,
        joelNotif: true,
        theme: "star",
    }
};

const outAuth = "stealthystars";

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
            Vinesauce: {
                id: "25725272",
                status: false,
                game: " ",
                ticker: " "
            },
            FredrikKnudsen: {
                id: "27324958",
                status: false,
                game: " ",
                ticker: " "
            },
            Vargskelethor: {
                id: "28219022",
                status: false,
                game: " ",
                ticker: " "
            },
            RevScarecrow: {
                id: "28254552",
                status: false,
                game: " ",
                ticker: " "
            },
            Limealicious: {
                id: "28337972",
                status: false,
                game: " ",
                ticker: " "
            },
            Jabroni_Mike: {
                id: "79698024",
                status: false,
                game: " ",
                ticker: " "
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
            Vinesauce: {
                id: "25725272",
                status: false,
                game: " ",
                ticker: " "
            },
            FredrikKnudsen: {
                id: "27324958",
                status: false,
                game: " ",
                ticker: " "
            },
            Vargskelethor: {
                id: "28219022",
                status: false,
                game: " ",
                ticker: " "
            },
            RevScarecrow: {
                id: "28254552",
                status: false,
                game: " ",
                ticker: " "
            },
            Limealicious: {
                id: "28337972",
                status: false,
                game: " ",
                ticker: " "
            },
            Jabroni_Mike: {
                id: "79698024",
                status: false,
                game: " ",
                ticker: " "
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

        Object.assign(localStorage, newSettings)

        chrome.storage.sync.set(localStorage, function () {
            console.log("ONUPDATE: Initialized")
        });
    }

})

//CREATE STORAGE CHANGE LISTENER TO DEPLOY NOTIFS WHEN NEEDED---//
chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log(changes)

    if (changes.hasOwnProperty("status")) {
        for (let [key, value] of Object.entries(changes)) {
            console.log(key);
            if (value === true && changes.key.oldvalue.status === false && localStorage.options.mikeNotif === true) {
                sendNotification(key);
                console.log("FROM BACKGROUND: " + key + "is now TRUE")
                setBadge();

            }
            else if (value === false) {
                console.log("FROM BACKGROUND: " + key + "is now FALSE")
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

    Object.entries(localStorage).forEach(function ([key, value]) {
        if (value.status === true) {
            console.log("SETBADGE:" + key + " is live.")
            badgeCount++;
        }
        else if(value.status === undefined){
            console.log("SETBADGE: OPTIONS BLOCK " + key)
        }
    })
    var badgeText = badgeCount.toString()
    console.log("FROM SETBADGE: " + badgeText);

    chrome.action.setBadgeText({ text: badgeText }, function () { console.log("FROM BACKGROUND:badge text changed") });
}


//FUNCTION TO DEPLOY NOTIFS-----//
function sendNotification(streamer) {
    const notif = {
        type: "basic",
        message: (streamer + " is Live!"),
        title: "Starlight",
        iconUrl: ("./images/" + streamer + ".png"),
        eventTime: Date.now()
    };

    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 5000)
    })
}