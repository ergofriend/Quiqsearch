function docs() {
  window.open("https://github.com/ErgoFriend/Quiqsearch");
}

function rangeValue(elem, target) {
  return function(evt) {
    target.innerHTML = elem.value;
  };
}

function init(elem1, elem2, elem3, status) {
  chrome.storage.sync.get(["value1", "value2", "value3", "status"], function(
    value
  ) {
    rangeValue(elem1, value.value1);
    rangeValue(elem2, value.value2);
    rangeValue(elem3, value.value3);
    rangeValue(status, value.status);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  var elem1 = document.getElementById("range1");
  var target1 = document.getElementById("value1");
  var elem2 = document.getElementById("range2");
  var target2 = document.getElementById("value2");
  var elem3 = document.getElementById("range3");
  var target3 = document.getElementById("value3");
  var status = document.getElementById("status").checked;

  // init settings data from storage.
  init(elem1, elem2, elem3, status);
  // go to GitHub bage
  document.querySelector("button").addEventListener("click", docs);
  // changing value in real time.
  elem1.addEventListener("input", rangeValue(elem1, target1));
  elem2.addEventListener("input", rangeValue(elem2, target2));
  elem3.addEventListener("input", rangeValue(elem3, target3));
});
