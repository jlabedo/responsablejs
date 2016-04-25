'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _DevTools = require('./DevTools');

var _DevTools2 = _interopRequireDefault(_DevTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
  storeKey: 'framework',
  externalReducers: {},
  actions: [],

  createStore: function createStore(initialState) {
    var reducerMap = {};
    this.actions.forEach(function (action) {
      var reducers = action.generateReducers();
      Object.assign(reducerMap, reducers);
    });

    var reducer = this.getReducerFromMap(reducerMap);

    var finalReducer = (0, _redux.combineReducers)(_extends({}, this.externalReducers, _defineProperty({}, this.storeKey, reducer)));
    this.store = (0, _redux.createStore)(finalReducer, initialState, _DevTools2.default.instrument());
    if (this.onStoreCreation) {
      this.onStoreCreation(this.store);
    }
    return this.store;
  },

  getReducerFromMap: function getReducerFromMap(reducerMap) {
    var _this = this;

    var defaultState = function defaultState(state) {
      var uniqueAccessors = [];
      Object.keys(reducerMap).forEach(function (key) {
        var accessor = reducerMap[key].stateAccessor;
        if (uniqueAccessors.indexOf(accessor) === -1) {
          uniqueAccessors.push(accessor);
          state = accessor.defaultState(state);
          accessor.mapToGlobalState(function (globalState) {
            return globalState[_this.storeKey];
          });
        }
      });
      return state;
    };
    return function () {
      var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var action = arguments[1];

      var reducer = reducerMap[action.type];
      if (reducer) {
        // let key = reducer.stateKey;
        var previousState = reducer.stateAccessor.getState(state);
        var nextState = reducer.reducer(previousState, action);
        return reducer.stateAccessor.updateState(state, nextState);
      } else {
        return defaultState(state);
      }
    };
  },

  getState: function getState(state) {
    return state[undefined.storeKey];
  },

  register: function register(action) {
    var self = this;
    self.actions.push(action);
    action._dispatch = function () {
      return self.store.dispatch.apply(self, arguments);
    };
  },

  render: function render(component) {
    var root = document.createElement('div');
    document.body.appendChild(root);

    _reactDom2.default.render(_react2.default.createElement(
      _reactRedux.Provider,
      { store: this.createStore(), key: 'provider' },
      _react2.default.createElement(
        'div',
        null,
        component,
        _react2.default.createElement(_DevTools2.default, null)
      )
    ), root);
  }
};