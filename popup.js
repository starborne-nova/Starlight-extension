const streamerStatus = {
  theme: "purple",
  jabroni: false,
  jabroniGame: "",
  mike: true,
  limes: false,
  limesGame: "",
  lime: true,
  vineRev: false,
  revGame: "",
  rev: true
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
    document.getElementById("mikeStatus").innerText = ("ONLINE: " + (streamerStatus.jabroniGame.substring(0, 25)));
    document.getElementById("mikeStatus").className = "online";
    document.getElementById("mikeIcon").className = "status-icon-on";
    document.getElementById("mikeIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Mike Online")
  }

  if (streamerStatus.jabroni === false) {
    document.getElementById("mikeStatus").innerText = "OFFLINE";
    document.getElementById("mikeStatus").className = "offline";
    console.log("POPUP Mike Offline")
  }

  if (streamerStatus.limes === true) {
    document.getElementById("limeStatus").innerText = ("ONLINE: " + (streamerStatus.limesGame.substring(0, 25)));
    document.getElementById("limeStatus").className = "online";
    document.getElementById("limesIcon").className = "status-icon-on";
    document.getElementById("limesIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Limes Online")
  }

  if (streamerStatus.limes === false) {
    document.getElementById("limeStatus").innerText = "OFFLINE";
    document.getElementById("limeStatus").className = "offline";
    console.log("POPUP Limes Offline")
  }
  if (streamerStatus.vineRev === true) {
    document.getElementById("revStatus").innerText = ("ONLINE: " + (streamerStatus.revGame.substring(0, 25)));
    document.getElementById("revStatus").className = "online";
    document.getElementById("revIcon").className = "status-icon-on";
    document.getElementById("revIcon").innerHTML = "<i class='fas fa-wifi'></i>";
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
    chrome.storage.sync.get(["theme", "jabroni", "limes", "vineRev", "rev", "mike", "lime", "jabroniGame", "revGame", "limesGame"], (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

