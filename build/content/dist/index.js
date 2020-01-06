// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Good date query is below (gets the last 5 years)
// https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=792%20STERLING%20PLACE&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-01-10T14:00:00%27
//Helper functions
function clickHandler(e, complaintData) {
  if (!+e.target.clicked) {
    e.target.innerText = 'Hide';
    var button = e.target;
    e.target.clicked = 1;
    var table = button.parentElement.parentElement;
    var dataTable = document.createElement('table');
    var tableContainer = document.createElement('div');

    if (complaintData[0]) {
      tableContainer.style = 'width: 500px; overflow: scroll; max-height: 276px; border-width: 1px; border-top: 0px; border-color: black; border-style: dashed; background-color: #FFFBB6; margin-top: 0px; display: flex; justify-content: center; align-content: center;';
      dataTable.innerHTML = "\n      <thead> \n          <tr> <td><b style=\"margin-right: position: sticky; 7px;\">Date of Complaint</b></td>  <td><b>Complaint Type</b></td> <td style=\"padding-left: 15px;\"><b>Description</b></td></tr>\n      </thead> \n      <tbody style=\"max-height: 274px;\">".concat(complaintData.map(function (incident) {
        var createdDateArr = incident.created_date.split('-');
        var createdDateHuman = "".concat(createdDateArr[1], "/").concat(createdDateArr[0]);
        return "<tr>\n                  <td style=\"width: 130px;\"> ".concat(createdDateHuman, "</td>       \n                  <td style=\"width: 150px;\"> ").concat(incident.complaint_type, " </td>\n                  <td style=\"padding-left: 15px;\">").concat(incident.descriptor[0] + incident.descriptor.slice(1).toLowerCase(), "</td>\n              </tr>");
      }).join(''), "\n      </tbody>");
      e.target.parentElement.style = 'background-color: #FFFBB6; margin-bottom: 0px; width: 500px; border: 1px black dashed; border-bottom: 0px;';
    } else {
      dataTable.innerHTML = "\n      <thead> \n          <tr> <b style='text-align: left'> No complaints to show </b></tr>\n      </thead>";
      tableContainer.style = "width: '".concat(table.width, "px'; padding-bottom: 10px; background-color: #FFFBB6; margin-top: 0px; display: flex; justify-content: center; align-content: center;");
    }

    dataTable.className = 'dataTable';
    tableContainer.id = 'tableContainer';
    tableContainer.appendChild(dataTable);
    table.appendChild(tableContainer);
  } else if (+e.target.clicked) {
    e.target.innerText = 'See all';
    e.target.clicked = 0;
    e.target.parentElement.style = 'background-color: #FFFBB6; margin-bottom: 0px';
    var article = e.target.parentElement.parentElement;

    var _dataTable = article.querySelector('#tableContainer');

    _dataTable.remove();
  }
}

var getZipCode =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var link, res, htmltext, dummy, addressEnd, idx, boroughZipID;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            link = document.getElementsByClassName('details-titleLink')[0].href;
            _context.next = 3;
            return fetch(link);

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.text();

          case 6:
            htmltext = _context.sent;
            _context.next = 9;
            return document.createElement('div');

          case 9:
            dummy = _context.sent;
            dummy.innerHTML = htmltext;

            if (dummy.getElementsByClassName('backend_data')[0].getElementsByTagName('span')[0]) {
              addressEnd = dummy.getElementsByClassName('backend_data')[0].getElementsByTagName('span')[0].innerText.split(' ');
            } else {
              addressEnd = document.querySelector("#content > main > div.row.DetailsPage > article:nth-child(3) > section:nth-child(6) > div > div:nth-child(3) > a").innerText.split(' ');
            }

            idx = addressEnd.indexOf('NY');
            boroughZipID = addressEnd[idx + 1].slice(0, 3);
            return _context.abrupt("return", boroughZipID);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getZipCode() {
    return _ref.apply(this, arguments);
  };
}();

var getCurrentBorough = function getCurrentBorough(currentZipCode) {
  switch (currentZipCode) {
    case '100':
      return 'MANHATTAN';

    case '112':
      return 'BROOKLYN';

    case '103':
      return 'BRONX';

    default:
      return 'QUEENS';
  }
};

