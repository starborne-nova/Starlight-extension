const url = "https://jabroni-server.herokuapp.com/pulse";

var streamerID;

chrome.action.setBadgeBackgroundColor({ color: "#0a1f27"}, function() { console.log("background color changed") });
chrome.action.setBadgeText({ text: "123"}, function() { console.log("badge text changed")  });

chrome.alarms.create("twitchPulse", {
    delayInMinutes: 5,
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "twitchPulse") {
        pulse();
    }
});

function pulse() {
    fetch(
        url,
        {
            method: "post",
            mode: "cors",
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: { "streamer": "Jabroni Mike" }
        }
    )
        .then(response => {
            console.log(response)

            if (response.body === true) {
                chrome.storage.sync.set({ jabroniLive: true }, function () {
                    console.log("Mike is currently online");
                });
            }
            if (response.body === false) {
                chrome.storage.sync.set({ jabroniLive: false }, function () {
                    console.log("Mike is currently offline");
                });
            }
            else {
                console.log("Unknown Response Recieved")
            }

        }
        )
    fetch(
        url,
        {
            method: "post",
            mode: 'cors',
            headers:
            {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: { "streamer": "TEST" }
        }
    )
        .then(response => {
            console.log(response)

            if (response.body === true) {
                chrome.storage.sync.set({ testDev: true }, function () {
                    console.log("TEST is currently online");
                });
            }
            if (response.body === false) {
                chrome.storage.sync.set({ testDev: false }, function () {
                    console.log("TEST is currently offline");
                });
            }
            else {
                console.log("Unknown Response Recieved")
            }

        }
        )
}