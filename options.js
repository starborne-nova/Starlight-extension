const localStorage = {};
const outAuth = "stealthystars";
const url = "https://star-reactor.fly.dev/pulse";
const starUrl = "https://star-reactor.fly.dev/starpulse";

//border + shadow on boxes
//gradient on boxes?

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        Object.assign(localStorage, items);
        console.log(localStorage);
    });

const notifOptions = {
    type: "basic",
    title: "Starlight",
    message: "This is a test!",
    iconUrl: "./images/icon48.png",
    buttons: [{ title: "Open Twitch" }],
    eventTime: Date.now()
}

function saveOptions() {

    Object.keys(localStorage).forEach(prop => {
        if ($("#" + prop + "Notifs").prop("checked") != undefined) {
            localStorage.options[prop + "Notif"] = $("#" + prop + "Notifs").prop("checked")
            localStorage.options[prop + "Tick"] = $("#" + prop + "Ticker").prop("checked")
        }
    })

    localStorage.options.theme = $("#setTheme").prop("value");

    console.log(localStorage.options)

    chrome.storage.sync.set(localStorage, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
        loadOptions();
        setBadge();
    });
}

function loadOptions() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            Object.keys(items).forEach(prop => {
                if ($("#" + prop + "Notifs").prop("checked") != undefined) {
                    $("#" + prop + "Notifs").prop("checked", items.options[prop + "Notif"])
                    $("#" + prop + "Ticker").prop("checked", items.options[prop + "Tick"])
                }
            })
            document.body.setAttribute("data-theme", items.options.theme);
            $("#setTheme").prop("value", items.options.theme);
            if (items.code.enabled === true) {
                $("#codeInput").prop("disabled", true)
                $("#codeSend").prop("disabled", true)
                $("#codeUpdate").prop("disabled", false)
                $("#codeSend2").prop("disabled", false)
                $("#codeAddition").prop("disabled", false)
                $("#codeSend3").prop("disabled", false)
                $("#existingCode").text(items.code.generated)
            }
        }
    });
}

function loadOnline() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            Object.keys(items).forEach(prop => {
                if (items[prop].status === true && items[prop].status != undefined) {
                    $("#" + prop + "Online").text("LIVE")
                }
            })
        }
    })
}

