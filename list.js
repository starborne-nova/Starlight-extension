//Add Performance option that lets you adjust ping freq to 2-5 min

const localStorage = {};
const outAuth = "stealthystars";
const starCheck = "https://star-reactor.fly.dev/usercheck";
const starActivate = "https://star-reactor.fly.dev/userActivate"
const starUrl = "https://star-reactor.fly.dev/starpulse";
const list = []
var lastResponse;
const unsubscribed = []

const initStorageCache = loadData()
    

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

$("#addList").on("click", async function (e) {
    const exec = await appendList()
    return exec
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
        $("#requestSuccess").text("Invalid Code or Server Error")
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
                $("#modalResults").append("<span class='badge rounded-pill text-bg-success'>" + i.toString() + "</span>")
            }
            else {
                $("#requestSuccess").append("<li>Request " + i.toString() + ": Error</li>")
                $("#modalResults").append("<span class='badge rounded-pill text-bg-danger'>" + i.toString() + "</span>")
            }
        }
        $("#modalProgress").hide()
        $("#modalWaiting").hide()
        $("#modalSuccess").attr("hidden", false)

        const store = {}
        for (let i = 0; i < lastResponse.length; i++) {
            const key = lastResponse[i].name
            store[key] = "enabled"
        }
        Object.assign(localStorage.code.req, store)
        chrome.storage.sync.set(localStorage, () => {
            console.log(localStorage.code.req)
            $("#requestSuccess").append("List Recorded. Data will update shortly")
        })

        return await chrome.runtime.sendMessage({ message: "starPulse" }, (response) => {
            console.log("message sent")
            console.log(response.message)
        })
    }
    catch (e) {
        console.log(e)
        $("#requestSuccess").append("Something went wrong:" + e)
    }

}

async function loadData() {
    const items = await chrome.storage.sync.get()
    Object.assign(localStorage, items);
    console.log(localStorage);
    for (let i = 0; i < Object.keys(localStorage.code.req).length; i++) {
        $("#storedList").append("<span class='badge bg-primary m-1'>" + Object.keys(localStorage.code.req)[i] + "</span>")
    }
    return items;
}