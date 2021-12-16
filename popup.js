const localStorage = {
  streamers: {
    mike: false,
    limes: false,
    rev: false,
    fred: false,
    vine: false
},
activeGame: {
    mikeGame: "",
    limesGame: "",
    revGame: "",
    fredGame: "",
    vineGame: ""
},
options: {
    mikeNotif: true,
    limesNotif: true,
    revNotif: true,
    fredNotif: true,
    vineNotif: false,
    theme: "purple",
}
};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData()
  .then(items => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(localStorage, items)
    console.log(items)
  })
  .then(() => {
    populate();
    document.body.setAttribute("data-theme", localStorage.options.theme);
  })
  .then(() => {
    if (!localStorage.options.limesNotif) {
      document.getElementById("limes").remove()
    }
  })
  .then(() => {
    if (!localStorage.options.revNotif) {
      document.getElementById("rev").remove()
    }
  })
  .then(() => {
    if (!localStorage.options.mikeNotif) {
      document.getElementById("jabroniMike").remove()
    }
  })
  .then(() => {
    if (!localStorage.options.fredNotif) {
      document.getElementById("fred").remove()
    }
  })
  .then(() => {
    if (!localStorage.options.vineNotif) {
      document.getElementById("vine").remove()
    }
  });

function populate() {

  if (localStorage.streamers.mike === true) {
    document.getElementById("mikeStatus").innerText = ((localStorage.activeGame.mikeGame.substring(0, 32)));
    document.getElementById("mikeStatus").className = "online";
    document.getElementById("jabroniMike").className = "streamItem-online";
    document.getElementById("mikeIcon").className = "status-icon-on";
    document.getElementById("mikeIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Mike Online")
  }

  if (localStorage.streamers.mike === false) {
    document.getElementById("mikeStatus").innerText = "OFFLINE";
    document.getElementById("mikeStatus").className = "offline";
    console.log("POPUP Mike Offline")
  }

  if (localStorage.streamers.limes === true) {
    document.getElementById("limeStatus").innerText = ((localStorage.activeGame.limesGame.substring(0, 32)));
    document.getElementById("limeStatus").className = "online";
    document.getElementById("limes").className = "streamItem-online";
    document.getElementById("limesIcon").className = "status-icon-on";
    document.getElementById("limesIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Limes Online")
  }

  if (localStorage.streamers.limes === false) {
    document.getElementById("limeStatus").innerText = "OFFLINE";
    document.getElementById("limeStatus").className = "offline";
    console.log("POPUP Limes Offline")
  }

  if (localStorage.streamers.rev === true) {
    document.getElementById("revStatus").innerText = ((localStorage.activeGame.revGame.substring(0, 32)));
    document.getElementById("revStatus").className = "online";
    document.getElementById("rev").className = "streamItem-online";
    document.getElementById("revIcon").className = "status-icon-on";
    document.getElementById("revIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Rev Online")
  }

  if (localStorage.streamers.rev === false) {
    document.getElementById("revStatus").innerText = "OFFLINE";
    document.getElementById("revStatus").className = "offline";
    console.log("POPUP Rev Offline")
  }

  if (localStorage.streamers.fred === true) {
    document.getElementById("fredStatus").innerText = ((localStorage.activeGame.fredGame.substring(0, 32)));
    document.getElementById("fredStatus").className = "online";
    document.getElementById("fred").className = "streamItem-online";
    document.getElementById("fredIcon").className = "status-icon-on";
    document.getElementById("fredIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Fred Online")
  }

  if (localStorage.streamers.fred === false) {
    document.getElementById("fredStatus").innerText = "OFFLINE";
    document.getElementById("fredStatus").className = "offline";
    console.log("POPUP Fred Offline")
  }

  if (localStorage.streamers.vine === true) {
    document.getElementById("vineStatus").innerText = ((localStorage.activeGame.vineGame.substring(0, 32)));
    document.getElementById("vineStatus").className = "online";
    document.getElementById("vine").className = "streamItem-online";
    document.getElementById("vineIcon").className = "status-icon-on";
    document.getElementById("vineIcon").innerHTML = "<i class='fas fa-wifi'></i>";
    console.log("POPUP Vine Online")
  }

  if (localStorage.streamers.vine === false) {
    document.getElementById("vineStatus").innerText = "OFFLINE";
    document.getElementById("vineStatus").className = "offline";
    console.log("POPUP Vine Offline")
  }
}

function getAllStorageSyncData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

