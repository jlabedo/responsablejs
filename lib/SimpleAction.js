'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleAction = function SimpleAction(opts) {
  var _this = this;

  _classCallCheck(this, SimpleAction);

  this.generateReducers = function () {
    var self = _this;
    return _defineProperty({}, _this.name, {
      reducer: self.reducer,
      stateAccessor: self.stateAccessor
    });
  };

  this.dispatch = function (data) {
    if (!_this._dispatch) {
      console.error('No dispatch method has been registered', _this);
      return;
    }
    _this._dispatch({
      type: _this.name,
      data: data
    });
  };

  this.name = opts.name;
  this.reducer = opts.reducer;
  this.stateAccessor = opts.stateAccessor;
  this.initialState = opts.initialState;
};

exports.default = SimpleAction;