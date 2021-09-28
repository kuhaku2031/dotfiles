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

var theme = [];
var firefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
var head = document.documentElement || document.head || document.querySelector("head");

var clear = function (flag) {
  if (flag) theme = [];
  var styles = document.querySelectorAll("style[id*='-piw4fk3tSz-style'");
  if (styles && styles.length) {
    for (var i = 0; i < styles.length; i++) head.removeChild(styles[i]);
  }
};

var render = function (o) {
  var code = '';
  theme = o.array && o.array.length ? o.array : theme, state = o.state;
  if (state === "enabled") {
    for (var i = 0; i < theme.length; i++) {
      if (theme[i].state === "active") {
        var id = theme[i].name + "-piw4fk3tSz-style";
        var style = document.getElementById(id);
        if (!style) {
          style = document.createElement("style");
          style.setAttribute("id", id);
          style.type = "text/css";
          if (firefox === false) {
            code = theme[i].code;
            code = code.replace(/regexp\(\"([^\"]*)\"\)/gm, '').replace(/\@\-moz\-document[^\{]*\{/gm, "@media all {").trim();
          }
          /*  */
          style.textContent = code ? code : theme[i].code;
          head.appendChild(style);
        }
      }
    }
  } else clear(false);
};

background.receive("storage-update", function () {
  clear(true);
  background.send("storage-data", {"top": document.location.href});
});

background.receive("storage-data", render);
background.send("storage-data", {"top": document.location.href});
