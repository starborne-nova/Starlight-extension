const localStorage = {};
const outAuth = "stealthystars";
const url = "https://star-reactor.fly.dev/pulse";

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        Object.assign(localStorage, items);
        console.log(localStorage);
    });

function populateStorage() {
    chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {
            // Object.entries()
            Object.keys(items).forEach((item) => {
                $("#storageList").append("<li class='list-group-item list-group-item-dark d-flex justify-content-between align-items-start'><div class='ms-2 me-auto'><div class='fw-bold' id='" + item + "Sub'>" + item + "</div></div></li>")
                Object.keys(items[item]).forEach((subKey) => {
                    if (item === "options") {
                        $("#optionsToolList").append("<li class='list-group-item list-group-item-dark'><div class='form-check'><input class='form-check-input' type='checkbox' value='" + subKey +"' id='" + subKey + "Tool'><label class='form-check-label' for='" + subKey + "Tool'>" + subKey + "</label></div></li>")
                    }

                    $("#" + item + "Sub").after("<h6>" + subKey + ": " + items[item][subKey] + "</h6>")

                })
                if (item === "code") {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "ResetFire' type='button' class='btn btn-warning'>Reset</button><button id='" + item + "Delete' type='button' class='btn btn-danger dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>Delete</button><ul class='dropdown-menu bg-dark' aria-labelledby='btnGroupDrop1'><li><a class='dropdown-item text-light' id='" + item + "DeleteFire' href='#'>Are you sure?</a></li></ul></div>")
                    $("#" + item + "DeleteFire").on("click", (e) => {
                        chrome.storage.sync.remove(item)
                        location.reload();
                    })
                    $("#" + item + "ResetFire").on("click", (e) => {
                        const reset = {
                            code: {
                                userID: "",
                                req: {},
                                generated: "",
                                enabled: false
                            }
                        }
                        chrome.storage.sync.set(reset)
                        location.reload();
                    })
                }
                if (item === "options") {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "ResetFire' type='button' class='btn btn-warning' data-bs-toggle='modal' data-bs-target='#optionsTool'>Open Options Tool</button></div>")
                }
                else {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "Delete' type='button' class='btn btn-danger dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>Delete</button><ul class='dropdown-menu bg-dark' aria-labelledby='btnGroupDrop1'><li><a class='dropdown-item text-light' id='" + item + "DeleteFire' href='#'>Are you sure?</a></li></ul></div>")
                    $("#" + item + "DeleteFire").on("click", (e) => {
                        chrome.storage.sync.remove(item)
                        location.reload();
                    })
                }

            })

        }
    })
}

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

async function optionsSubmit() {    
            $("input[id*='Tool']").each((i, e)=>{
                const elemValue = e.value
                console.log(e.value.toString())
                if(e.checked === true && e.value != "theme"){
                   delete localStorage.options[elemValue]
                }
            })          
                console.log(localStorage)
                chrome.storage.sync.set(localStorage);            
    }
    
$("#optionsToolSubmit").on("click", e=>{
    optionsSubmit();
})

document.addEventListener('DOMContentLoaded', populateStorage);

document.getElementById("resetStorage").addEventListener("click", storageReset);

document.getElementById("auditStorage").addEventListener("click", storageAudit);

function storageReset() {   
    chrome.storage.sync.clear(()=>{
        installStorage();
    })   
}

function storageAudit() {
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
            console.log("AUDIT: Begin streamer audit")
            Object.assign(localStorage, data[0])
            Object.keys(localStorage).forEach(prop =>{
                if(!data[0].hasOwnProperty(prop) && prop != "options"){
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
                if(prop != "options" && localStorage.options[prop + "Notif"] === undefined){
                    localStorage.options[prop + "Notif"] = true;
                    localStorage.options[prop + "Tick"] = true;
                    console.log("AUDIT: Options for " + prop + " added")
                }
            })
            if(localStorage.code === undefined){
                const codeBlock = {
                    code:{
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

        .then(() =>{
            setBadge();
        })
        .catch(e => { console.log(e) })

}

function installStorage() {
    const fresh = {}
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
            Object.assign(fresh, data[0])
            chrome.storage.sync.set(fresh, () => {
                console.log("INSTALL PULSE: Data updated")
            })
        })
        .then(() => {
            const storage = {
                options: {
                    theme: "star"
                },
                code:{
                    generated: "",
                    userID: "",
                    req: {},
                    enabled: false
                }
            }
            Object.keys(fresh).forEach(prop => {
                if(prop != "options"){
                    storage.options[prop + "Notif"] = true;
                    storage.options[prop + "Tick"] = true;
                }
            })
            Object.assign(fresh, storage)
        })
        .then(() => {
            chrome.storage.sync.set(fresh, () => {
                console.log("INSTALL OPTIONS BLOCK INITIALIZED")
            })
        })
        .then(()=>{
            setBadge();
        })
        .catch(e => { console.log(e) })

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