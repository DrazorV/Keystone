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

var _GifMixin = require('../core/GifMixin');

var _GifMixin2 = _interopRequireDefault(_GifMixin);

var _VideoMixin = require('../core/VideoMixin');

var _VideoMixin2 = _interopRequireDefault(_VideoMixin);

var _AbstractModule = require('../core/AbstractModule');

var _AbstractModule2 = _interopRequireDefault(_AbstractModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pornhub = function (_AbstractModule$with) {
  (0, _inherits3.default)(Pornhub, _AbstractModule$with);

  function Pornhub() {
    (0, _classCallCheck3.default)(this, Pornhub);
    return (0, _possibleConstructorReturn3.default)(this, (Pornhub.__proto__ || (0, _getPrototypeOf2.default)(Pornhub)).apply(this, arguments));
  }

  (0, _createClass3.default)(Pornhub, [{
    key: 'videoUrl',
    value: function videoUrl(page) {
      return 'http://www.pornhub.com/video/search?search=' + this.query + '&page=' + (page || this.firstpage);
    }
  }, {
    key: 'gifUrl',
    value: function gifUrl(page) {
      return 'http://www.pornhub.com/gifs/search?search=' + this.query + '&page=' + (page || this.firstpage);
    }
  }, {
    key: 'videoParser',
    value: function videoParser($) {
      var videos = $('ul.videos.search-video-thumbs li');

      return videos.map(function (i) {
        var data = videos.eq(i);

        if (!data.length) {
          return;
        }

        var thumb = data.find('img').attr('data-mediumthumb') || '';

        return {
          title: data.find('a').text().trim(),
          url: 'http://pornhub.com' + data.find('a').eq(0).attr('href'),
          duration: data.find('.duration').text(),
          thumb: thumb.replace(/\([^)]*\)/g, '')
        };
      }).get();
    }
  }, {
    key: 'gifParser',
    value: function gifParser($) {
      var gifs = $('ul.gifs.gifLink li');

      return gifs.map(function (i, gif) {
        var data = $(gif).find('a');

        return {
          title: data.find('span').text(),
          url: 'http://dl.phncdn.com#id#.gif'.replace('#id#', data.attr('href')),
          webm: data.find('video').attr('data-webm')
        };
      }).get();
    }
  }, {
    key: 'name',
    get: function get() {
      return 'Pornhub';
    }
  }, {
    key: 'firstpage',
    get: function get() {
      return 1;
    }
  }]);
  return Pornhub;
}(_AbstractModule2.default.with(_GifMixin2.default, _VideoMixin2.default));

exports.default = Pornhub;
module.exports = exports['default'];