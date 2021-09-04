var jabroniStatus;
var testStatus;


async function populate() {

  var v;
  var v1;
  try {

    v = await chrome.storage.sync.get("jabroniLive", (data) => { jabroniStatus = data.jabroniLive; return jabroniStatus })
    v1 = await chrome.storage.sync.get("testDev", (data) => { testStatus = data.testDev; return testStatus; })
    if (v === true) {
      document.getElementById("mikeStatus").innerText = "ONLINE";
      document.getElementById("mikeStatus").className = "online"

    }
    if (v1 === true) {
      document.getElementById("testStatus").innerText = "ONLINE"
      document.getElementById("testStatus").className = "online"

    }
  }

  catch (e) {
    console.log(e)
  }
  return 1;

}

var result = populate();
console.log(result)
