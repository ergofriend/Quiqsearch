let docs = function() {
  window.open("https://github.com/ErgoFriend/Quiqsearch", "_blank");
};

let init = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["initialed"], function(value) {
      if (!value.initialed) {
        // first time use this extention.
        console.log("first init done!");
        saveValue({ id: "min_value", value: 3 });
        saveValue({ id: "max_value", value: 20 });
        saveValue({ id: "time_value", value: 1.5 });
        saveValue({ id: "status", value: 1, checked: true });
        resolve("false");
      } else {
        console.log("first init had been finished.");
        resolve("true");
      }
    });
  });
};

let saveValue = function(elem) {
  console.log(elem.value, "is set to ", elem.id);
  switch (elem.id) {
    case "min_value":
      chrome.storage.sync.set({ min: elem.value }, function() {});
      break;
    case "max_value":
      chrome.storage.sync.set({ max: Number(elem.value) }, function() {});
      break;
    case "time_value":
      chrome.storage.sync.set({ time: Number(elem.value) }, function() {});
      break;
    case "status":
      chrome.storage.sync.set({ status: elem.checked }, function() {});
      break;
    default:
      console.log("Invaild saveValue case error");
  }
};

let setValue = function(value, out_text, out_value) {
  console.log("set value:", value, "change", out_text.id, "+", out_value.id);
  out_value.value = value;
  out_text.innerHTML = value;
};

let dualValue;

document.addEventListener("DOMContentLoaded", () => {
  let target1 = document.getElementById("min_text");
  let target2 = document.getElementById("max_text");
  let target3 = document.getElementById("time_text");
  let elem1 = document.getElementById("min_value");
  let elem2 = document.getElementById("max_value");
  let elem3 = document.getElementById("time_value");
  let elem4 = document.getElementById("status");

  // init settings data from storage.
  init()
    .then(function(result) {
      return new Promise((resolve, reject) => {
        if (result == "false") {
          chrome.storage.sync.set({ initialed: true }, function() {});
        }
        console.log("initialed");
        resolve();
      });
    })
    .then(function() {
      console.log("init set");
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["min", "max", "time", "status"], function(
          value
        ) {
          setValue(value.min, target1, elem1);
          setValue(value.max, target2, elem2);
          setValue(value.time, target3, elem3);
          document.getElementById("status").checked = value.status;
          resolve();
        });
      });
    })
    .then(function() {
      console.log("addEnventListener");
      chrome.storage.sync.get(["min", "max", "time", "status"], function(
        value
      ) {
        // changing storage value from input acction
        elem1.addEventListener("input", dualValue(elem1));
        elem2.addEventListener("input", dualValue(elem2));
        elem3.addEventListener("input", dualValue(elem3));
        elem4.addEventListener("input", dualValue(elem4));
      });
    })
    .catch(function(error) {
      console.log(error);
    });

  // go to GitHub bage
  document.querySelector("button").addEventListener("click", docs);
});
