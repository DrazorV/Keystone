'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OverwriteError = function (_Error) {
  (0, _inherits3.default)(OverwriteError, _Error);

  function OverwriteError() {
    (0, _classCallCheck3.default)(this, OverwriteError);

    var _this = (0, _possibleConstructorReturn3.default)(this, (OverwriteError.__proto__ || (0, _getPrototypeOf2.default)(OverwriteError)).call(this, 'This function must be overwrite.'));

    _this.name = _this.constructor.name;
    Error.captureStackTrace(_this, _this.constructor);
    return _this;
  }

  return OverwriteError;
}(Error);

exports.default = OverwriteError;
module.exports = exports['default'];