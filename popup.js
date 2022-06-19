const initPopup = populate();



function populate() {
  chrome.storage.sync.get(null, (items) => {
    var pageTotal = Math.ceil(((Object.keys(items).length - 2)/6))
    for(let i = 2; i <= pageTotal; i++){
      $("#page" + ((i - 1).toString())).after("<div id='page" + i.toString() + "' class='page' style='display:none'>")
    }

    document.body.setAttribute("data-theme", items.options.theme);
    var counter = 1;
    var pageCounter = 1;
    var page = 1

    Object.keys(items).forEach(prop => {
      const item = "item" + counter.toString();
      const ticker = "ticker" + counter.toString();

      if (prop != "options" && prop != "code") {
        if (pageCounter > 6) {
          page++;
          pageCounter = 1;
        }
        if (items.options[prop + "Notif"] === true && items[prop].status) {

          const startT = new Date(items[prop].online);
          const nowT = new Date();
          const elapsed = Math.abs(nowT - startT);
          const eMinutes = Math.ceil(elapsed / (1000 * 60));
          var eHours = 0;
          const indexLink = items[prop].ticker.indexOf("http");
          const indexBars = items[prop].ticker.indexOf("||");


          if (Math.floor(eMinutes % 60) < 10) {
            eHours = Math.floor(eMinutes / 60).toString() + ":0" + Math.floor(eMinutes % 60).toString();
          }

          if (Math.floor(eMinutes % 60) >= 10) {
            eHours = Math.floor(eMinutes / 60).toString() + ":" + Math.floor(eMinutes % 60).toString();
          }

          $("#page" + page.toString()).prepend(("<div class='streamItem-online' id='" + prop + "'><a href='https://www.twitch.tv/" + prop.toLowerCase() + "'target='_blank'><div class='me-auto my-2'><h5 class='ms-2 mb-1'>" + prop + "</h5><h6 class='ms-2 my-1' id='" + prop + "Status'>" + (items[prop].game.substring(0, 32)) + "</h6><small class='ms-2 mt-1' id='" + ticker + "'>Ticker: </small></div><div><div class='position-relative m-2'><div class='position-absolute bottom-0 end-0 timestamp'><p class='m-1' id='" + prop + "Time'>" + eHours + "</p></div><img src='https://static-cdn.jtvnw.net/previews-ttv/live_user_" + prop.toLowerCase() + "-440x248.jpg' style='width:130px; height:73px; border-radius: 10px;'></div></div></div></a></div>"))

          $("#" + item).mouseenter(function () {
            $("#" + ticker).removeClass("hide");
          })
          if (indexBars != -1) {
            if (indexLink < 40) {
              $("#" + ticker).text((items[prop].ticker.substring((indexBars + 2), indexLink)))
            }

            if (indexLink === -1 || indexLink >= 40) {
              $("#" + ticker).text((items[prop].ticker.substring((indexBars + 2), (indexBars + 42))))
            }
          }
          if (indexBars === -1) {
            if (indexLink < 40) {
              $("#" + ticker).text((items[prop].ticker.substring(0, indexLink)))
            }

            if (indexLink === -1 || indexLink >= 40) {
              $("#" + ticker).text((items[prop].ticker.substring(0, 40)))
            }
          }

          counter++;
          pageCounter++;
        }
      }
    })
    Object.keys(items).forEach(prop => {
      const item = "item" + counter.toString();
      const ticker = "ticker" + counter.toString();
      

      if (prop != "options" && prop != "code") {
        if (pageCounter > 6) {
          page++;
          pageCounter = 1;
        }
        if (items.options[prop + "Notif"] === true && !items[prop].status) {
          const indexLink = items[prop].ticker.indexOf("http");
          const indexBars = items[prop].ticker.indexOf("||");

          $("#page" + page.toString()).append(("<div class='streamItem' id='" + prop + "'><a href='https://www.twitch.tv/" + prop.toLowerCase() + "' target='_blank'><ul class='popup-container'><li id='" + item + "'><h5 class='streamer'>" + prop + "</h5><h6 class='offline' id='" + prop + "Status'>OFFLINE</h6></li><li><small class='ms-2 hide' id='" + ticker + "'>Ticker: </small></li></ul></a></div>"))
          
          if (indexBars != -1) {
            if (indexLink < 55) {
              $("#" + ticker).text((items[prop].ticker.substring((indexBars + 2), indexLink))).attr("class", "ticker hide overflow-hidden")
            }

            if (indexLink === -1 || indexLink >= 55) {
              $("#" + ticker).text((items[prop].ticker.substring((indexBars + 2), (indexBars + 57)))).attr("class", "ticker hide overflow-hidden")
            }
          }
          if (indexBars === -1) {
            if (indexLink < 55) {
              $("#" + ticker).text((items[prop].ticker.substring(0, indexLink))).attr("class", "ticker hide overflow-hidden")
            }

            if (indexLink === -1 || indexLink >= 55) {
              $("#" + ticker).text((items[prop].ticker.substring(0, 55))).attr("class", "ticker hide overflow-hidden")
            }
          }

          $("#" + item).mouseenter(function () {
            $("#" + ticker).removeClass("hide");
          })
          counter++;
          pageCounter++;
        }
      }
    })
    if (page > 1) {
      $("#popupControl").prepend(("<li class='page-item border-0'><a class='page-link bg-dark text-white border-0 rounded-4' href='#' aria-label='Previous' id='pLast'><span aria-hidden='true'>&laquo;</span></a><li>"))

      $("#popupControl").append(("<li class='page-item border-0'><a class='page-link bg-dark text-white border-0' href='#' aria-label='Next' id='pNext'><span aria-hidden='true'>&raquo;</span></a></li>"))

      $("#pNext").click((e) => {
        e.preventDefault();
        const activeS = $("div[id*='page']").filter(":visible").attr("id").substring(4);
        const activeI = parseInt(activeS)
        console.log(activeI)
        if (activeI != page) {
          $("div[id*='page']").filter(":visible").hide()
          $(".active").toggleClass("active")
          $("#page" + ((activeI + 1).toString())).show()
          $("#pitem" + ((activeI + 1).toString())).toggleClass("active")
        }
        if (activeI === page) {
          $("div[id*='page']").filter(":visible").hide()
          $(".active").toggleClass("active")
          $("#page1").show()
          $("#pitem1").toggleClass("active")
        }
      })

      $("#pLast").click((e) => {
        e.preventDefault();
        const activeS = $("div[id*='page']").filter(":visible").attr("id").substring(4);
        const activeI = parseInt(activeS)
        console.log(activeI)
        if (activeI != 1) {
          $("div[id*='page']").filter(":visible").hide()
          $(".active").toggleClass("active")
          $("#page" + ((activeI - 1).toString())).show()
          $("#pitem" + ((activeI - 1).toString())).toggleClass("active")
        }
        if (activeI === 1) {
          $("div[id*='page']").filter(":visible").hide()
          $(".active").toggleClass("active")
          $("#page" + page.toString()).show()
          $("#pitem" + page.toString()).toggleClass("active")
        }
      })
    }
  })

}