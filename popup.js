const options = {};

const jabroniStatus = { jabroniLive: false };
const testStatus = { testDev: false};

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes);
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (changes.key.newValue === true && changes.key === jabroniLive) {
      jabroniStatus.jabroniLive = true;
      document.getElementById("mikeStatus").className = "online";
      document.getElementById("mikeStatus").innerText = "online";
    }
    if (changes.key.newValue === false && changes.key === jabroniLive) {
      jabroniStatus.jabroniLive = false;
      document.getElementById("mikeStatus").className = "offline";
      document.getElementById("mikeStatus").innerText = "offline";
    }
    if (changes.key.newValue === true && changes.key === testDev) {
      testStatus.testDev = true;
      document.getElementById("testStatus").className = "online";
      document.getElementById("testStatus").innerText = "online";
    }
    if (changes.key.newValue === false && changes.key === testDev) {
      testStatus.testDev = false;
      document.getElementById("testStatus").className = "offline";
      document.getElementById("testStatus").innerText = "offline";
    }

    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.storage.sync.get("options", (data) => {
  Object.assign(options, data.options);
});
chrome.storage.sync.get("jabroniLive", (data) => {
  Object.assign(jabroniStatus, data.jabroniLive);
});
chrome.storage.sync.get("testDev", (data) => {
  Object.assign(testStatus, data.testDev);
});
