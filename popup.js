const streamerStatus = {
  jabroniLive: false,
  testDev: false,
  vineRev: false,
  mike: true,
  rev: true,
  TEST: true
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
  })
  .then(() => {
    if (!streamerStatus.TEST) {
      document.getElementById("testDev").remove()
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

  if (streamerStatus.jabroniLive === true) {
    document.getElementById("mikeStatus").innerText = "ONLINE";
    document.getElementById("mikeStatus").className = "online";
    console.log("POPUP Mike Online")
  }

  if (streamerStatus.jabroniLive === false) {
    document.getElementById("mikeStatus").innerText = "OFFLINE";
    document.getElementById("mikeStatus").className = "offline";
    console.log("POPUP Mike Offline")
  }

  if (streamerStatus.testDev === true) {
    document.getElementById("testStatus").innerText = "ONLINE";
    document.getElementById("testStatus").className = "online";
    console.log("POPUP TEST Online")
  }

  if (streamerStatus.testDev === false) {
    document.getElementById("testStatus").innerText = "OFFLINE";
    document.getElementById("testStatus").className = "offline";
    console.log("POPUP TEST Offline")
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



function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(["jabroniLive", "testDev", "vineRev", "rev", "mike", "TEST"], (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

