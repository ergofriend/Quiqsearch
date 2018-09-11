document.addEventListener("selectionchange", function(event) {
  const str = window.getSelection().toString();
  window.postMessage({ keyword: str }, "*");
});
