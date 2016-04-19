'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FrameworkClient = require('./FrameworkClient');

var _FrameworkClient2 = _interopRequireDefault(_FrameworkClient);

var _ACTIONS_MODULE = require('ACTIONS_MODULE');

var _ACTIONS_MODULE2 = _interopRequireDefault(_ACTIONS_MODULE);

var _MAIN_COMPONENT_MODULE = require('MAIN_COMPONENT_MODULE');

var _MAIN_COMPONENT_MODULE2 = _interopRequireDefault(_MAIN_COMPONENT_MODULE);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Register actions
(0, _ACTIONS_MODULE2.default)(_FrameworkClient2.default);

_FrameworkClient2.default.render(_react2.default.createElement(_MAIN_COMPONENT_MODULE2.default, null));