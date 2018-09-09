document.addEventListener("DOMContentLoaded", () => {
  var elem1 = document.getElementById("range1");
  var target1 = document.getElementById("value1");
  var elem2 = document.getElementById("range2");
  var target2 = document.getElementById("value2");
  var elem3 = document.getElementById("range3");
  var target3 = document.getElementById("value3");
  chrome.storage.local.get(["value1", "value2", "value3"], function(value) {
    rangeValue(elem1, value.value1);
    rangeValue(elem2, value.value2);
    rangeValue(elem3, value.value3);
  });
  var rangeValue = function(elem, target) {
    return function(evt) {
      target.innerHTML = elem.value;
    };
  };
  elem1.addEventListener("input", rangeValue(elem1, target1));
  elem1.addEventListener("input", function() {
    chrome.storage.local.set({ value1: elem.value });
  });
  elem2.addEventListener("input", rangeValue(elem2, target2));
  elem3.addEventListener("input", rangeValue(elem3, target3));
});
