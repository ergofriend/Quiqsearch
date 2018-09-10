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
      chrome.storage.sync.set({ min: Number(elem.value) }, function() {});
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
let aaa = function(event) {
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
      break;
    default:
      console.log("Invaild aaa case error");
  }
  console.log(event.currentTarget.id);
  console.log(num);
};
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
    .catch(function(error) {
      console.log(error);
    });

  // changing storage value from input acction
  elem1.addEventListener("input", aaa);
  elem2.addEventListener("input", aaa);
  elem3.addEventListener("input", aaa);
  elem4.addEventListener("input", aaa);

  // changing DOM value from listen changed storage
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      let storageChange = changes[key];
      let num = storageChange.newValue;
      switch (key) {
        case "min":
          setValue(num, target1, elem1);
          console.log("min changed to", num);
          break;
        case "max":
          setValue(num, target2, elem2);
          console.log("max changed to", num);
          break;
        case "time":
          setValue(num, target3, elem3);
          console.log("time changed to", num);
          break;
        case "status":
          document.getElementById("status").checked = storageChange.newValue;
          console.log("status changed to", storageChange.newValue);
          break;
        default:
          console.log("Invaild onChanged case error");
      }
    }
  });

  // go to GitHub bage
  document.querySelector("button").addEventListener("click", docs);
});
