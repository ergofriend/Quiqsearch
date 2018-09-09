var min_length = 3;
var max_length = 20;
var ignition_time = 1.5;
var str = "";
document.addEventListener("selectionchange", function(event) {
  str = window.getSelection().toString();
  var old = str;
  setTimeout(function() {
    if (old == window.getSelection().toString()) {
      if (min_length < str.length && str.length < max_length) {
        window.postMessage({ keyword: str }, "*");
        // var win = window.open(
        //   "https://www.google.com/search?q=" + encodeURI(str),
        //   "_blank"
        // );
      }
    }
  }, ignition_time * 1000); //ignition_time秒後
});
