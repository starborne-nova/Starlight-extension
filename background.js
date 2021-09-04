const url = "https://jabroni-server.herokuapp.com/pulse";

var streamerID;
var badgeNumber = 0;

chrome.action.setBadgeBackgroundColor({ color: "#0a1f27" }, function () { console.log("background color changed") });
chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });

chrome.alarms.create("twitchPulse", {
    delayInMinutes: 1,
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        pulse();
    }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.jabroniLive === true) {
        badgeNumber++;
    };
    if (changes.jabroniLive === false) {
        badgeNumber--;
    };
    if (changes.testDev === true) {
        badgeNumber++;
    };
    if (changes.testDev === false) {
        badgeNumber--;
    };
    chrome.storage.sync.set({ badgeStatus: badgeNumber }, function () { console.log("badge number changed") });
    chrome.action.setBadgeText({ text: (toString(badgeNumber)) }, function () { console.log("badge text changed") });
});

function pulse() {
    fetch(
        url,
        {
            method: "POST",
            mode: "cors",
            headers:
            {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ streamer: "Jabroni Mike" })
        })

        .then(response => response.json())
        .then(data => {
            console.log(data)

            if (data === true) {
                chrome.storage.sync.set({ jabroniLive: true }, function () {
                    console.log("Mike is currently online");
                });
            }
            if (data === false) {
                chrome.storage.sync.set({ jabroniLive: false }, function () {
                    console.log("Mike is currently offline");
                });
            }
        })
        .then(fetch(
            url,
            {
                method: "post",
                mode: 'cors',
                headers:
                {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({ streamer: "TEST" })
            })
            .then(response => response.json())
            .then(data => {

                console.log(data);

                if (data === true) {
                    chrome.storage.sync.set({ testDev: true }, function () {
                        console.log("TEST is currently online");
                    });
                }
                if (data === false) {
                    chrome.storage.sync.set({ testDev: false }, function () {
                        console.log("TEST is currently offline");
                    })
                }
            }
            ))
}