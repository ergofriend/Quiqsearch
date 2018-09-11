let docs = function() {
  window.open("https://github.com/ErgoFriend/Quiqsearch", "_blank");
};

let setValue = function(value, out_text, out_value) {
  console.log("set value:", value, "change", out_text.id, "&", out_value.id);
  out_value.value = value;
  out_text.innerHTML = value;
};

let init = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["initialed"], function(value) {
      if (!value.initialed) {
        // first time use this extention.
        // set dafault value to storage
        chrome.storage.sync.set({ min: Number(3) }, function() {});
        chrome.storage.sync.set({ max: Number(20) }, function() {});
        chrome.storage.sync.set({ time: Number(1.5) }, function() {});
        chrome.storage.sync.set({ status: true }, function() {});
        chrome.storage.sync.set({ inputtextarea: true }, function() {});
        chrome.storage.sync.set({ youtube: false }, function() {});
        console.log("first init done!");
        resolve("false");
      } else {
        console.log("first init had been finished.");
        resolve("true");
      }
    });
  });
};

// DOM is changed, save to storage.
let eventListener = function(event) {
  const num = event.currentTarget.value;
  switch (event.currentTarget.id) {
    case "min_value":
      chrome.storage.sync.set({ min: Number(num) }, function() {});
      break;
    case "max_value":
      chrome.storage.sync.set({ max: Number(num) }, function() {});
      break;
    case "time_value":
      chrome.storage.sync.set({ time: Number(num) }, function() {});
      break;
    case "status":
      chrome.storage.sync.set(
        { status: event.currentTarget.checked },
        function() {}
      );
      console.log("status :", event.currentTarget.checked);
      break;
    case "inputtextarea":
      chrome.storage.sync.set(
        { inputtextarea: event.currentTarget.checked },
        function() {}
      );
      console.log("inputtextarea :", event.currentTarget.checked);
      break;
    case "youtube":
      chrome.storage.sync.set(
        { youtube: event.currentTarget.checked },
        function() {}
      );
      console.log("youtube :", event.currentTarget.checked);
      break;
    default:
      console.log("Invaild eventListener case error");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let target1 = document.getElementById("min_text");
  let target2 = document.getElementById("max_text");
  let target3 = document.getElementById("time_text");
  let elem1 = document.getElementById("min_value");
  let elem2 = document.getElementById("max_value");
  let elem3 = document.getElementById("time_value");
  let elem4 = document.getElementById("status");
  let eleminput = document.getElementById("inputtextarea");
  let elemyoutube = document.getElementById("youtube");

  // init settings data from storage.
  init()
    .then(function(result) {
      return new Promise((resolve, reject) => {
        if (result == "false") {
          chrome.storage.sync.set({ initialed: true }, function() {});
          console.log("initialed");
        }
        resolve();
      });
    })
    .then(function() {
      // When open popup
      console.log("init set");
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(
          ["min", "max", "time", "status", "inputtextarea", "youtube"],
          function(value) {
            setValue(value.min, target1, elem1);
            setValue(value.max, target2, elem2);
            setValue(value.time, target3, elem3);
            document.getElementById("status").checked = value.status;
            document.getElementById("onoff").innerHTML = value.status
              ? "ON"
              : "OFF";
            document.getElementById("inputtextarea").checked =
              value.inputtextarea;
            document.getElementById("youtube").checked = value.youtube;
            //resolve();
          }
        );
      });
    })
    .catch(function(error) {
      console.log(error);
    });

  // changing storage value from input acction
  elem1.addEventListener("input", eventListener);
  elem2.addEventListener("input", eventListener);
  elem3.addEventListener("input", eventListener);
  elem4.addEventListener("input", eventListener);
  eleminput.addEventListener("input", eventListener);
  elemyoutube.addEventListener("input", eventListener);

  // changing DOM value from listen changed storage
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      let storageChange = changes[key];
      let num = storageChange.newValue;
      switch (key) {
        case "min":
          setValue(num, target1, elem1);
          break;
        case "max":
          setValue(num, target2, elem2);
          break;
        case "time":
          setValue(num, target3, elem3);
          break;
        case "status":
          document.getElementById("status").checked = storageChange.newValue;
          document.getElementById("onoff").innerHTML = storageChange.newValue
            ? "ON"
            : "OFF";
          break;
        case "inputtextarea":
          break;
        case "youtube":
          break;
        default:
          console.log("Invaild onChanged case error");
      }
    }
  });

  // go to GitHub bage
  document.querySelector("button").addEventListener("click", docs);
});
