const options = {}

chrome.storage.sync.get('options', (data) => {
    Object.assign(options, data.options);
  });

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if(key === jabroniLive && newValue === true){
        document.getElementById("jabroniMike").innerHTML = "Jabroni Mike: LIVE";
      }
      if(key === jabroniLive && newValue === false){
        document.getElementById("jabroniMike").innerHTML = "Jabroni Mike: OFFLINE";
      }
      if(key === testDev && newValue === true){
        document.getElementById("testDev").innerHTML = "TEST: LIVE";
      }
      if(key === testDev && newValue === false){
        document.getElementById("testDev").innerHTML = "TEST: OFFLINE";
      }
      
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  });