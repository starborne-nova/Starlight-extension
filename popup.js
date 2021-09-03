const options = {}

chrome.storage.sync.get('options', (data) => {
  Object.assign(options, data.options);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === jabroniLive && newValue === true) {
      document.getElementById("mikeStatus").className = "online";
    }
    if (key === jabroniLive && newValue === false) {
      document.getElementById("jabroniMike").className = "offline";
    }
    if (key === testDev && newValue === true) {
      document.getElementById("testStatus").className = "online";
    }
    if (key === testDev && newValue === false) {
      document.getElementById("testStatus").className = "offline";
    }

    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});