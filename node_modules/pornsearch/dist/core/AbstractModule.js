'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _OverwriteError = require('./OverwriteError');

var _OverwriteError2 = _interopRequireDefault(_OverwriteError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractModule = function () {
  function AbstractModule() {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck3.default)(this, AbstractModule);

    this.query = query;
  }

  (0, _createClass3.default)(AbstractModule, [{
    key: 'name',
    get: function get() {
      throw new _OverwriteError2.default();
    }
  }, {
    key: 'firstpage',
    get: function get() {
      throw new _OverwriteError2.default();
    }
  }], [{
    key: 'with',
    value: function _with() {
      for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
        mixins[_key] = arguments[_key];
      }

      return mixins.reduce(function (father, mixin) {
        return mixin(father);
      }, this);
    }
  }]);
  return AbstractModule;
}();

exports.default = AbstractModule;
module.exports = exports['default'];