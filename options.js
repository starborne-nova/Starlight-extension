const localStorage = {
    streamers: {
        mike: false,
        limes: false,
        rev: false,
        fred: false
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

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(localStorage, items);
    });

const notifOptions = {
    type: "basic",
    title: "JabroniNotify",
    message: "This is a test!",
    iconUrl: "./images/icon48.png",
    eventTime: Date.now()
}

const mikeNotif = {
    type: "basic",
    message: "Jabroni_Mike is Live!",
    title: "JabroniNotify",
    iconUrl: "./images/mike.png",
    eventTime: Date.now()
};

function saveOptions() {
    var Otheme = document.getElementById("setTheme").value;
    var OmikeN = document.getElementById("mikeNotifs").checked ? true : false;
    var OlimeN = document.getElementById("limeNotifs").checked ? true : false;
    var OrevN = document.getElementById("revNotifs").checked ? true : false;
    var OfredN = document.getElementById("fredNotifs").checked ? true : false;

    chrome.storage.sync.set({
        options: {
            mikeNotif: OmikeN,
            limesNotif: OlimeN,
            revNotif: OrevN,
            fredNotif: OfredN,
            theme: Otheme,
        }
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        getAllStorageSyncData();
    });
};

function loadOptions() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            chrome.notifications.getPermissionLevel(function (level) {
                if(level=== "granted"){
                    document.getElementById("notifStatus").innerText = "Permission: Granted";  
                }
                else{
                    document.getElementById("notifStatus").innerText = "Permission: Not Granted";
                }
            });
            document.getElementById("setTheme").value = items.options.theme;
            document.getElementById("mikeNotifs").checked = items.options.mikeNotif ? true : false;
            document.getElementById("limeNotifs").checked = items.options.limesNotif ? true : false;
            document.getElementById("revNotifs").checked = items.options.revNotif ? true : false;
            document.getElementById("fredNotifs").checked = items.options.fredNotif ? true : false;

            setTheme();
        }

    });
}

function handleTestNotif() {
    chrome.notifications.getAll((notifications)=>{
        
        if(Object.keys(notifications).length != 0){
            setTimeout(()=>{
                chrome.notifications.getPermissionLevel(function (level) {
                    if (level === "granted") {
                        chrome.notifications.create("testNote", notifOptions, function (id) {
                            setTimeout(() => {
                                chrome.notifications.clear("testNote", (cleared) => {
                                    console.log("Notification Cleared = " + cleared)
                                })
                            }, 5000)
                        })
                    }
            
                });
            }, 5500)
        }
        
        else{
    
            chrome.notifications.getPermissionLevel(function (level) {
                if (level === "granted") {
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
    });
    
}

function handleNotif() {

    chrome.permissions.request(
        {
            permissions: ["notifications"],
        },
        function (granted) {
            if(granted === true){
                document.getElementById("notifStatus").innerText = "Permission: Granted";
            }
            if(granted === false){
                document.getElementById("notifStatus").innerText = "Permission: Not Granted";
            }
        }
    );
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

function setTheme() {
    document.getElementById("optionHeader").className = "header-" + localStorage.options.theme;
    document.getElementById("optionDiv").className = "optionList-" + localStorage.options.theme;
    document.getElementById("desktopNotif").className = "optionItem-" + localStorage.options.theme;
    document.getElementById("themeOption").className = "optionItem-" + localStorage.options.theme;
    document.getElementById("setMike").className = "streamer-" + localStorage.options.theme + "-mike";
    document.getElementById("setLimes").className = "streamer-" + localStorage.options.theme + "-limes";
    document.getElementById("setRev").className = "streamer-" + localStorage.options.theme + "-rev";
    document.getElementById("setFred").className = "streamer-" + localStorage.options.theme + "-fred";
    document.getElementById("saveChanges").className = "optionItem-" + localStorage.options.theme;

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

document.getElementById("notifRequest").addEventListener("click", handleNotif);

document.addEventListener('DOMContentLoaded', loadOptions);

document.getElementById('save').addEventListener('click',
    saveOptions);