chrome.storage.sync.get(['homeRevealOn'],
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(result) {
    var pathNames, state, items, currentZipCode, currBorough, showComplaints, addressEnd, boroughZipID, _currBorough2, simpleAddress, complaintData, complaintListItem, _simpleAddress, _currBorough3, _complaintData;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!result.homeRevealOn) {
              _context4.next = 23;
              break;
            }

            pathNames = location.pathname.split('/');

            if (!(pathNames[1] === 'for-rent')) {
              _context4.next = 22;
              break;
            }

            state = '';
            items = Array.from(document.getElementsByClassName('item'));
            _context4.next = 7;
            return getZipCode();

          case 7:
            currentZipCode = _context4.sent;
            _context4.t0 = currentZipCode;
            _context4.next = _context4.t0 === '100' ? 11 : _context4.t0 === '112' ? 13 : _context4.t0 === '103' ? 15 : 17;
            break;

          case 11:
            currBorough = 'MANHATTAN';
            return _context4.abrupt("break", 18);

          case 13:
            currBorough = 'BROOKLYN';
            return _context4.abrupt("break", 18);

          case 15:
            currBorough = 'BRONX';
            return _context4.abrupt("break", 18);

          case 17:
            currBorough = 'QUEENS';

          case 18:
            items.forEach(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(item) {
                var address, response, myJson, dataLength, linkToPopUp, listContainer, complaintInfo;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        address = item.getElementsByClassName('details-titleLink')[0];

                        if (!address) {
                          _context2.next = 25;
                          break;
                        }

                        address = address.innerText.split(' ');
                        address.pop();
                        address = address.join(' ').toUpperCase();
                        _context2.next = 7;
                        return fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(address, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(currBorough, "&location_type=RESIDENTIAL BUILDING"));

                      case 7:
                        response = _context2.sent;
                        _context2.next = 10;
                        return response.json();

                      case 10:
                        myJson = _context2.sent;
                        dataLength = myJson.length ? myJson.length : 'No';
                        linkToPopUp = document.createElement('a');
                        linkToPopUp.innerText = "".concat(dataLength, " complaints");
                        linkToPopUp.style = 'padding-top: 40px;';
                        linkToPopUp.id = address;
                        linkToPopUp.name = currBorough;
                        listContainer = document.createElement('li');
                        complaintInfo = document.createElement('div');
                        complaintInfo.className = 'details_info';
                        complaintInfo.style = myJson.length ? 'background-color: #FFFBB6; display: flex; justify-content: space-between; flex-direction: row;' : null;
                        complaintInfo.innerHTML = "<span>".concat(dataLength, " complaints against this building</span> ").concat(myJson.length ? "<button style=\"padding: 3px 0px; margin-top: 4px;\"><a name=\"".concat(currBorough, "\" id=\"").concat(address, "\" style=\"padding: 5px 20px\">See more</a></button>") : '');

                        if (myJson.length) {
                          complaintInfo.children[1].addEventListener('click', showComplaints);
                        }

                        listContainer.appendChild(complaintInfo);
                        item.getElementsByTagName('ul')[0].appendChild(listContainer);

                      case 25:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }());

            showComplaints =
            /*#__PURE__*/
            function () {
              var _ref4 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3(e) {
                var button, _currBorough, address, table, data, json, jsonData, tableContainer, endNote, dataTable, article, _dataTable2;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        if (+e.target.clicked) {
                          _context3.next = 27;
                          break;
                        }

                        button = e.target;
                        console.log('target is', e.target);
                        e.target.clicked = 1;
                        _currBorough = button.name;
                        address = button.id;
                        table = button.parentElement.parentElement.parentElement;
                        _context3.next = 9;
                        return fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(address, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(_currBorough, "&location_type=RESIDENTIAL BUILDING"));

                      case 9:
                        data = _context3.sent;
                        _context3.next = 12;
                        return data.json();

                      case 12:
                        json = _context3.sent;
                        console.log('data is', json);
                        jsonData = json.reverse();
                        tableContainer = document.createElement('div');
                        endNote = document.createElement('p');
                        dataTable = document.createElement('table');

                        if (json[0]) {
                          dataTable.innerHTML = "\n            <thead> \n                <tr> <td><b style=\"margin-right: 7px;\">Date of Complaint</b></td>  <td><b>Complaint Type</b></td></tr>\n            </thead> \n            <tbody>".concat(jsonData.map(function (incident) {
                            var createdDateArr = incident.created_date.split('-');
                            var createdDateHuman = "".concat(createdDateArr[1], "/").concat(createdDateArr[0]);
                            return "<tr>\n                        <td style=\"margin-right: 7px;\"> ".concat(createdDateHuman, "</td>       \n                        <td> ").concat(incident.complaint_type, " </td>\n                    </tr>");
                          }).join(''), "\n              <tr/>\n            </tbody>");
                        } else {
                          dataTable.innerHTML = "\n            <thead> \n                <tr> <b style='text-align: center;'> No complaints to show </b></tr>\n            </thead>";
                        }

                        endNote.innerText = 'Data taken from NYC Open Data on all residential 311 building complaints made in the last five years';
                        tableContainer.className = 'dataTable';
                        dataTable.style = 'overflow: scroll; max-height: 276px;';
                        tableContainer.style = 'display: flex; justify-content: center; align-content: center;';
                        tableContainer.appendChild(dataTable);
                        table.appendChild(tableContainer);
                        _context3.next = 28;
                        break;

                      case 27:
                        if (+e.target.clicked) {
                          e.target.clicked = 0;
                          article = e.target.parentElement.parentElement.parentElement;
                          _dataTable2 = article.querySelector('.dataTable');

                          _dataTable2.remove();
                        } else {
                          console.log('HERE THREE');
                        }

                      case 28:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function showComplaints(_x3) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context4.next = 23;
            break;

          case 22:
            if (pathNames[1] === 'building' && pathNames[3] || pathNames[1] === 'rental' && pathNames[2]) {
              if (document.getElementsByClassName('backend_data')[0].getElementsByTagName('span')[0]) {
                addressEnd = document.getElementsByClassName('backend_data')[0].getElementsByTagName('span')[0].innerText.split(',');
              } else {
                addressEnd = document.querySelector("#content > main > div.row.DetailsPage > article:nth-child(3) > section:nth-child(6) > div > div:nth-child(3) > a").innerText.split(',');
              }

              boroughZipID = addressEnd.pop().slice(1, 4);
              _currBorough2 = getCurrentBorough(boroughZipID);
              simpleAddress = document.querySelector('main').querySelector('.incognito').innerText.split(' ');
              simpleAddress.pop();
              simpleAddress = simpleAddress.join(' ').toUpperCase(); // const simpleAddress = document
              //   .getElementsByClassName('backend_data')[0]
              //   .getElementsByTagName('a')[0]
              //   .innerText.toUpperCase();

              fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(simpleAddress, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(_currBorough2, "&location_type=RESIDENTIAL BUILDING")).then(function (data) {
                data.json().then(function (jsonData) {
                  console.log('the fetch call was:', "https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(simpleAddress, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(_currBorough2, "&location_type=RESIDENTIAL BUILDING"));
                  console.log('the complaint data is...', jsonData);
                  var complaints = document.createElement('div');
                  complaints.className = 'details_info';
                  complaints.innerHTML = "<span class=\"nobreak\" style=\"color: ".concat(jsonData.length ? 'red' : 'black', "; font-size: 16px; margin-left: 5px\"><b>").concat(jsonData.length, " building complaints</b> (last 5 years)</span> \n            ").concat(jsonData.length ? '<button id="dataButton" clicked="0" style="width: 90px; height: 30px; font-size: 14px; margin: 8px 0px 4px 8px;">See more</button>' : '');
                  complaints.style = "background-color: ".concat(jsonData.length ? '#FFFBB6' : 'white', ";");
                  var holdingDiv = document.getElementsByClassName('details')[0];
                  holdingDiv.appendChild(complaints);

                  complaints.querySelector('#dataButton').onclick = function (e) {
                    return clickHandler(e, jsonData.reverse());
                  };
                });
              });
            } else if (pathNames[1] === 'building' && !pathNames[3]) {
              complaintListItem = document.createElement('li');
              _simpleAddress = document.querySelector("article.right-two-fifths.main-info > h2").innerText.split(',')[0].toUpperCase();
              _currBorough3 = document.querySelector("article.right-two-fifths.main-info > h2").innerText.split(',')[1].toUpperCase();
              fetch("https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(_simpleAddress, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(_currBorough3, "&location_type=RESIDENTIAL BUILDING")).then(function (data) {
                data.json().then(function (jsonData) {
                  console.log('the fetch call was:', "https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=".concat(_simpleAddress, "&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=").concat(_currBorough3, "&location_type=RESIDENTIAL BUILDING"));
                  console.log('the complaint data is...', jsonData);
                  var complaints = document.createElement('div');
                  complaints.className = 'details_info';
                  complaints.innerHTML = "<span class=\"nobreak\" style=\"color: red; font-size: 16px; margin-left: 5px\"><b>".concat(jsonData.length, " building complaints</b> (last 5 years)</span> \n        ").concat(jsonData.length ? '<button id="dataButton" clicked="0" style="width: 90px; height: 30px; font-size: 14px; margin: 8px 0px 4px 8px;">See more</button>' : '');
                  complaints.style = 'background-color: #FFFBB6; margin-bottom: 0px';
                  var mainContainer = document.querySelector("article.right-two-fifths.main-info");
                  mainContainer.appendChild(complaints);

                  complaints.querySelector('#dataButton').onclick = function (e) {
                    return clickHandler(e, jsonData.reverse());
                  };
                });
              });
            }

          case 23:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());
},{}],"../../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51470" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/index.js.map