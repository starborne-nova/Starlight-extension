const localStorage = {};
const outAuth = "stealthystars";
const starUrl = "https://star-reactor.fly.dev/starpulse";

//border + shadow on boxes
//gradient on boxes?

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

function populateOptions() {
    chrome.storage.sync.get(null, (items) => {
        Object.assign(localStorage, items);
        console.log(items)
        var count = 1
        if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
        }
        else {

            Object.keys(items).forEach(item => {
                if (item != "options" && item != "code") {
                    if (count % 2 === 0) {
                        $("#firstCol").prepend("<div class='list-group-item m-3 optionsBoxBg header-text py-4 px-5'> <div class='position-absolute top-50 start-0 translate-middle'><button type='button' class='btn btn-danger btn-sm rounded-pill' id='" + item + "Delete'>X</button></div><div class=' d-flex align-items-center'><div class='flex-shrink-0'><img src=" + items[item].profile + " class='card-img border border-4'></div><div class='flex-grow-1 ms-3'><a href='https://www.twitch.tv/" + item.toLowerCase() + "' target='_blank'><h5 class='mb-1'>" + item + "</h5></a><small id='" + item + "Online'>Offline</small></div><div class='d-flex flex-column'><div class='form-check form-switch  mt-auto mb-2 me-auto'><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Notifs' checked><label class='form-check-label' for='" + item + "Notifs'>Notifications</label></div><div class='form-check form-switch mt-2 mb-auto me-auto'><label class='form-check-label' for='" + item + "Ticker'>Ticker Updates</label><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Ticker' checked></div></div></div></div>")
                        $("#" + item + "Delete").on("click", (event) => {
                            if ($(event.target).text() != "Delete") {
                                $(event.target).text("Delete")
                                return
                            }
                            removeOption(item)
                        })
                        count++
                    }
                    else if (count % 2 === 1) {
                        $("#secondCol").prepend("<div class='list-group-item m-3 optionsBoxBg header-text py-4 px-5'><div class='position-absolute top-50 start-0 translate-middle'><button type='button' class='btn btn-danger btn-sm rounded-pill' id='" + item + "Delete'>X</button></div><div class='d-flex align-items-center'><div class='flex-shrink-0'><img src=" + items[item].profile + " class='card-img border border-4'></div><div class='flex-grow-1 ms-3'><a href='https://www.twitch.tv/" + item.toLowerCase() + "' target='_blank'><h5 class='mb-1'>" + item + "</h5></a><small id='" + item + "Online'>Offline</small></div><div class='d-flex flex-column'><div class='form-check form-switch  mt-auto mb-2 me-auto'><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Notifs' checked><label class='form-check-label' for='" + item + "Notifs'>Notifications</label></div><div class='form-check form-switch mt-2 mb-auto me-auto'><label class='form-check-label' for='" + item + "Ticker'>Ticker Updates</label><input class='form-check-input' type='checkbox' role='switch' id='" + item + "Ticker' checked></div></div></div></div>")
                        $("#" + item + "Delete").on("click", (event) => {
                            if ($(event.target).text() != "Delete") {
                                $(event.target).text("Delete")
                                return
                            }
                            removeOption(item)
                        })
                        count++
                    }
                }
            })
        }
    })
}

function removeOption(name) {
    chrome.storage.sync.remove(name)
    chrome.storage.sync.remove([(name + "Notif"), (name + "Tick")])
    delete localStorage.code.req[name]
    delete localStorage.options[name + "Notif"]
    delete localStorage.options[name + "Tick"]
    delete localStorage[name]
    console.log(localStorage)
    chrome.storage.sync.set(localStorage, () => {
        chrome.storage.sync.get(null, (items) => {
            console.log(items)
            location.reload()
        })
    })
}

document.getElementById("testNotif").addEventListener("click", handleTestNotif);

document.getElementById("resetStorage").addEventListener("click", ()=>{
    chrome.runtime.sendMessage({message: "storageReset"}, (response)=>{
        console.log("message sent")
        console.log(response.message)
        location.reload()
    })
});

document.getElementById("update").addEventListener("click", ()=>{
    chrome.runtime.sendMessage({message: "starPulse"}, (response)=>{
            console.log("message sent")
            console.log(response.message)
        })
});

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