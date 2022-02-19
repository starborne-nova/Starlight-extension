const localStorage = {};


//ADD IN TICKER OPTIONS
//Dim font color
//border + shadow on boxes
//gradient on boxes?


const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(localStorage, items);
    });

const notifOptions = {
    type: "basic",
    title: "Starlight",
    message: "This is a test!",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
}

const mikeNotif = {
    type: "basic",
    message: "Jabroni_Mike is Live!",
    title: "Starlight",
    iconUrl: "./images/mike.png",
    eventTime: Date.now()
};

function saveOptions() {
    var Otheme = document.getElementById("setTheme").value;
    var OmikeN = document.getElementById("mikeNotifs").checked ? true : false;
    var OmikeT = document.getElementById("mikeTicker").checked ? true : false;
    var OlimeN = document.getElementById("limeNotifs").checked ? true : false;
    var OlimeT = document.getElementById("limeTicker").checked ? true : false;
    var OrevN = document.getElementById("revNotifs").checked ? true : false;
    var OrevT = document.getElementById("revTicker").checked ? true : false;
    var OfredN = document.getElementById("fredNotifs").checked ? true : false;
    var OfredT = document.getElementById("fredTicker").checked ? true : false;
    var OvineN = document.getElementById("vineNotifs").checked ? true : false;
    var OvineT = document.getElementById("vineTicker").checked ? true : false;

    chrome.storage.sync.set({
        options: {
            mikeNotif: OmikeN,
            mikeTicker: OmikeT,
            limesNotif: OlimeN,
            limesTicker: OlimeT,
            revNotif: OrevN,
            revTicker: OrevT,
            fredNotif: OfredN,
            fredTicker: OfredT,
            vineNotif: OvineN,
            vineTicker: OvineT,
            joelNotif: true,
            joelTicker: true,
            theme: Otheme,
        }
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        loadOptions();
    });
};

function loadOptions() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            document.body.setAttribute("data-theme", items.options.theme);
            document.getElementById("setTheme").value = items.options.theme;
            document.getElementById("mikeNotifs").checked = items.options.mikeNotif ? true : false;
            document.getElementById("mikeTicker").checked = items.options.mikeTicker ? true : false;
            document.getElementById("limeNotifs").checked = items.options.limesNotif ? true : false;
            document.getElementById("limeTicker").checked = items.options.limesTicker ? true : false;
            document.getElementById("revNotifs").checked = items.options.revNotif ? true : false;
            document.getElementById("revTicker").checked = items.options.revTicker ? true : false;
            document.getElementById("fredNotifs").checked = items.options.fredNotif ? true : false;
            document.getElementById("fredTicker").checked = items.options.fredTicker ? true : false;
            document.getElementById("vineNotifs").checked = items.options.vineNotif ? true : false;
            document.getElementById("vineTicker").checked = items.options.vineTicker ? true : false;
        }

    });
}

function loadOnline() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            if(items.Jabroni_Mike.status === true){
                document.getElementById("mikeOnline").innerText="LIVE"
            }
            if(items.Limealicious.status === true){
                document.getElementById("limeOnline").innerText="LIVE"
            }
            if(items.FredrikKnudsen.status === true){
                document.getElementById("fredOnline").innerText="LIVE"
            }
            if(items.Vinesauce.status === true){
                document.getElementById("vineOnline").innerText="LIVE"
            }
            if(items.RevScarecrow.status === true){
                document.getElementById("revOnline").innerText="LIVE"
            }
        }
    })
}

function handleTestNotif() {
    chrome.notifications.getAll((notifications) => {

        if (Object.keys(notifications).length != 0) {
            setTimeout(() => {
                chrome.notifications.create("testNote", notifOptions, function (id) {
                    setTimeout(() => {
                        chrome.notifications.clear("testNote", (cleared) => {
                            console.log("Notification Cleared = " + cleared)
                        })
                    }, 5000)
                })
            }, 5500)
        }

        else {
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

function sendNotification(streamer, notif) {
    chrome.notifications.create(streamer, notif, function () {
        setTimeout(() => {
            chrome.notifications.clear(streamer, (cleared) => {
                console.log("Notification Cleared = " + cleared)
            })
        }, 5000)
    })
}

document.getElementById("testNotif").addEventListener("click", handleTestNotif);

document.addEventListener('DOMContentLoaded', loadOptions);

document.addEventListener('DOMContentLoaded', loadOnline, { once: true });

document.getElementById('save').addEventListener('click',
    saveOptions);