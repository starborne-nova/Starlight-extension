const localStorage = {};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData()
  .then(items => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(localStorage, items)
  })
  .then(() => {
    console.log(localStorage)
    populate();
  });

function populate() {
  document.body.setAttribute("data-theme", localStorage.options.theme);
  var counter = 1;
  Object.keys(localStorage).forEach(prop => { 
    const item = "item" + counter.toString();
    const ticker = "ticker" + counter.toString();

    if (prop != "options" && prop != "PlasmaWalrus"){
      if(localStorage.options[prop + "Notif"] === true){
        $("<div class='streamItem' id='" + prop + "'><a href='https://www.twitch.tv/" + prop.toLowerCase() + "' target='_blank'><ul><li id='" + item + "'><h3 class='streamer'>" + prop + "</h3><h4 class='offline' id='" + prop + "Status'>OFFLINE</h4></li><li><h4 class='ticker hide' id='" + ticker + "'>Ticker: </h4></li></ul></a></div>").insertAfter("#popHeader")
      }
      if(localStorage[prop].status){
        $("#" + prop + "Status").text((localStorage[prop].game.substring(0, 32))).attr("class", "online")
        $("#" + prop).attr("class", "streamItem-online")
      }
      if(localStorage[prop].ticker.indexOf("http") < 55){
        $("#" + ticker).text((localStorage[prop].ticker.substring(0, (localStorage[prop].ticker.indexOf("http")))))
      }
      if(localStorage[prop].ticker.indexOf("http") === -1 || localStorage[prop].ticker.indexOf("http") >= 55){
        $("#" + ticker).text((localStorage[prop].ticker.substring(0, 55)))
      }
      $("#" + item).mouseenter(function(){
        $("#" + ticker).removeClass("hide");
      })
      counter++;

    }
})
}

function getAllStorageSyncData() {
  
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {   
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}