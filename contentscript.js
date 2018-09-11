//start connection in content script
// let contentPort = chrome.runtime.connect({
//   name: "background-content"
// });

//Append your pageScript.js to "real" webpage. So will it can full access to webpate.
var s = document.createElement("script");
s.src = chrome.extension.getURL("qsearch.js");
(document.head || document.documentElement).appendChild(s);
s.parentNode.removeChild(s);

// Send to backgroud.js
window.addEventListener(
  "message",
  function receive(event) {
    if (event.data.keyword) {
      //Remove this listener, but you can keep it depend on your case
      //window.removeEventListener("message", receive, false);
      const str = event.data.keyword;
      const leng = str.length;
      const oldtime = Date.now()
        .toString()
        .slice(-4);
      chrome.storage.sync.get(
        ["min", "max", "time", "status", "inputtextarea", "youtube"],
        function(result) {
          if (result.status) {
            if (
              !result.inputtextarea ||
              document.activeElement.nodeName != "INPUT"
            ) {
              console.log(document.activeElement.nodeName);
              if (result.min <= leng && leng <= result.max) {
                setTimeout(function() {
                  if (str == window.getSelection().toString()) {
                    // send message to background.js
                    console.log(
                      oldtime,
                      "|",
                      Date.now()
                        .toString()
                        .slice(-4)
                    );
                    let search_url = "";
                    if (/youtube.com/.test(window.location.origin)) {
                      console.log("youtube search: true");
                      search_url = result.youtube
                        ? "https://www.youtube.com/results?search_query="
                        : "https://www.google.com/search?q=";
                    } else {
                      search_url = "https://www.google.com/search?q=";
                    }
                    window.open(search_url + encodeURI(str), "_blank");
                    // contentPort.postMessage({
                    //   type: "keyword",
                    //   keyword: str
                    // });
                  }
                }, result.time * 1000); //ignition_time秒後
              }
            }
          }
        }
      );
    }
  },
  false
);