function handleTestNotif() {
    chrome.notifications.getAll((notifications) => {
        if (Object.keys(notifications).length === 0) {
            chrome.notifications.create("testNote", notifOptions, function (id) {
                chrome.notifications.onButtonClicked.addListener(() => {
                    window.open("https://twitch.tv")
                })
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

function populateOptions() {
    chrome.storage.sync.get(null, (items) => {
        var count = 1
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {

            Object.keys(items).forEach(item => {
                if (item != "options" && item != "code") {
                    if (count % 2 === 0) {
                        $("#firstCol").prepend("<div class='list-group-item m-3 optionsBoxBg header-text py-4 px-5'><div class=' d-flex align-items-center'><div class='flex-shrink-0'><img src=" + items[item].profile + " class='card-img border border-4'></div><div class='flex-grow-1 ms-3'><a href='https://www.twitch.tv/" + item.toLowerCase() + "' target='_blank'><h5 class='mb-1'>" + item + "</h5></a><small id='" + item + "Online'>Offline</small></div><div class='d-flex flex-column'><div class='form-check form-switch  mt-auto mb-2 me-auto'><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Notifs' checked><label class='form-check-label' for='" + item + "Notifs'>Notifications</label></div><div class='form-check form-switch mt-2 mb-auto me-auto'><label class='form-check-label' for='" + item + "Ticker'>Ticker Updates</label><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Ticker' checked></div></div></div></div>")
                        count++
                    }
                    else if (count % 2 === 1) {
                        $("#secondCol").prepend("<div class='list-group-item m-3 optionsBoxBg header-text py-4 px-5'><div class='d-flex align-items-center'><div class='flex-shrink-0'><img src=" + items[item].profile + " class='card-img border border-4'></div><div class='flex-grow-1 ms-3'><a href='https://www.twitch.tv/" + item.toLowerCase() + "' target='_blank'><h5 class='mb-1'>" + item + "</h5></a><small id='" + item + "Online'>Offline</small></div><div class='d-flex flex-column'><div class='form-check form-switch  mt-auto mb-2 me-auto'><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Notifs' checked><label class='form-check-label' for='" + item + "Notifs'>Notifications</label></div><div class='form-check form-switch mt-2 mb-auto me-auto'><label class='form-check-label' for='" + item + "Ticker'>Ticker Updates</label><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Ticker' checked></div></div></div></div>")
                        count++
                    }
                }
            })
        }
    })
}

function storageReset() {
    chrome.storage.sync.clear(() => {
        installStorage();
    })
}

async function storageAudit() {
    try {
        const loadData = await getAllStorageSyncData()
        const writeOp = await Object.assign(localStorage, loadData)
        if (localStorage.code.enabled) {
            const sendPulse = await starPulse()
        }
        else {
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
        return new Promise((resolve, reject) => {
            resolve(chrome.storage.sync.set(localStorage, () => {
                console.log("AUDIT: Operation complete")
                setBadge();
            }))
        })
    }
    catch (e) {
        console.log(e)
    }
}

async function installStorage() {
    try {
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
        return new Promise((resolve, reject) => {
            resolve(chrome.storage.sync.set(fresh, () => {
                console.log("INSTALL OPTIONS BLOCK INITIALIZED")
                setBadge()
            }))
        })
    }
    catch (e) {
        console.log(e)
    }
}

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

async function parseCode(code) {
    try{
    const unparsed = code;
    localStorage.code.generated = unparsed;
    const codePayload = {}
    const reqObject = {}
    unparsed.split("%").forEach(id => {
        let insert = {
            [id]: "enabled"
        }
        Object.assign(codePayload, insert)
    });
    console.log(codePayload);

    const incData = await fetch(
        "https://star-reactor.fly.dev/starpulse/init",
        {
            method: "POST",
            body: JSON.stringify(codePayload),
            mode: "cors",
            headers:
            {
                "Content-type": "application/json",
                "chrome": outAuth
            },
        })

    if (incData.status === 500 || incData.status === 400) {
        $("#codeResults").text("Invalid Code or Server Error")
        setTimeout(function () {
            $("#codeResults").text("");
        }, 2000);
        return
    }

    const converted = await incData.json()
    const serverCode = await converted.converted;

    serverCode.forEach(name => {
        let insert = {
            [name]: "enabled"
        }
        Object.assign(reqObject, insert)
    })
    Object.assign(localStorage.code.req, reqObject)
    localStorage.code.enabled = true
    console.log("OPTIONS: Request code saved. Enabling StarPulse")
    $("#codeResults").text("Code accepted")
    setTimeout(function () {
        $("#codeResults").text("");
    }, 2000);
    chrome.storage.sync.set(localStorage, () => {
        console.log(localStorage.code)
        starPulse()
        loadOptions()
    })
    }catch(e){
        console.log(e)
    }
}

async function additionCode(code) {
    try{
        const unparsed = localStorage.code.generated + "%" + code;
        localStorage.code.generated = unparsed;
        const codePayload = {}
        const reqObject = {}
        unparsed.split("%").forEach(id => {
            let insert = {
                [id]: "enabled"
            }
            Object.assign(codePayload, insert)
        });
        console.log(codePayload);
    
        const incData = await fetch(
            "https://star-reactor.fly.dev/starpulse/init",
            {
                method: "POST",
                body: JSON.stringify(codePayload),
                mode: "cors",
                headers:
                {
                    "Content-type": "application/json",
                    "chrome": outAuth
                },
            })
    
        if (incData.status === 500 || incData.status === 400) {
            $("#codeResults").text("Invalid Code or Server Error")
            setTimeout(function () {
                $("#codeResults").text("");
            }, 2000);
            return
        }
    
        const converted = await incData.json()
        const serverCode = await converted.converted;
    
        serverCode.forEach(name => {
            let insert = {
                [name]: "enabled"
            }
            Object.assign(reqObject, insert)
        })
        Object.assign(localStorage.code.req, reqObject)
        localStorage.code.enabled = true
        console.log("OPTIONS: Request code saved. Enabling StarPulse")
        $("#codeResults").text("Code accepted")
        setTimeout(function () {
            $("#codeResults").text("");
        }, 2000);
        chrome.storage.sync.set(localStorage, () => {
            console.log(localStorage.code)
            starPulse()
            loadOptions()
        })
        }catch(e){
            console.log(e)
        }
}

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

$("#codeSend").on("click", function (e) {
    const codeInput = $("#codeInput").val();
    parseCode(codeInput);
});

$("#codeSend2").on("click", function (e) {
    const codeUpdate = $("#codeUpdate").val();
    parseCode(codeUpdate);
});

$("#codeSend3").on("click", function (e) {
    const codeAddition = $("#codeAddition").val();
    additionCode(codeAddition);
});

document.getElementById("testNotif").addEventListener("click", handleTestNotif);

document.getElementById("resetStorage").addEventListener("click", storageReset);

document.getElementById("auditStorage").addEventListener("click", storageAudit);

document.addEventListener('DOMContentLoaded', populateOptions);

document.addEventListener('DOMContentLoaded', loadOptions);

document.addEventListener('DOMContentLoaded', loadOnline, { once: true });

document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
        $('#debug').removeAttr('style')
    }
})

document.getElementById('save').addEventListener('click',
    saveOptions);