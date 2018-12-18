'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _VideoMixin = require('../core/VideoMixin');

var _VideoMixin2 = _interopRequireDefault(_VideoMixin);

var _AbstractModule = require('../core/AbstractModule');

var _AbstractModule2 = _interopRequireDefault(_AbstractModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var Redtube = function (_AbstractModule$with) {
  (0, _inherits3.default)(Redtube, _AbstractModule$with);

  function Redtube() {
    (0, _classCallCheck3.default)(this, Redtube);
    return (0, _possibleConstructorReturn3.default)(this, (Redtube.__proto__ || (0, _getPrototypeOf2.default)(Redtube)).apply(this, arguments));
  }

  (0, _createClass3.default)(Redtube, [{
    key: 'videoUrl',
    value: function videoUrl(page) {
      return 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&search=' + this.query + '&thumbsize=big&page=' + (page || this.firstpage);
    }
  }, {
    key: 'videoParser',
    value: function videoParser($, _ref) {
      var videos = _ref.videos;

      return videos.map(function (_ref2) {
        var video = _ref2.video;
        return {
          title: video.title,
          url: video.url,
          duration: video.duration,
          thumb: video.default_thumb
        };
      });
    }
  }, {
    key: 'name',
    get: function get() {
      return 'Redtube';
    }
  }, {
    key: 'firstpage',
    get: function get() {
      return 1;
    }
  }]);
  return Redtube;
}(_AbstractModule2.default.with(_VideoMixin2.default));

exports.default = Redtube;
module.exports = exports['default'];