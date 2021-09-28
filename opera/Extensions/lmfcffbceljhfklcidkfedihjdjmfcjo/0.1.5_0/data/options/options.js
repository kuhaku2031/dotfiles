var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path == 'background-to-options') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'options-to-background', "method": id, "data": data})}
  }
})();

var theme = {};

var filltable = function (o) {
  var count = 1;
  theme = o;
  var tbody = document.getElementById('header-value-tbody');
  tbody.textContent = '';
  /*  */
  for (var key in o) {
    var item = document.createElement('tr');
    var name = document.createElement('td');
    var code = document.createElement('td');
    var close = document.createElement('td');
    var author = document.createElement('td');
    var toggle = document.createElement('td');
    var number = document.createElement('td');
    /*  */
    var code_t = document.createElement('textarea');
    var name_t = document.createElement('textarea');
    var author_t = document.createElement('textarea');
    /*  */
    name.setAttribute('type', 'name');
    code.setAttribute('type', 'code');
    close.setAttribute('type', 'close');
    number.setAttribute('type', 'number');
    author.setAttribute('type', 'author');
    toggle.setAttribute('type', 'toggle');
    /*  */
    number.textContent = count;
    name_t.value = o[key].name;
    code_t.value = o[key].code;
    author_t.value = o[key].author;
    /*  */
    name.appendChild(name_t);
    code.appendChild(code_t);
    author.appendChild(author_t);
    /*  */
    item.setAttribute('state', o[key].state);
    toggle.setAttribute('state', o[key].state);
    /*  */
    item.appendChild(number);
    item.appendChild(name);
    item.appendChild(author);
    item.appendChild(code);
    item.appendChild(toggle);
    item.appendChild(close);
    /*  */
    tbody.appendChild(item);
    /*  */
    count++;
  }
};

var load = function () {
  var storeoptionsdata = function () {
    filltable(theme);
    background.send("store-data", theme);
  };
  /*  */
  var tableevents = function (e) {
    var name, author, code, target = e.target;
    var extractTypes = function (tr) {
      for (var i = 0; i < tr.children.length; i++) {
        var td = tr.children[i];
        var type = td.getAttribute("type");
        if (type === "name") name = td.children[0].value;
        if (type === "code") code = td.children[0].value;
        if (type === "author") author = td.children[0].value;
      }
    };
    /*  */
    var tagname = target.tagName.toLowerCase();
    if (e.type === "click" && (tagname === 'td' || tagname === 'td')) {
      extractTypes(target.parentNode);
      if (target.getAttribute('type') === 'toggle') {
        if (target.getAttribute('state') === 'active') {
          target.setAttribute('state', 'inactive');
          theme[name].state = 'inactive';
        } else {
          target.setAttribute('state', 'active');
          theme[name].state = 'active';
        }
      }
      /*  */
      if (target.getAttribute('type') === 'close') delete theme[name];
      storeoptionsdata();
    }
    /*  */
    if (e.type === "change" && (tagname === 'textarea' || tagname === 'textarea')) {
      extractTypes(target.parentNode.parentNode);
      if (target.parentNode.getAttribute('type') === 'name') theme[name].name = target.value;
      if (target.parentNode.getAttribute('type') === 'code') theme[name].code = target.value;
      if (target.parentNode.getAttribute('type') === 'author') theme[name].author = target.value;
      storeoptionsdata();
    }
  };
  /*  */
  document.getElementById('header-value-table').addEventListener("click", tableevents);
  document.getElementById('header-value-table').addEventListener("change", tableevents);
  /*  */
  var addinputfielditem = function () {
    var tr = document.getElementById("input-field");
    var name = tr.children[0].children[0].value;
    name = name.replace(/ /g, '-').toLowerCase();
    var author = tr.children[1].children[0].value;
    var code = tr.children[2].children[0].value;
    var obj = {"domain": '', "name": name, "code": code, "author": author, "state": "active"};
    theme[name] = obj;
    storeoptionsdata();
  };
  /*  */
  background.send("retrieve-data");
  window.removeEventListener("load", load, false);
  document.getElementById('input-field-add').addEventListener("click", addinputfielditem);
};

window.addEventListener("load", load, false);
background.receive("retrieve-data", filltable);
