var app = {};

app.domain = function (url) {return new URL(url).hostname};
app.version = function () {return chrome.runtime.getManifest().version};
app.homepage = function () {return chrome.runtime.getManifest().homepage_url};
app.tab = {"open": function (url) {chrome.tabs.create({"url": url, "active": true})}};
chrome.runtime.setUninstallURL(app.homepage() + "?v=" + app.version() + "&type=uninstall", function () {});

chrome.runtime.onInstalled.addListener(function (e) {
  window.setTimeout(function () {
    var previous = config.welcome.open && e.previousVersion !== undefined && e.previousVersion !== app.version();
    var doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
    if (e.reason === "install" || (e.reason === "update" && doupdate)) {
      var parameter = (e.previousVersion ? "&p=" + e.previousVersion : '') + "&type=" + e.reason;
      app.tab.open(app.homepage() + "?v=" + app.version() + parameter);
      config.welcome.lastupdate = Date.now();
    }
  }, 3000);
});

app.button = (function () {
  var clicked;
  chrome.browserAction.onClicked.addListener(function () {if (clicked) clicked()});
  /*  */
  return {
    "clicked": function (e) {clicked = e},
    "icon": function () {
      var state = config.addon.state;
      app.content_script.send("storage-data", {"array": [], "domain": '', "state": state}, null);
      chrome.browserAction.setTitle({"title": "Website Theme Manager: " + (state === "enabled" ? "ON": "OFF")});
      chrome.browserAction.setIcon({
        "path": {
          "16": '../../data/icons/' + (state ? state + '/' : '') + '16.png',
          "32": '../../data/icons/' + (state ? state + '/' : '') + '32.png',
          "48": '../../data/icons/' + (state ? state + '/' : '') + '48.png',
          "64": '../../data/icons/' + (state ? state + '/' : '') + '64.png'
        }
      });
    }
  }
})();

app.storage = (function () {
  var objs = {};
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      objs = o;
      var script = document.createElement("script");
      script.src = "../common.js";
      document.body.appendChild(script);
    });
  }, 0);
  /*  */
  return {
    "read": function (id) {return objs[id]},
    "write": function (id, data) {
      var tmp = {};
      tmp[id] = data;
      objs[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();

app.options = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === 'options-to-background') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data, tabId) {
      chrome.runtime.sendMessage({"path": 'background-to-options', "method": id, "data": data});
    }
  }
})();

app.content_script = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === 'page-to-background') {
          if (request.method === id) {
            var a = request.data || {};
            if (sender.tab) {
              a["url"] = sender.tab.url;
              a["tabId"] = sender.tab.id;
            }
            tmp[id](a);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data, tabId) {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if (tab.url.indexOf("http") === 0) {
            if (!tabId || (tabId && tab.id === tabId)) {
              var a = data || {};
              a["url"] = tab.url;
              a["tabId"] = tab.id;
              chrome.tabs.sendMessage(tab.id, {"path": 'background-to-page', "method": id, "data": a});
            }
          }
        });
      });
    }
  }
})();
