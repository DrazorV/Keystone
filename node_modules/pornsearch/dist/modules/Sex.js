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

var Sex = function (_AbstractModule$with) {
  (0, _inherits3.default)(Sex, _AbstractModule$with);

  function Sex() {
    (0, _classCallCheck3.default)(this, Sex);
    return (0, _possibleConstructorReturn3.default)(this, (Sex.__proto__ || (0, _getPrototypeOf2.default)(Sex)).apply(this, arguments));
  }

  (0, _createClass3.default)(Sex, [{
    key: 'videoUrl',
    value: function videoUrl(page) {
      return 'http://www.sex.com/search/videos?query=' + this.query + '&page=' + (page || this.firstpage);
    }
  }, {
    key: 'gifUrl',
    value: function gifUrl(page) {
      return 'http://www.sex.com/search/gifs?query=' + this.query + '&page=' + (page || this.firstpage);
    }
  }, {
    key: 'videoParser',
    value: function videoParser($) {
      var videos = $('#masonry_container .masonry_box');

      return videos.map(function (i, video) {
        var cached = $(video);
        var link = cached.find('.title a');
        var title = link.text();
        var duration = cached.find('.duration').text();

        if (!title || !duration) {
          return;
        }

        return {
          title: title,
          url: 'http://www.sex.com' + link.attr('href'),
          duration: duration,
          thumb: cached.find('.image').data('src')
        };
      }).get();
    }
  }, {
    key: 'gifParser',
    value: function gifParser($) {
      var gifs = $('#masonry_container .masonry_box').not('.ad_box');

      return gifs.map(function (i, gif) {
        var data = $(gif).find('a.image_wrapper');
        var title = data.attr('title');
        var url = data.find('img').data('src');

        if (!title || !url) {
          return;
        }

        return {
          title: title,
          url: url
        };
      }).get();
    }
  }, {
    key: 'name',
    get: function get() {
      return 'Sex';
    }
  }, {
    key: 'firstpage',
    get: function get() {
      return 1;
    }
  }]);
  return Sex;
}(_AbstractModule2.default.with(_GifMixin2.default, _VideoMixin2.default));

exports.default = Sex;
module.exports = exports['default'];