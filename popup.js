const localStorage = {};
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
  })
  .then(() => {
    if (!localStorage.options.vineNotif) {
      document.getElementById("joel").remove()
    }
  });

function populate() {

  if (localStorage.streamers.mike === true) {
    document.getElementById("mikeStatus").innerText = ((localStorage.activeGame.mikeGame.substring(0, 32)));
    document.getElementById("mikeStatus").className = "online";
    document.getElementById("ticker1").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    document.getElementById("jabroniMike").className = "streamItem-online";
    console.log("POPUP Mike Online")
  }

  if (localStorage.streamers.mike === false) {
    document.getElementById("mikeStatus").innerText = "OFFLINE";
    document.getElementById("mikeStatus").className = "offline";
    document.getElementById("ticker1").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    console.log("POPUP Mike Offline")
  }

  if (localStorage.streamers.limes === true) {
    document.getElementById("limeStatus").innerText = ((localStorage.activeGame.limesGame.substring(0, 32)));
    document.getElementById("limeStatus").className = "online";
    document.getElementById("ticker2").insertAdjacentText("beforeend", (localStorage.title.limesTitle.substring(0, 58)));
    document.getElementById("limes").className = "streamItem-online";
    console.log("POPUP Limes Online")
  }

  if (localStorage.streamers.limes === false) {
    document.getElementById("limeStatus").innerText = "OFFLINE";
    document.getElementById("limeStatus").className = "offline";
    document.getElementById("ticker2").insertAdjacentText("beforeend", (localStorage.title.limesTitle.substring(0, 58)));
    console.log("POPUP Limes Offline")
  }

  if (localStorage.streamers.rev === true) {
    document.getElementById("revStatus").innerText = ((localStorage.activeGame.revGame.substring(0, 32)));
    document.getElementById("revStatus").className = "online";
    if(localStorage.title.revTitle.indexOf("http") < 58){
      document.getElementById("ticker3").insertAdjacentText("beforeend", (localStorage.title.revTitle.substring(0, (localStorage.title.revTitle.indexOf("http")))));
    }
    else if(localStorage.title.revTitle.indexOf("http") === -1 || localStorage.title.revTitle.indexOf("http") >= 58){
      document.getElementById("ticker3").insertAdjacentText("beforeend", (localStorage.title.revTitle.substring(0, 58)));
    }
    document.getElementById("rev").className = "streamItem-online";
    console.log("POPUP Rev Online")
  }

  if (localStorage.streamers.rev === false) {
    document.getElementById("revStatus").innerText = "OFFLINE";
    document.getElementById("revStatus").className = "offline";
    if(localStorage.title.revTitle.indexOf("http") < 58){
      document.getElementById("ticker3").insertAdjacentText("beforeend", (localStorage.title.revTitle.substring(0, (localStorage.title.revTitle.indexOf("http")))));
    }
    else if(localStorage.title.revTitle.indexOf("http") === -1 || localStorage.title.revTitle.indexOf("http") >= 58){
      document.getElementById("ticker3").insertAdjacentText("beforeend", (localStorage.title.revTitle.substring(0, 58)));
    }
    console.log("POPUP Rev Offline")
  }

  if (localStorage.streamers.fred === true) {
    document.getElementById("fredStatus").innerText = ((localStorage.activeGame.fredGame.substring(0, 32)));
    document.getElementById("fredStatus").className = "online";
    document.getElementById("ticker4").insertAdjacentText("beforeend", (localStorage.title.fredTitle.substring(0, 58)));
    document.getElementById("fred").className = "streamItem-online";
    console.log("POPUP Fred Online")
  }

  if (localStorage.streamers.fred === false) {
    document.getElementById("fredStatus").innerText = "OFFLINE";
    document.getElementById("fredStatus").className = "offline";
    document.getElementById("ticker4").insertAdjacentText("beforeend", (localStorage.title.fredTitle.substring(0, 58)));
    console.log("POPUP Fred Offline")
  }

  if (localStorage.streamers.vine === true) {
    document.getElementById("vineStatus").innerText = ((localStorage.activeGame.vineGame.substring(0, 32)));
    document.getElementById("vineStatus").className = "online";
    document.getElementById("ticker5").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    document.getElementById("vine").className = "streamItem-online";
    console.log("POPUP Vine Online")
  }

  if (localStorage.streamers.vine === false) {
    document.getElementById("vineStatus").innerText = "OFFLINE";
    document.getElementById("vineStatus").className = "offline";
    document.getElementById("ticker5").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    console.log("POPUP vine Offline")
  }

  if (localStorage.streamers.joel === true) {
    document.getElementById("joelStatus").innerText = ((localStorage.activeGame.joelGame.substring(0, 32)));
    document.getElementById("joelStatus").className = "online";
    document.getElementById("ticker6").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    document.getElementById("joel").className = "streamItem-online";
    console.log("POPUP Joel Online")
  }

  if (localStorage.streamers.joel === false) {
    document.getElementById("joelStatus").innerText = "OFFLINE";
    document.getElementById("joelStatus").className = "offline";
    document.getElementById("ticker6").insertAdjacentText("beforeend", (localStorage.title.mikeTitle.substring(0, 58)));
    console.log("POPUP Joel Offline")
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

document.getElementById("item1").addEventListener("mouseenter", function(event){
  document.getElementById("ticker1").classList.remove("hide");
})
document.getElementById("item2").addEventListener("mouseenter", function(event){
  document.getElementById("ticker2").classList.remove("hide");
})
document.getElementById("item3").addEventListener("mouseenter", function(event){
  document.getElementById("ticker3").classList.remove("hide");
})
document.getElementById("item4").addEventListener("mouseenter", function(event){
  document.getElementById("ticker4").classList.remove("hide");
})
document.getElementById("item5").addEventListener("mouseenter", function(event){
  document.getElementById("ticker5").classList.remove("hide");
})
document.getElementById("item6").addEventListener("mouseenter", function(event){
  document.getElementById("ticker6").classList.remove("hide");
})

