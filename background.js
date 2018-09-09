//background script is always running unless extension
//is disabled
//http://waitingphoenix.com/how-to-make-your-chrome-extension-access-webpage/
//Wait for some one connect to it
let contentPort;
chrome.runtime.onConnect.addListener(function(portFrom) {
  if (portFrom.name === "background-content") {
    //This is how you add listener to a port.
    portFrom.onMessage.addListener(function(message) {
      //Do something to duck
      console.log(message.keyword);
      window.open(
        "https://www.google.com/search?q=" + encodeURI(message.keyword),
        "_blank"
      );
    });
  }
});

// Send a message to contentscript.js a tab which has your content script injected
// chrome.tabs.sendMessage(YOUR_TARGET_TAB_ID, { action: "GET_DUCK" });
