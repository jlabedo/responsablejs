"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateAccessor = function () {
  function StateAccessor(key, initialValue) {
    _classCallCheck(this, StateAccessor);

    this.key = key;
    this.initialValue = initialValue;
  }

  _createClass(StateAccessor, [{
    key: "getState",
    value: function getState(state) {
      return state[this.key] || this.initialValue;
    }
  }, {
    key: "getFromGlobalState",
    value: function getFromGlobalState(globalState) {
      if (this.mapToGlobalState) {
        return this.getState(this.mapToGlobalState(globalState));
      } else {
        return this.getState(globalState);
      }
    }
  }, {
    key: "updateState",
    value: function updateState(state, newValue) {
      if (state[this.key] !== newValue) {
        return _extends({}, state, _defineProperty({}, this.key, newValue));
      } else {
        return state;
      }
    }
  }, {
    key: "defaultState",
    value: function defaultState(state) {
      if (state[this.key] === undefined) {
        return _extends({}, state, _defineProperty({}, this.key, this.initialValue));
      } else {
        return state;
      }
    }
  }, {
    key: "init",
    value: function init(state) {
      return this.updateState(state, this.initialValue);
    }
  }, {
    key: "mapToGlobalState",
    value: function mapToGlobalState(map) {
      this.mapToGlobalState = map;
    }
  }]);

  return StateAccessor;
}();

exports.default = StateAccessor;