var jabroniStatus;
var testStatus;


async function populate() {
  await chrome.storage.sync.get("jabroniLive", (data) => {
    jabroniStatus = toString(data.jabroniLive);
  })
    .then(
      chrome.storage.sync.get("testDev", (data) => {
        testStatus = toString(data.testDev);
      })
    )
    .then(
      document.getElementById("mikeStatus").innerText = jabroniStatus,
      document.getElementById("testStatus"), innerText = testStatus
    )
    .then(
      document.getElementById("mikeStatus").className = "online",
      document.getElementById("testStatus"), className = "online"
    )
    .catch(e)(
      console.log(e)
    );

}
