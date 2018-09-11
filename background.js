//background script is always running unless extension
//is disabled
//http://waitingphoenix.com/how-to-make-your-chrome-extension-access-webpage/
//Wait for some one connect to it
let contentPort;
chrome.runtime.onConnect.addListener(function(portFrom) {
  //console.log("load background.js");
  if (portFrom.name === "background-content") {
    //This is how you add listener to a port.
    portFrom.onMessage.addListener(function(message) {
      //Do something to duck
      const str = message.keyword;
    });
  }
});
