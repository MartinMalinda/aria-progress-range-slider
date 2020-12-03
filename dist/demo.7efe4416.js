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
})({"src/helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementLeft = void 0;

function getElementLeft(el) {
  var left = 0;
  var element = el; // Loop through the DOM tree
  // and add it's parent's offset to get page offset

  do {
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return left;
}

exports.getElementLeft = getElementLeft;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var helpers_1 = require("./helpers");

var DEFAULT_OPTIONS = {
  ariaLabel: 'Seek slider',
  arrowMoveStep: 1,
  pageMoveStep: 5,
  className: 'AriaProgressBar',
  disabled: false,
  float: false,
  getTooltipText: function getTooltipText(value, options) {
    if (options.float) {
      return value.toString();
    }

    return Math.round(value).toString();
  },
  getValueText: function getValueText(value, options) {
    // TODO think of a more friendly label
    return value + " ranging from " + options.min + " to " + options.max;
  },
  initialValue: 0,
  max: 100,
  min: 0,
  snap: true,
  step: 1
};
var keyCodes = {
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

var ProgressBar =
/** @class */
function () {
  function ProgressBar(selectorOrElement, options) {
    var _this = this;

    this.isDragging = false;
    this.isMouseOver = false;
    this.isDestroyed = false; // Event handlers

    this.handleMouseEnter = function () {
      if (_this.options.disabled) {
        return;
      }

      _this.isMouseOver = true;
      _this.elementLeft = helpers_1.getElementLeft(_this.element);

      _this.element.classList.add(_this.options.className + "--hover");
    };

    this.handleMouseLeave = function () {
      _this.isMouseOver = false;

      _this.setHoverScale(0);

      _this.element.classList.remove(_this.options.className + "--hover");
    };

    this.handleDragStart = function (e) {
      if (_this.options.disabled) {
        return;
      }

      _this.isDragging = true;

      _this.element.classList.add(_this.options.className + "--dragging");

      _this.elementLeft = helpers_1.getElementLeft(_this.element);

      var value = _this.getValueFromEvent(e);

      _this.updateValue(value);

      if (_this.options.onDragStart) {
        _this.options.onDragStart(_this.realValue, _this.options);
      }
    };

    this.handleDragEnd = function () {
      if (_this.isDragging) {
        if (_this.options.onDragEnd) {
          _this.options.onDragEnd(_this.realValue, _this.options);
        }

        if (_this.options.onChange) {
          _this.options.onChange(_this.realValue, _this.options);
        }
      }

      _this.isDragging = false;

      _this.element.classList.remove(_this.options.className + "--dragging"); // TODO if need this for  IE only
      // this.updateHoverTooltip(this.value);

    };

    this.handleMouseMove = function (e) {
      if (!_this.isDragging && !_this.isMouseOver || _this.options.disabled) {
        return;
      }

      var value = _this.getValueFromEvent(e);

      _this.updateHoverTooltip(value);

      if (_this.isDragging) {
        _this.handleDragMove(value);
      } else if (_this.isMouseOver) {
        _this.setHoverScale(value);
      }
    };

    this.handleTouchMove = function (e) {
      if (!_this.isDragging || _this.options.disabled) {
        return;
      }

      e.preventDefault();

      var value = _this.getValueFromEvent(e);

      _this.handleDragMove(value);
    };

    this.handleKeyDown = function (e) {
      var _a;

      if (_this.options.disabled) {
        return;
      }

      var stepArrow = _this.options.arrowMoveStep / _this.range;
      var stepPage = _this.options.pageMoveStep / _this.range;
      /*
        Up and Right arrows increase slider value for "arrowMoveStep" (default 1)
        Down and Left arrows decrease slider value for "arrowMoveStep" (default 1)
        Page Up	increases slider value for "pageMoveStep" (default 10)
        Page Down	decreases slider value for "pageMoveStep" (default 10)
        Home sets slider to its minimum value.
        End	sets slider to its maximum value.
      */

      var stepMap = (_a = {}, _a[keyCodes.HOME] = -1, _a[keyCodes.END] = 1, _a[keyCodes.PAGE_DOWN] = -stepPage, _a[keyCodes.PAGE_UP] = stepPage, _a[keyCodes.DOWN] = -stepArrow, _a[keyCodes.LEFT] = -stepArrow, _a[keyCodes.UP] = stepArrow, _a[keyCodes.RIGHT] = stepArrow, _a);
      var step = stepMap[e.keyCode];

      if (typeof step === 'number') {
        var previousRealValue = _this.getRealValue();

        _this.updateValue(_this.includeStep(_this.value + step));

        if (previousRealValue !== _this.realValue && _this.options.onChange) {
          // TODO
          _this.options.onChange(_this.realValue, _this.options);
        }
      }
    };

    if (typeof selectorOrElement === 'string') {
      this.element = document.querySelector(selectorOrElement);
    } else {
      this.element = selectorOrElement;
    }

    if (!(this.element instanceof HTMLElement)) {
      throw 'Given HTML element is not valid or doesn\'t exist.';
    }

    this.options = __assign(__assign({}, DEFAULT_OPTIONS), options);
    this.range = this.options.max - this.options.min;
    this.createElements();

    if (this.options.disabled) {
      this.disable();
    }

    var value = 0;

    if (this.options.initialValue) {
      value = (this.options.initialValue - this.options.min) / this.range;
    }

    this.updateValue(value);
    this.setAriaProps(); // For IE only

    this.updateHoverTooltip(value);
  } // DOM


  ProgressBar.prototype.createElement = function (elementName, parentElement) {
    var element = document.createElement('div');
    element.className = this.getClassName(elementName);
    parentElement.appendChild(element);
    return element;
  };

  ProgressBar.prototype.createElements = function () {
    this.trackElement = this.createElement('track', this.element);
    this.progressElement = this.createElement('progress', this.trackElement);
    this.hoverElement = this.createElement('hover', this.trackElement);
    this.bufferElement = this.createElement('buffer', this.trackElement);
    this.handleElement = this.createElement('handle', this.element);

    if (this.options.getTooltipText) {
      this.valueTooltipElement = this.createElement('mainTooltip', this.element);
      ;
      this.hoverTooltipElement = this.createElement('hoverTooltip', this.element);
    }

    this.element.classList.add(this.options.className);
    this.element.setAttribute('tabindex', '0');
    this.element.setAttribute('role', 'slider');
    this.element.setAttribute('aria-valuemin', '0');
    this.setOptions(); // Dragging
    // Touch events

    this.element.addEventListener('touchstart', this.handleDragStart);
    window.addEventListener('touchmove', this.handleTouchMove, {
      capture: false,
      passive: false
    });
    window.addEventListener('touchend', this.handleDragEnd); // Dragging and hover
    // Mouse events

    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
    this.element.addEventListener('mousedown', this.handleDragStart);
    window.addEventListener('mouseup', this.handleDragEnd);
    window.addEventListener('mousemove', this.handleMouseMove, false); // Keyboard events

    this.element.addEventListener('keydown', this.handleKeyDown); // TODO decide if mouse wheel support should be added
  };

  ProgressBar.prototype.getClassName = function (elementName, modifier) {
    if (modifier === void 0) {
      modifier = null;
    }

    if (modifier) {
      return this.options.className + "-" + elementName + "--" + modifier;
    }

    return this.options.className + "-" + elementName;
  };

  ProgressBar.prototype.handleDragMove = function (value) {
    var previousRealValue = this.realValue;
    this.updateValue(value);

    if (previousRealValue !== this.realValue && this.options.onDragMove) {
      this.options.onDragMove(this.realValue, this.options);
    }
  };

  ProgressBar.prototype.getValueFromEvent = function (e) {
    var elementWidth = this.element.offsetWidth;
    var x;

    if (e.touches && e.touches.length === 1) {
      x = e.touches[0].pageX - this.elementLeft;
    } else if (e.pageX) {
      x = e.pageX - this.elementLeft;
    } else {
      return 0;
    }

    if (x < 0) {
      x = 0;
    } else if (x > elementWidth) {
      x = elementWidth;
    }

    return this.includeStep(x / elementWidth);
  };

  ProgressBar.prototype.setOptions = function () {
    this.element.setAttribute('aria-valuemax', this.options.max.toString());
    this.element.setAttribute('aria-label', this.options.ariaLabel);

    if (this.options.ariaLabeledBy) {
      this.element.setAttribute('aria-labeledby', this.options.ariaLabeledBy);
    }
  };

  ProgressBar.prototype.setAriaProps = function () {
    this.element.setAttribute('aria-valuenow', this.realValue.toString());
    this.element.setAttribute('aria-valuetext', this.options.getValueText(this.realValue, this.options));
  };

  ProgressBar.prototype.limitValue = function (value) {
    if (value < 0) {
      return 0;
    } else if (value > 1) {
      return 1;
    }

    return value;
  };

  ProgressBar.prototype.includeStep = function (value) {
    var step = this.options.step / this.range;

    if (this.options.snap) {
      value = Math.round(value / step) * step;
      value = value * this.range / this.range;
    }

    value = this.limitValue(value);
    return value;
  };

  ProgressBar.prototype.updateTooltip = function (value, realValue, element) {
    if (this.options.getTooltipText) {
      element.style.left = value * 100 + "%";
      element.innerHTML = this.options.getTooltipText(realValue, this.options);
    }
  };

  ProgressBar.prototype.updateValueTooltip = function (value) {
    this.updateTooltip(value, this.realValue, this.valueTooltipElement);
  };

  ProgressBar.prototype.updateHoverTooltip = function (value) {
    var hoverValue = value * this.range + this.options.min;
    this.updateTooltip(value, parseFloat(hoverValue.toFixed(4)), this.hoverTooltipElement);
  };

  ProgressBar.prototype.updateValue = function (value) {
    this.handleElement.style.left = value * 100 + "%";
    this.progressElement.style.width = value * 100 + "%";

    if (this.value !== value || typeof value === 'undefined') {
      var previousRealValue = this.getRealValue();
      this.value = value;
      this.realValue = this.getRealValue();

      if (this.realValue !== previousRealValue) {
        this.setAriaProps();
        this.updateValueTooltip(value);
      }

      if (this.isDragging) {
        this.setHoverScale(0);
      }
    }
  };

  ProgressBar.prototype.setHoverScale = function (value) {
    this.hoverElement.style.width = value * 100 + "%";
  };

  ProgressBar.prototype.getRealValue = function () {
    var value = this.value * this.range + this.options.min;
    return parseFloat(value.toFixed(4));
  };

  ProgressBar.prototype.unbind = function () {
    // Touch events
    this.element.removeEventListener('touchstart', this.handleDragStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleDragEnd); // Dragging and hover
    // Mouse events

    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('mousedown', this.handleDragStart);
    window.removeEventListener('mouseup', this.handleDragEnd);
    window.removeEventListener('mousemove', this.handleMouseMove); // Keyboard events

    this.element.removeEventListener('keydown', this.handleKeyDown);
  }; // Public


  ProgressBar.prototype.getValue = function () {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is destroyed, options: ', this.options);
      return;
    }

    return this.realValue;
  };

  ProgressBar.prototype.setValue = function (value) {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is destroyed, options: ', this.options);
      return;
    }

    if (this.isDragging) {
      return;
    }

    this.updateValue(this.includeStep(value / this.range));
  };

  ProgressBar.prototype.setBufferValue = function (value) {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is destroyed, options: ', this.options);
      return;
    }

    this.bufferElement.style.width = value / this.range + "%";
  };

  ProgressBar.prototype.disable = function () {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is destroyed, options: ', this.options);
      return;
    }

    this.options.disabled = true;
    this.element.classList.add(this.options.className + "--disabled");
    this.element.setAttribute('aria-disabled', 'true');
    this.element.setAttribute('disabled', 'true');
    this.element.setAttribute('tabindex', '-1');
  };

  ProgressBar.prototype.enable = function () {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is destroyed, options: ', this.options);
      return;
    }

    this.options.disabled = false;
    this.element.classList.remove(this.options.className + "--disabled");
    this.element.setAttribute('tabindex', '0');
  };

  ProgressBar.prototype.destroy = function () {
    if (this.isDestroyed) {
      console.warn('ProgressBar instance is already destroyed');
      return;
    } // Unbind everything


    this.unbind(); // Empty element

    this.element.innerHTML = '';
    this.isDestroyed = true;
    this.element.classList.remove(this.options.className);
    this.element.removeAttribute('tabindex');
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-valuemin');
    this.element.removeAttribute('aria-valuemax');
    this.element.removeAttribute('aria-label');
    this.element.removeAttribute('aria-valuenow');
    this.element.removeAttribute('aria-valuetext');

    if (this.options.ariaLabeledBy) {
      this.element.removeAttribute('aria-labeledby');
    }
  };

  return ProgressBar;
}();

