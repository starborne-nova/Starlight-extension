const streamerStatus = {
  theme: "",
  jabroni: false,
  limes: false,
  vineRev: false,
  mike: true,
  rev: true,
  lime: true
};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData()
  .then(items => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(streamerStatus, items)
    console.log(items)
  })
  .then(() => {
    populate();
    setTheme();
  })
  .then(() => {
    if (!streamerStatus.lime) {
      document.getElementById("limes").remove()
    }
  })
  .then(() => {
    if (!streamerStatus.rev) {
      document.getElementById("rev").remove()
    }
  })
  .then(() => {
    if (!streamerStatus.mike) {
      document.getElementById("jabroniMike").remove()
    }
  });

function populate() {

  if (streamerStatus.jabroni === true) {
    document.getElementById("mikeStatus").innerText = "ONLINE";
    document.getElementById("mikeStatus").className = "online";
    console.log("POPUP Mike Online")
  }

  if (streamerStatus.jabroni === false) {
    document.getElementById("mikeStatus").innerText = "OFFLINE";
    document.getElementById("mikeStatus").className = "offline";
    console.log("POPUP Mike Offline")
  }

  if (streamerStatus.limes === true) {
    document.getElementById("limeStatus").innerText = "ONLINE";
    document.getElementById("limeStatus").className = "online";
    console.log("POPUP Limes Online")
  }

  if (streamerStatus.limes === false) {
    document.getElementById("limeStatus").innerText = "OFFLINE";
    document.getElementById("limeStatus").className = "offline";
    console.log("POPUP Limes Offline")
  }
  if (streamerStatus.vineRev === true) {
    document.getElementById("revStatus").innerText = "ONLINE";
    document.getElementById("revStatus").className = "online";
    console.log("POPUP Rev Online")
  }

  if (streamerStatus.vineRev === false) {
    document.getElementById("revStatus").innerText = "OFFLINE";
    document.getElementById("revStatus").className = "offline";
    console.log("POPUP Rev Offline")
  }
}

function setTheme() {
  document.getElementById("popHeader").className = "header-" + streamerStatus.theme;
  document.getElementById("jabroniMike").className = "streamItem-" + streamerStatus.theme;
  document.getElementById("limes").className = "streamItem-" + streamerStatus.theme;
  document.getElementById("rev").className = "streamItem-" + streamerStatus.theme;
  document.getElementById("options").className = "options-" + streamerStatus.theme;
}

function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(["theme", "jabroni", "limes", "vineRev", "rev", "mike", "lime"], (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

