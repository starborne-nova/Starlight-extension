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
                    badgeNumber++;
                    chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });

                });
            }
            if (data === false) {
                chrome.storage.sync.set({ jabroniLive: false }, function () {
                    console.log("Mike is currently offline");
                    if (chrome.storage.sync.get(["testDev"], function (result) { return result.testDev }) === false) {
                        badgeNumber = 0;
                        chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });
                    }
                    if (chrome.storage.sync.get(["testDev"], function (result) { return result.testDev }) === true) {
                        badgeNumber = 1;
                        chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
                    }
                });
            }
            else {
                console.log("Unknown Response Recieved")
            }

        }
        )
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
                        badgeNumber++;
                        if (badgeNumber === 0) {
                            chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
                        }
                        if (badgeNumber === 1) {
                            chrome.action.setBadgeText({ text: "2" }, function () { console.log("badge text changed") });
                        }
                    });
                }
                if (data === false) {
                    chrome.storage.sync.set({ testDev: false }, function () {
                        console.log("TEST is currently offline");
                        if (chrome.storage.sync.get(["jabroniLive"], function (result) { return result.testDev }) === false) {
                            badgeNumber = 0;
                            chrome.action.setBadgeText({ text: "0" }, function () { console.log("badge text changed") });
                        }
                        if (chrome.storage.sync.get(["jabroniLive"], function (result) { return result.testDev }) === true) {
                            badgeNumber = 1;
                            chrome.action.setBadgeText({ text: "1" }, function () { console.log("badge text changed") });
                        }
                    });
                }
                else {
                    console.log("Unknown Response Recieved");
                }

            }
            ))
}