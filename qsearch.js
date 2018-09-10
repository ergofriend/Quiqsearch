document.addEventListener("selectionchange", function(event) {
  const str = window.getSelection().toString();
  console.log(window.getSelection());
  window.postMessage({ keyword: str }, "*");
});
