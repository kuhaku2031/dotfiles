var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path == 'background-to-page') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'page-to-background', "method": id, "data": data})}
  }
})();

var interval = {"code": null, "install": null};

var action = function () {
  var button_middle = document.getElementById("button_middle");
  if (button_middle) {
    var no_select = button_middle.querySelector('div[class*="no-select"]');
    if (no_select) {
      window.clearInterval(interval.install);
      var button = document.createElement("div");
      var author = document.getElementById("infomation_value_left").textContent;
      var theme_name = document.getElementById("stylish-description").textContent;
      /*  */
      button.setAttribute("class", "css_button");
      background.send("code-status", {"name": theme_name});
      button_middle.insertBefore(button, button_middle.firstChild);
      background.receive("code-status", function (o) {
        if (o.name && o.name !== theme_name) return;
        if (o.status === "saved") {
          button.textContent = '';
          button.title = "This theme is already added to - Website Theme Manager - addon";
          button.style.backgroundImage = "url('" + chrome.runtime.getURL("data/content_script/saved.png") + "')";
          button.style.backgroundPosition = "center center";
          button.style.backgroundRepeat = "no-repeat";
          button.style.backgroundSize = "24px";
          return;
        }
        /*  */
        var saved = false;
        button.textContent = "Add to Website Theme Manager";
        button.title = "Add this theme to - Website Theme Manager - addon";
        button.addEventListener("click", function () {
          if (saved) return;
          button.textContent = '';
          button.style.backgroundImage = "url('" + chrome.runtime.getURL("data/content_script/loading.gif") + "')";
          button.style.backgroundPosition = "center center";
          button.style.backgroundRepeat = "no-repeat";
          button.style.backgroundSize = "24px";
          no_select.click();
          /*  */
          interval.code = window.setInterval(function () {
            var code = document.getElementById("stylish-code");
            if (code.textContent) {
              var code = code.textContent;
              window.clearInterval(interval.code);
              background.send("code-save", {"code": code, "domain": '', "state": "active", "name": theme_name, "author": author || "unknown"});
            }
          }, 300);
        });
        /*  */
        background.receive("code-save", function (o) {
          if (o.name === theme_name) {
            saved = true;
            button.textContent = '';
            button.title = "This theme is added to - Website Theme Manager - addon";
            button.style.backgroundImage = "url('" + chrome.runtime.getURL("data/content_script/saved.png") + "')";
            button.style.backgroundPosition = "center center";
            button.style.backgroundRepeat = "no-repeat";
            button.style.backgroundSize = "24px";
          }
        });
      });
    }
  }
};

interval.install = window.setInterval(action, 300);
