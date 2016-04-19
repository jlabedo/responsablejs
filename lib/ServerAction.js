'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerAction = function ServerAction(opts) {
  var _this = this;

  _classCallCheck(this, ServerAction);

  this.onLoad = function (state, action) {
    return _extends({}, state, { loading: true });
  };

  this.onSuccess = function (state, result) {
    return _extends({}, state, { loading: false, results: result });
  };

  this.onFail = function (state, error) {
    return _extends({}, state, { loading: false, error: true });
  };

  this.generateReducers = function () {
    var reducers = {};
    reducers[_this.name + '_REQUEST'] = {
      reducer: _this.onLoad,
      stateAccessor: _this.stateAccessor
    };
    reducers[_this.name + '_SUCCESS'] = {
      reducer: function reducer(state, action) {
        return _this.onSuccess(state, action.result);
      },
      stateAccessor: _this.stateAccessor
    };
    reducers[_this.name + '_FAILURE'] = {
      reducer: function reducer(state, action) {
        return _this.onFail(state, action.error);
      },
      stateAccessor: _this.stateAccessor
    };
    return reducers;
  };

  this.dispatch = function (data) {
    if (!_this._dispatch) {
      console.error('No dispatch method has been registered', _this);
    }
    var _d = _this._dispatch;
    _d({
      type: _this.name + '_REQUEST',
      data: data
    });
    _this.serve(data).then(function (result) {
      return _d({ type: _this.name + '_SUCCESS', result: result });
    }, function (error) {
      return _d({ type: _this.name + '_FAILURE', error: error });
    }).catch(function (error) {
      console.error('ServerAction ERROR:', error);
      _d({ type: _this.name + '_FAILURE', error: error });
    });
  };

  this.name = opts.name;
  if (opts.onLoad) this.onLoad = opts.onLoad;
  if (opts.onSuccess) this.onSuccess = opts.onSuccess;
  if (opts.onFail) this.onFail = opts.onFail;
  this.stateAccessor = opts.stateAccessor;
  this.serve = opts.serve;
};

exports.default = ServerAction;