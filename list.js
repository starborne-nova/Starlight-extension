//Add Performance option that lets you adjust ping freq to 2-5 min
//Make server add new streamers on submit and throw up a loading screen or something until the server responds.

const localStorage = {};
const outAuth = "stealthystars";
const starCheck = "https://star-reactor.fly.dev/usercheck";
const starActivate = "https://star-reactor.fly.dev/userActivate"
const starUrl = "https://star-reactor.fly.dev/starpulse";
const list = []
var lastResponse;
const unsubscribed = []

const initStorageCache = getAllStorageSyncData()
    .then(items => {
        Object.assign(localStorage, items);
        console.log(localStorage);
        if (localStorage.code.enabled) {
            $("#saveList").hide()
            $("#addList").attr("hidden", false)
            $("#showStored").attr("hidden", false)
            for (let i = 0; i < Object.keys(localStorage.code.req).length; i++) {
                $("#storedList").append("<li id='stored" + i + "'>" + Object.keys(localStorage.code.req)[i] + "</li>")
            }
        }
    });

$("#searchSubmit").on("click", (e) => {
    const search = $("#searchBar").val()
    list.push(search)
    $("#streamerList").append("<li id='streamer" + list.length.toString() + "'>" + search + "</li>")
    $("#searchBar").val("")
})

$("#searchSend").on("click", (e) => {
    const compile = [];
    $("li[id*='streamer']").each(function (i) {
        compile.push($(this).text().toLowerCase())

    })
    validate(compile)
})

$("#saveList").on("click", (e) => {
    storeList()
})
$("#addList").on("click", (e) => {
    appendList()
})

async function validate(list) {
    const payload = {
        data: list
    }

    const response = await fetch(
        starCheck,
        {
            method: "POST",
            body: JSON.stringify(payload),
            mode: "cors",
            headers:
            {
                "Content-type": "application/json",
                "chrome": outAuth
            }
        }
    )

    if (response.status === 500 || response.status === 400) {
        // $("#codeResults").text("Invalid Code or Server Error")
        // setTimeout(function () {
        //     $("#codeResults").text("");
        // }, 2000);
        return
    }

    const converted = await response.json()
    console.log(converted.data)
    lastResponse = converted.data
    for (let i = 0; i < list.length; i++) {
        const streamers = converted.data
        var confirm = false;
        for (const streamer of streamers) {
            const nameCheck = streamer.name.toLowerCase()

            if (list[i] === nameCheck) {
                if (!streamer.subscribed) {
                    unsubscribed.push(streamer.name)
                }
                $("#streamer" + (i + 1).toString()).text(streamer.name + ": Confirmed. Subscribed: " + streamer.subscribed)
                confirm = true;
            }
        }
        if (!confirm) {
            $("#streamer" + (i + 1).toString()).text(list[i] + ": Invalid")
        }
    }

}

async function storeList() {

    try {
        if (unsubscribed.length > 0) {
            const payload = { data: unsubscribed }
            const retrieve = await fetch(
                starActivate,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                    mode: "cors",
                    headers:
                    {
                        "Content-type": "application/json",
                        "chrome": outAuth
                    }
                }
            )
            const response = await retrieve.json()
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].toLowerCase() === 'accepted%accepted%accepted') {
                    $("#requestSuccess").append("<li>Request " + i.toString() + ": Success</li>")
                }
                else {
                    $("#requestSuccess").append("<li>Request " + i.toString() + ": Error</li>")
                }
            }
        }
        const store = {}
        for (let i = 0; i < lastResponse.length; i++) {
            const key = lastResponse[i].name
            store[key] = "enabled"
        }
        Object.assign(localStorage.code.req, store)
        localStorage.code.enabled = true
        chrome.storage.sync.set(localStorage, () => {
            console.log(localStorage.code.req)
            console.log(localStorage.code.enabled)
            $("#requestSuccess").append("List Recorded. It may take up to 5 minutes for the extension data to update.")
        })
    }
    catch (e) {
        console.log(e)
        $("#requestSuccess").append("Something went wrong:" + e)
    }

}

async function appendList() {
    
        try {
            const payload = { data: unsubscribed }
            const retrieve = await fetch(
                starActivate,
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                    mode: "cors",
                    headers:
                    {
                        "Content-type": "application/json",
                        "chrome": outAuth
                    }
                }
            )
            const response = await retrieve.json()
            console.log(response)
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].toLowerCase() === 'accepted%accepted%accepted') {
                    $("#requestSuccess").append("<li>Request " + i.toString() + ": Success</li>")
                }
                else {
                    $("#requestSuccess").append("<li>Request " + i.toString() + ": Error</li>")
                }
            }

            const store = {}
            for (let i = 0; i < lastResponse.length; i++) {
                const key = lastResponse[i].name
                store[key] = "enabled"
            }
            Object.assign(localStorage.code.req, store)
            chrome.storage.sync.set(localStorage, () => {
                console.log(localStorage.code.req)
                console.log(localStorage.code.enabled)
            })
        }
        catch (e) {
            console.log(e)
            $("#requestSuccess").append("Something went wrong:" + e)
        }
    
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