exports.default = ProgressBar;
},{"./helpers":"src/helpers.ts"}],"src/demo.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var index_1 = __importDefault(require("./index")); ////////////// DEMO


function addTimeZero(value) {
  if (value < 10) {
    return "0" + value;
  }

  return value.toString();
}

function formatTime(seconds) {
  if (seconds < 60) {
    return "00:" + addTimeZero(seconds);
  }

  var minutes = Math.floor(seconds / 60);
  var leftoverSeconds = seconds % 60;
  return addTimeZero(minutes) + ":" + addTimeZero(leftoverSeconds);
}

var trackOne = new index_1.default('#track-one', {});
var trackTwo = new index_1.default(document.querySelector('#track-two'), {
  float: true,
  max: 300,
  snap: false,
  getTooltipText: function getTooltipText(value, options) {
    var seconds = Math.round(value);
    return "" + formatTime(seconds);
  },
  getValueText: function getValueText(value, options) {
    return formatTime(Math.round(value)) + " of " + formatTime(options.max);
  },
  onChange: function onChange(value) {
    return console.log('on change', value);
  },
  onDragStart: function onDragStart(value) {
    return console.log('on drag start', value);
  },
  onDragEnd: function onDragEnd(value) {
    return console.log('on drag end', value);
  },
  onDragMove: function onDragMove(value) {
    return console.log('on drag move', value);
  }
});
var trackThree = new index_1.default('#track-three', {
  min: 5,
  initialValue: 5.5,
  max: 10,
  step: 0.1,
  arrowMoveStep: 0.1,
  pageMoveStep: 1,
  getTooltipText: function getTooltipText(value, options) {
    return value.toString();
  },
  onChange: function onChange(value) {
    return console.log('on change', value);
  },
  onDragStart: function onDragStart(value) {
    return console.log('on drag start', value);
  },
  onDragEnd: function onDragEnd(value) {
    return console.log('on drag end', value);
  },
  onDragMove: function onDragMove(value) {
    return console.log('on drag move', value);
  }
});
},{"./index":"src/index.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55448" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/demo.ts"], null)
//# sourceMappingURL=/demo.7efe4416.js.map