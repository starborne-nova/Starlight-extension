const localStorage = {};
const outAuth = "stealthystars";

const initStorageCache = getAllStorageSyncData()
  
async function populateStorage() {
    const items = await chrome.storage.sync.get()
            // Object.entries()
            Object.keys(items).forEach((item) => {
                $("#storageList").append("<li class='list-group-item list-group-item-dark d-flex justify-content-between align-items-start'><div class='ms-2 me-auto'><div class='fw-bold' id='" + item + "Sub'>" + item + "</div></div></li>")
                Object.keys(items[item]).forEach((subKey) => {
                    if (item === "options") {
                        $("#optionsToolList").append("<li class='list-group-item list-group-item-dark'><div class='form-check'><input class='form-check-input' type='checkbox' value='" + subKey +"' id='" + subKey + "Tool'><label class='form-check-label' for='" + subKey + "Tool'>" + subKey + "</label></div></li>")
                    }

                    $("#" + item + "Sub").after("<h6>" + subKey + ": " + items[item][subKey] + "</h6>")

                })
                if (item === "code") {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "ResetFire' type='button' class='btn btn-warning'>Reset</button><button id='" + item + "Delete' type='button' class='btn btn-danger dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>Delete</button><ul class='dropdown-menu bg-dark' aria-labelledby='btnGroupDrop1'><li><a class='dropdown-item text-light' id='" + item + "DeleteFire' href='#'>Are you sure?</a></li></ul></div>")
                    $("#" + item + "DeleteFire").on("click", (e) => {
                        chrome.storage.sync.remove(item)
                        location.reload();
                    })
                    $("#" + item + "ResetFire").on("click", (e) => {
                        const reset = {
                            code: {
                                userID: "",
                                req: {},
                                generated: "",
                                enabled: false
                            }
                        }
                        chrome.storage.sync.set(reset)
                        location.reload();
                    })
                }
                if (item === "options") {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "ResetFire' type='button' class='btn btn-warning' data-bs-toggle='modal' data-bs-target='#optionsTool'>Open Options Tool</button></div>")
                }
                else {
                    $("#" + item + "Sub").after("<div class='btn-group position-absolute top-0 end-0 p-3' role='group'><button id='" + item + "Delete' type='button' class='btn btn-danger dropdown-toggle' data-bs-toggle='dropdown' aria-expanded='false'>Delete</button><ul class='dropdown-menu bg-dark' aria-labelledby='btnGroupDrop1'><li><a class='dropdown-item text-light' id='" + item + "DeleteFire' href='#'>Are you sure?</a></li></ul></div>")
                    $("#" + item + "DeleteFire").on("click", (e) => {
                        chrome.storage.sync.remove(item)
                        location.reload();
                    })
                }

            })

        }

async function getAllStorageSyncData() {
    const items = await chrome.storage.sync.get()
    Object.assign(localStorage, items);
    console.log(localStorage);
}

async function optionsSubmit() {    
            $("input[id*='Tool']").each((i, e)=>{
                const elemValue = e.value
                console.log(e.value.toString())
                if(e.checked === true && e.value != "theme"){
                   delete localStorage.options[elemValue]
                }
            })          
                console.log(localStorage)
                chrome.storage.sync.set(localStorage);            
    }
    
$("#optionsToolSubmit").on("click", e=>{
    optionsSubmit();
})

document.addEventListener('DOMContentLoaded', populateStorage);

document.getElementById("resetStorage").addEventListener("click", ()=>{
    chrome.runtime.sendMessage({message: "storageReset"}, (response)=>{
        console.log("message sent")
        console.log(response.message)
    })
});