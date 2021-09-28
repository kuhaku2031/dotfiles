app.options.receive("retrieve-data", function () {
  app.options.send("retrieve-data", config.code.object);
});

app.options.receive("store-data", function (o) {
  config.code.object = o;
  app.content_script.send("storage-update", {}, null);
});

app.button.clicked(function () {
  config.addon.state = config.addon.state === 'disabled' ? 'enabled' : 'disabled';
  app.button.icon();
});

app.content_script.receive("code-status", function (o) {
  var tmp = config.code.object;
  var status = tmp && tmp[o.name] ? "saved" : '';
  app.content_script.send("code-status", {"name": o.name, "status": status}, (o ? o.tabId : null));
});

app.content_script.receive("code-save", function (o) {
  var tmp = config.code.object;
  tmp[o.name] = o;
  config.code.object = tmp;
  app.options.send("retrieve-data", config.code.object)
  app.content_script.send("code-save", o, (o ? o.tabId : null));
});

app.content_script.receive("storage-data", function (o) {
  if (o.url) {
    config.decoded.themes = [];
    o.hostname = app.domain(o.url);
    o.hostname = o.hostname.replace("www.", '');
    if (o.hostname === "userstyles.org") return;
    /*  */
    var themes = config.code.object;
    for (var id in themes) config.extract(id, o.url, o.hostname);
    if (config.decoded.themes && config.decoded.themes.length) {
      if (config.log) console.error({"array": config.decoded.themes, "domain": o.hostname, "state": config.addon.state});
      app.content_script.send("storage-data", {"array": config.decoded.themes, "domain": o.hostname, "state": config.addon.state}, (o ? o.tabId : null));
    }
  }
});

window.setTimeout(app.button.icon, 300);
