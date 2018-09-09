//start connection in content script
let contentPort = chrome.runtime.connect({
  name: "background-content"
});

//Append your pageScript.js to "real" webpage. So will it can full access to webpate.
var s = document.createElement("script");
s.src = chrome.extension.getURL("qsearch.js");
(document.head || document.documentElement).appendChild(s);
//Our pageScript.js only add listener to window object,
//so we don't need it after it finish its job. But depend your case,
//you may want to keep it.
s.parentNode.removeChild(s);

//Listen for runtime message
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.action === "GET_DUCK") {
//     //fire an event to get duck
//     let event = new CustomEvent("GET_DUCK");
//     window.dispatchEvent(event);
//   }
// });

// Send to backgroud.js
window.addEventListener(
  "message",
  function receiveDuck(event) {
    if (event.data.keyword) {
      //Remove this listener, but you can keep it depend on your case
      //window.removeEventListener("message", receiveDuck, false);
      contentPort.postMessage({
        type: "keyword",
        keyword: event.data.keyword
      });
    }
  },
  false
);
