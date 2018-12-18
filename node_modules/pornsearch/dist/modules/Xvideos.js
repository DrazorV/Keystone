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

var Xvideos = function (_AbstractModule$with) {
  (0, _inherits3.default)(Xvideos, _AbstractModule$with);

  function Xvideos() {
    (0, _classCallCheck3.default)(this, Xvideos);
    return (0, _possibleConstructorReturn3.default)(this, (Xvideos.__proto__ || (0, _getPrototypeOf2.default)(Xvideos)).apply(this, arguments));
  }

  (0, _createClass3.default)(Xvideos, [{
    key: 'videoUrl',
    value: function videoUrl(page) {
      return 'https://www.xvideos.com/?k=' + this.query + '&p=' + (page || this.firstpage);
    }
  }, {
    key: 'videoParser',
    value: function videoParser($) {
      var videos = $('#content .mozaique .thumb-block');

      return videos.map(function (i, video) {
        var cache = $(video);
        var title = cache.find('p a').eq(0);

        return {
          title: title.text(),
          url: 'https://xvideos.com' + title.attr('href'),
          duration: cache.find('.duration').text(),
          thumb: cache.find('.thumb img').data('src').replace('thumbs169', 'thumbs169lll').replace('THUMBNUM', '5')
        };
      }).get();
    }
  }, {
    key: 'name',
    get: function get() {
      return 'xVideos';
    }
  }, {
    key: 'firstpage',
    get: function get() {
      return 0;
    }
  }]);
  return Xvideos;
}(_AbstractModule2.default.with(_VideoMixin2.default));

exports.default = Xvideos;
module.exports = exports['default'];