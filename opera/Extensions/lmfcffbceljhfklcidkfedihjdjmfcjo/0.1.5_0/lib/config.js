var config = {};

config.log = false;
config.decoded = {"themes": []};

config.code = {
  set object (v) {app.storage.write("code", JSON.stringify(v))},
  get object () {return app.storage.read("code") !== undefined ? JSON.parse(app.storage.read("code")) : {}}
};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "enabled"}
};

config.welcome = {
  set open (val) {app.storage.write("support", val)},
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get open () {return app.storage.read("support") !== undefined ? app.storage.read("support") : true},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.extract = function (id, url, hostname) {
  var themes = config.code.object;
  if (themes[id].state === "active") {
    var code = themes[id].code;
    /*  */
    var rules = code.match(/regexp\(\"?([^\"]*)\"?\)/gm) || [];
    if (config.log) console.error(1, "regexp", rules);
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      rule = rule.split(',');
      for (var j = 0; j < rule.length; j++) {
        var tmp = rule[j].replace("regexp", '').replace('("', '').replace('")', '').trim();
        var RX = new RegExp(tmp);
        if (config.log) console.error(i, j, RX, RX.test(url), themes[id]);
        if (RX.test(url)) return config.decoded.themes.push(themes[id]);
      }
    }
    /*  */
    var domain = code.match(/domain\(\"?(.*)\"?\)/gm) || [];
    if (config.log) console.error(3, "domain", domain);
    for (var i = 0; i < domain.length; i++) {
      var result = domain[i];
      result = result.split(',');
      for (var j = 0; j < result.length; j++) {
        var tmp = result[j].replace("domain", '').replace('("', '').replace('")', '').trim();
        if (tmp.indexOf(hostname) !== -1 || hostname.indexOf(tmp) !== -1) return config.decoded.themes.push(themes[id]);
        if (config.log) console.error(i, j, tmp, hostname, config.decoded.themes);
      }
    }
    /*  */
    var prefix = code.match(/url\-prefix\(\"?(.*)\"?\)/gm) || [];
    if (config.log) console.error(4, "url-prefix", prefix);
    for (var i = 0; i < prefix.length; i++) {
      var result = prefix[i];
      result = result.split(',');
      for (var j = 0; j < result.length; j++) {
        var tmp = result[j].replace("url-prefix", '').replace('("', '').replace('")', '').trim();
        if (tmp.indexOf(hostname) !== -1 || hostname.indexOf(tmp) !== -1) return config.decoded.themes.push(themes[id]);
        if (config.log) console.error(i, j, tmp, hostname, config.decoded.themes);
      }
    }
  }
};

config.get = function (name) {return name.split('.').reduce(function (p, c) {return p[c]}, config)};

config.set = function (name, value) {
  function set(name, value, scope) {
    name = name.split('.');
    name.length > 1 ? set.call((scope || this)[name.shift()], name.join('.'), value) : this[name[0]] = value;
  }
  set(name, value, config);
};
