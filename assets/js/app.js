(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  hey, [be]Lazy.js - v1.8.2 - 2016.10.25
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
;
(function(root, blazy) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register bLazy as an anonymous module
        define(blazy);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = blazy();
    } else {
        // Browser globals. Register bLazy on window
        root.Blazy = blazy();
    }
})(this, function() {
    'use strict';

    //private vars
    var _source, _viewport, _isRetina, _supportClosest, _attrSrc = 'src', _attrSrcset = 'srcset';

    // constructor
    return function Blazy(options) {
        //IE7- fallback for missing querySelectorAll support
        if (!document.querySelectorAll) {
            var s = document.createStyleSheet();
            document.querySelectorAll = function(r, c, i, j, a) {
                a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
                for (i = r.length; i--;) {
                    s.addRule(r[i], 'k:v');
                    for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                    s.removeRule(0);
                }
                return c;
            };
        }

        //options and helper vars
        var scope = this;
        var util = scope._util = {};
        util.elements = [];
        util.destroyed = true;
        scope.options = options || {};
        scope.options.error = scope.options.error || false;
        scope.options.offset = scope.options.offset || 100;
        scope.options.root = scope.options.root || document;
        scope.options.success = scope.options.success || false;
        scope.options.selector = scope.options.selector || '.b-lazy';
        scope.options.separator = scope.options.separator || '|';
        scope.options.containerClass = scope.options.container;
        scope.options.container = scope.options.containerClass ? document.querySelectorAll(scope.options.containerClass) : false;
        scope.options.errorClass = scope.options.errorClass || 'b-error';
        scope.options.breakpoints = scope.options.breakpoints || false;
        scope.options.loadInvisible = scope.options.loadInvisible || false;
        scope.options.successClass = scope.options.successClass || 'b-loaded';
        scope.options.validateDelay = scope.options.validateDelay || 25;
        scope.options.saveViewportOffsetDelay = scope.options.saveViewportOffsetDelay || 50;
        scope.options.srcset = scope.options.srcset || 'data-srcset';
        scope.options.src = _source = scope.options.src || 'data-src';
        _supportClosest = Element.prototype.closest;
        _isRetina = window.devicePixelRatio > 1;
        _viewport = {};
        _viewport.top = 0 - scope.options.offset;
        _viewport.left = 0 - scope.options.offset;


        /* public functions
         ************************************/
        scope.revalidate = function() {
            initialize(scope);
        };
        scope.load = function(elements, force) {
            var opt = this.options;
            if (elements && elements.length === undefined) {
                loadElement(elements, force, opt);
            } else {
                each(elements, function(element) {
                    loadElement(element, force, opt);
                });
            }
        };
        scope.destroy = function() {            
            var util = scope._util;
            if (scope.options.container) {
                each(scope.options.container, function(object) {
                    unbindEvent(object, 'scroll', util.validateT);
                });
            }
            unbindEvent(window, 'scroll', util.validateT);
            unbindEvent(window, 'resize', util.validateT);
            unbindEvent(window, 'resize', util.saveViewportOffsetT);
            util.count = 0;
            util.elements.length = 0;
            util.destroyed = true;
        };

        //throttle, ensures that we don't call the functions too often
        util.validateT = throttle(function() {
            validate(scope);
        }, scope.options.validateDelay, scope);
        util.saveViewportOffsetT = throttle(function() {
            saveViewportOffset(scope.options.offset);
        }, scope.options.saveViewportOffsetDelay, scope);
        saveViewportOffset(scope.options.offset);

        //handle multi-served image src (obsolete)
        each(scope.options.breakpoints, function(object) {
            if (object.width >= window.screen.width) {
                _source = object.src;
                return false;
            }
        });

        // start lazy load
        setTimeout(function() {
            initialize(scope);
        }); // "dom ready" fix

    };


    /* Private helper functions
     ************************************/
    function initialize(self) {
        var util = self._util;
        // First we create an array of elements to lazy load
        util.elements = toArray(self.options);
        util.count = util.elements.length;
        // Then we bind resize and scroll events if not already binded
        if (util.destroyed) {
            util.destroyed = false;
            if (self.options.container) {
                each(self.options.container, function(object) {
                    bindEvent(object, 'scroll', util.validateT);
                });
            }
            bindEvent(window, 'resize', util.saveViewportOffsetT);
            bindEvent(window, 'resize', util.validateT);
            bindEvent(window, 'scroll', util.validateT);
        }
        // And finally, we start to lazy load.
        validate(self);
    }

    function validate(self) {
        var util = self._util;
        for (var i = 0; i < util.count; i++) {
            var element = util.elements[i];
            if (elementInView(element, self.options) || hasClass(element, self.options.successClass)) {
                self.load(element);
                util.elements.splice(i, 1);
                util.count--;
                i--;
            }
        }
        if (util.count === 0) {
            self.destroy();
        }
    }

    function elementInView(ele, options) {
        var rect = ele.getBoundingClientRect();

        if(options.container && _supportClosest){
            // Is element inside a container?
            var elementContainer = ele.closest(options.containerClass);
            if(elementContainer){
                var containerRect = elementContainer.getBoundingClientRect();
                // Is container in view?
                if(inView(containerRect, _viewport)){
                    var top = containerRect.top - options.offset;
                    var right = containerRect.right + options.offset;
                    var bottom = containerRect.bottom + options.offset;
                    var left = containerRect.left - options.offset;
                    var containerRectWithOffset = {
                        top: top > _viewport.top ? top : _viewport.top,
                        right: right < _viewport.right ? right : _viewport.right,
                        bottom: bottom < _viewport.bottom ? bottom : _viewport.bottom,
                        left: left > _viewport.left ? left : _viewport.left
                    };
                    // Is element in view of container?
                    return inView(rect, containerRectWithOffset);
                } else {
                    return false;
                }
            }
        }      
        return inView(rect, _viewport);
    }

    function inView(rect, viewport){
        // Intersection
        return rect.right >= viewport.left &&
               rect.bottom >= viewport.top && 
               rect.left <= viewport.right && 
               rect.top <= viewport.bottom;
    }

    function loadElement(ele, force, options) {
        // if element is visible, not loaded or forced
        if (!hasClass(ele, options.successClass) && (force || options.loadInvisible || (ele.offsetWidth > 0 && ele.offsetHeight > 0))) {
            var dataSrc = getAttr(ele, _source) || getAttr(ele, options.src); // fallback to default 'data-src'
            if (dataSrc) {
                var dataSrcSplitted = dataSrc.split(options.separator);
                var src = dataSrcSplitted[_isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
                var srcset = getAttr(ele, options.srcset);
                var isImage = equal(ele, 'img');
                var parent = ele.parentNode;
                var isPicture = parent && equal(parent, 'picture');
                // Image or background image
                if (isImage || ele.src === undefined) {
                    var img = new Image();
                    // using EventListener instead of onerror and onload
                    // due to bug introduced in chrome v50 
                    // (https://productforums.google.com/forum/#!topic/chrome/p51Lk7vnP2o)
                    var onErrorHandler = function() {
                        if (options.error) options.error(ele, "invalid");
                        addClass(ele, options.errorClass);
                        unbindEvent(img, 'error', onErrorHandler);
                        unbindEvent(img, 'load', onLoadHandler);
                    };
                    var onLoadHandler = function() {
                        // Is element an image
                        if (isImage) {
                            if(!isPicture) {
                                handleSources(ele, src, srcset);
                            }
                        // or background-image
                        } else {
                            ele.style.backgroundImage = 'url("' + src + '")';
                        }
                        itemLoaded(ele, options);
                        unbindEvent(img, 'load', onLoadHandler);
                        unbindEvent(img, 'error', onErrorHandler);
                    };
                    
                    // Picture element
                    if (isPicture) {
                        img = ele; // Image tag inside picture element wont get preloaded
                        each(parent.getElementsByTagName('source'), function(source) {
                            handleSource(source, _attrSrcset, options.srcset);
                        });
                    }
                    bindEvent(img, 'error', onErrorHandler);
                    bindEvent(img, 'load', onLoadHandler);
                    handleSources(img, src, srcset); // Preload

                } else { // An item with src like iframe, unity games, simpel video etc
                    ele.src = src;
                    itemLoaded(ele, options);
                }
            } else {
                // video with child source
                if (equal(ele, 'video')) {
                    each(ele.getElementsByTagName('source'), function(source) {
                        handleSource(source, _attrSrc, options.src);
                    });
                    ele.load();
                    itemLoaded(ele, options);
                } else {
                    if (options.error) options.error(ele, "missing");
                    addClass(ele, options.errorClass);
                }
            }
        }
    }

    function itemLoaded(ele, options) {
        addClass(ele, options.successClass);
        if (options.success) options.success(ele);
        // cleanup markup, remove data source attributes
        removeAttr(ele, options.src);
        removeAttr(ele, options.srcset);
        each(options.breakpoints, function(object) {
            removeAttr(ele, object.src);
        });
    }

    function handleSource(ele, attr, dataAttr) {
        var dataSrc = getAttr(ele, dataAttr);
        if (dataSrc) {
            setAttr(ele, attr, dataSrc);
            removeAttr(ele, dataAttr);
        }
    }

    function handleSources(ele, src, srcset){
        if(srcset) {
            setAttr(ele, _attrSrcset, srcset); //srcset
        }
        ele.src = src; //src 
    }

    function setAttr(ele, attr, value){
        ele.setAttribute(attr, value);
    }

    function getAttr(ele, attr) {
        return ele.getAttribute(attr);
    }

    function removeAttr(ele, attr){
        ele.removeAttribute(attr); 
    }

    function equal(ele, str) {
        return ele.nodeName.toLowerCase() === str;
    }

    function hasClass(ele, className) {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

    function addClass(ele, className) {
        if (!hasClass(ele, className)) {
            ele.className += ' ' + className;
        }
    }

    function toArray(options) {
        var array = [];
        var nodelist = (options.root).querySelectorAll(options.selector);
        for (var i = nodelist.length; i--; array.unshift(nodelist[i])) {}
        return array;
    }

    function saveViewportOffset(offset) {
        _viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
        _viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
    }

    function bindEvent(ele, type, fn) {
        if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        } else {
            ele.addEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function unbindEvent(ele, type, fn) {
        if (ele.detachEvent) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        } else {
            ele.removeEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function each(object, fn) {
        if (object && fn) {
            var l = object.length;
            for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
        }
    }

    function throttle(fn, minDelay, scope) {
        var lastCall = 0;
        return function() {
            var now = +new Date();
            if (now - lastCall < minDelay) {
                return;
            }
            lastCall = now;
            fn.apply(scope, arguments);
        };
    }
});

},{}],2:[function(require,module,exports){
/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

},{}],3:[function(require,module,exports){
'use strict';

var _helpers = require('./lib/_helpers');

var _carousel = require('./lib/_carousel');

var _carousel2 = _interopRequireDefault(_carousel);

var _projectsScroll = require('./lib/_projects-scroll');

var _projectsScroll2 = _interopRequireDefault(_projectsScroll);

var _videoBg = require('./lib/_video-bg');

var _videoBg2 = _interopRequireDefault(_videoBg);

var _splashController = require('./lib/_splash-controller');

var _splashController2 = _interopRequireDefault(_splashController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Blazy = require('blazy');
var FontFaceObserver = require('fontfaceobserver');

/*
  mobile test
*/
window.mobilecheck = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
if (window.mobilecheck()) {
  document.documentElement.classList.add('mobile-device');
}

/*
  .no-js management
*/
document.documentElement.classList.remove('no-js');

/*
  Font management
*/

// If fonts already loaded in session, add `fonts-loaded` class to document (1)
if (!sessionStorage.fontsLoaded) {
  var font = new FontFaceObserver('Heebo');
  // If font.load() fails takes longer than 2000ms (2),
  // OR if font.load() fails (3),
  //   add `fonts-error` class to document
  // If success (4),
  //   add `fonts-loaded` class to document
  Promise.race([(0, _helpers.timer)(2000), font.load()]).then(function () {
    /* (4) */
    sessionStorage.fontsLoaded = true;
    document.documentElement.classList.remove('fonts-standby');
    document.documentElement.classList.add('fonts-loaded');
  }, function () {
    /* (3) */
    sessionStorage.fontsLoaded = false;
    document.documentElement.classList.remove('fonts-standby');
    document.documentElement.classList.add('fonts-error');
  }).catch(function () {
    /* (2) */
    sessionStorage.fontsLoaded = false;
    document.documentElement.classList.remove('fonts-standby');
    document.documentElement.classList.add('fonts-error');
  });
} else {
  /* (1) */
  document.documentElement.classList.remove('fonts-standby');
  document.documentElement.classList.add('fonts-loaded');
}

/*
  Image lazy-loading
  via blazy.js
*/

var blazy = new Blazy({
  selector: '.lazyload',
  successClass: 'lazyloaded',
  errorClass: 'lazyerrored',
  src: 'data-src',
  breakpoints: [{
    width: 768,
    src: 'data-src-small'
  }],
  success: function success(ele) {
    if (ele.classList.contains('lazyload--invisible')) {
      ele.style.backgroundImage = '';
    }
  },
  error: function error(ele, msg) {
    if (msg === 'missing') {
      console.log(ele + ' was missing');
    } else if (msg === 'invalid') {
      console.log(ele + ' was invalid');
    }
  }
});

/*
  Fade page on unload
*/
window.onbeforeunload = function () {
  $('body').css('opacity', 0);
  window.scrollTo(0, 0);
};

if (document.querySelector('.splash') && !window.mobilecheck()) {
  var splashController = new _splashController2.default();
}
/*
  Projects - Image Carousel
*/

var carousel = new _carousel2.default('.showcase');

/*
  Projects modal
*/

$('a[data-modal="carousel"]').magnificPopup({
  type: 'inline',
  mainClass: 'is-active',
  closeBtnInside: false,
  fixedContentPos: true,
  callbacks: {
    elementParse: function elementParse(item) {
      // build data via data-content attribute
      var data = JSON.parse(item.el.attr('data-content'));
      var buildCarouselImages = function buildCarouselImages(imageArray) {
        var images = '';
        imageArray.forEach(function (image) {
          images += '<img class="Wallop-item lazyload" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/assets/images/projects/' + image + '.jpg">';
        });
        return images;
      };
      var buildCarouselPag = function buildCarouselPag(imageArray) {
        var images = '';
        imageArray.forEach(function (image) {
          images += '<a class="Wallop-pagination__option" href="#"><img src="/assets/images/projects/' + image + '--thumbnail.jpg"></a>';
        });
        return images;
      };
      // parse elements into modal content
      function getLink() {
        if (data.url) {
          return '<a class="btn btn--filled btn--filled-primary" href="' + data.url + '" target="_blank">View site</a>';
        } else {
          return '';
        }
      }
      item.src = '<div class="showcase">' + '<div class="showcase__container">' + '<div class="showcase__images">' + '<div class="Wallop"><div class="Wallop-list">' + buildCarouselImages(data.imagesList) + '</div></div>' + // Wallop, Wallop-list
      '<div class="Wallop-pagination">' + '<button class="Wallop-pagination__arrow Wallop-pagination__arrow--prev"><img src="assets/images/svg/icon-arrow.svg" /></a></button>' + buildCarouselPag(data.imagesList) + '<button class="Wallop-pagination__arrow Wallop-pagination__arrow--next"><img src="assets/images/svg/icon-arrow.svg" /></a></button>' + '</div>' + //Wallop-pagination
      '</div>' + // showcase__images
      '<div class="showcase__description">' + '<img src="/assets/images/svg/logo-' + data.abbr + '.svg" alt="' + data.name + ' logo" title="' + data.name + ' logo" />' + '<p>' + data.description + '</p>' + getLink() + '</div>' + // showcase__description
      '</div>' + // showcase__container
      '</div>'; // showcase
    },
    open: function open() {
      carousel.init();
      blazy.load(document.querySelectorAll('.Wallop-item'), true);
      var $that = $(this);
      // update history
      setTimeout(function () {
        history.pushState(null, document.title, $that[0].currItem.el[0].getAttribute('href'));
      }, 10);
      $(window).on('popstate', function (e) {
        if (e.originalEvent.state === null) {
          // initial page
          $.magnificPopup.close();
        }
      });
    },
    close: function close() {
      carousel.destroy();
      // update history
      history.pushState(null, document.title, '/');
      $(window).off('popstate');
    }
  }
});

/*
  About video bg
*/

if (document.querySelector('.video-bg')) {
  var videoBG = new _videoBg2.default('.video-bg');
}

/*
  Set height for mobile - Splash
*/

if (matchMedia) {
  var mq = window.matchMedia("(max-width: 767px)");
  mq.addListener(widthUpdateHandler);
  widthUpdateHandler(mq);
}

// media query change
function widthUpdateHandler(mq) {
  if (mq.matches) {
    $('.splash').css('height', $(window).height() - 16);
  } else {
    $('.splash').css('height', '');
  }
}

/*
  Projects horizontal scroll
  - for mobile (<480px)
*/

if (document.querySelector('.projects--main')) {
  var scrollMainProjects = new _projectsScroll2.default('.projects--main');
}

},{"./lib/_carousel":4,"./lib/_helpers":5,"./lib/_projects-scroll":6,"./lib/_splash-controller":7,"./lib/_video-bg":8,"blazy":1,"fontfaceobserver":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Carousel = function () {
  function Carousel(selector) {
    _classCallCheck(this, Carousel);

    this.selector = selector;
    if (document.querySelector(this.selector) !== null) {
      this.init();
    }
  }

  _createClass(Carousel, [{
    key: 'init',
    value: function init() {
      this.el = document.querySelector(this.selector);
      var slider = new Wallop(this.el, {
        buttonPreviousClass: 'Wallop-pagination__arrow--prev',
        buttonNextClass: 'Wallop-pagination__arrow--next'
      });

      // add `click` to pagination items
      var pagEls = Array.from(document.querySelectorAll('.Wallop-pagination__option'));
      pagEls.forEach(function (pagEl, index) {
        if (index === 0) {
          pagEl.classList.add('is-active');
        }
        pagEl.addEventListener('click', function (event) {
          event.preventDefault();
          slider.goTo(index);
        }, false);
      });

      slider.on('change', function (event) {
        pagEls.forEach(function (el, index) {
          if (index !== event.detail.currentItemIndex) {
            el.classList.remove('is-active');
          } else {
            el.classList.add('is-active');
          }
        });
      });

      this.keyDownTextField = function (e) {
        var keyCode = e.keyCode;
        if (keyCode === 37) {
          slider.previous();
        } else if (keyCode === 39) {
          slider.next();
        }
      };
      document.addEventListener('keydown', this.keyDownTextField, false);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      document.removeEventListener('keydown', this.keyDownTextField);
    }
  }]);

  return Carousel;
}();

exports.default = Carousel;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.hasClass = hasClass;
exports.timer = timer;
// Ref: http://youmightnotneedjquery.com
function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    var currentClassName = el.className;
    el.setAttribute('class', currentClassName + ' ' + className);
  }
}

// Ref: http://youmightnotneedjquery.com
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
  }
}

// Ref: http://youmightnotneedjquery.com
function hasClass(el, className) {
  return el.className && new RegExp("(\\s|^)" + className + "(\\s|$)").test(el.className);
}

// Ref: https://www.bramstein.com/writing/web-font-loading-patterns.html
function timer(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, time);
  });
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProjectsScroll = function () {
  function ProjectsScroll(selector) {
    _classCallCheck(this, ProjectsScroll);

    this.selector = selector;
    this.el = document.querySelector(selector);
    this.mq = matchMedia ? window.matchMedia('(max-width: 479px)') : null;
    this.list = this.el.querySelector('[class*="list"]');
    this.projects = this.el.querySelectorAll('.project');
    this.gutter = '32px';

    if (this.el !== null && this.mq) {
      this.mq.addListener(this.resizeHandler.bind(this));
      this.resizeHandler();
    }
  }

  _createClass(ProjectsScroll, [{
    key: 'resizeHandler',
    value: function resizeHandler() {
      if (this.mq.matches) {
        this.buildContainer();
      } else if (this.container !== undefined) {
        console.log(this.container);
        this.destroyContainer();
      }
    }
  }, {
    key: 'buildContainer',
    value: function buildContainer() {
      this.container = document.createElement('div');

      var tempContainer = document.createDocumentFragment(),
          count = this.projects.length,
          el = this.projects[0],
          width = el.getBoundingClientRect().width + parseInt(window.getComputedStyle(el)['margin-right']);

      // add projects to fragment
      while (this.list.childNodes.length > 0) {
        tempContainer.appendChild(this.list.childNodes[0]);
      }

      // add container to list
      this.list.appendChild(this.container);

      // append fragment to container
      this.container.appendChild(tempContainer);

      // apply styles
      this.list.style.overflow = 'scroll';
      this.list.style.paddingLeft = this.gutter;
      this.list.style.width = 'calc(100% + 2 * ' + this.gutter + ')';
      this.list.style.position = 'relative';
      this.list.style.left = '-' + this.gutter;
      this.container.style.width = count * width + 'px';
    }
  }, {
    key: 'destroyContainer',
    value: function destroyContainer() {
      this.list.style.overflow = 'initial';
      this.list.style.paddingLeft = 'initial';
      this.list.style.width = 'initial';
      this.list.style.position = 'initial';
      this.list.style.left = 'initial';
      this.container.style.width = 'auto';
    }
  }]);

  return ProjectsScroll;
}();

exports.default = ProjectsScroll;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SplashController = function () {
  function SplashController(animSettings) {
    var _this = this;

    _classCallCheck(this, SplashController);

    this.elements = {
      splash: {
        silhouette: document.querySelector('.splash__silhouette'),
        title: document.querySelector('.splash__title'),
        bg: document.querySelector('.splash__bg'),
        arrow: document.querySelector('.splash__arrow')
      },
      projects: {
        container: document.querySelector('.projects--main'),
        title: document.querySelector('.projects--main .section-title'),
        list: document.querySelector('.projects--main .projects__list')
      }
    };
    this.animSettings = animSettings ? animSettings : {
      duration: 500,
      easing: 'ease-out',
      delay: 0,
      iterations: 1,
      direction: 'normal',
      fill: 'forwards'
    };

    this.elements.projects.title.style.opacity = 0;
    this.elements.projects.list.style.opacity = 0;

    this.elements.splash.arrow.addEventListener('click', this.scrollHandler);

    var waypoint = new Waypoint({
      element: this.elements.projects.title,
      handler: function handler(direction) {
        if (direction === 'down') {
          _this.hideSplashContent();
          _this.showProjectsContent();
        } else {
          _this.showSplashContent();
          _this.hideProjectsContent();
        }
      },
      offset: '90%'
    });
  }

  _createClass(SplashController, [{
    key: 'scrollHandler',
    value: function scrollHandler() {
      setTimeout(function () {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }, 100);
    }
  }, {
    key: 'hideSplashContent',
    value: function hideSplashContent() {
      this.animSettings.delay = 0;
      this.elements.splash.silhouette.animate([{ transform: 'scale(1) translateX(-50%)', opacity: 1, offset: 0 }, { transform: 'scale(.9) translateX(-50%)', opacity: 0, offset: 1 }], this.animSettings);
      this.elements.splash.title.animate([{ opacity: 1, offset: 0 }, { opacity: 0, offset: 1 }], this.animSettings);
      this.elements.splash.bg.animate([{ opacity: 1, offset: 0 }, { opacity: 0, offset: 1 }], this.animSettings);
      this.elements.splash.arrow.animate([{ opacity: 1, offset: 0 }, { opacity: 0, offset: 1 }], this.animSettings);
      this.elements.splash.arrow.style.pointerEvents = 'none';
    }
  }, {
    key: 'showSplashContent',
    value: function showSplashContent() {
      this.animSettings.delay = 0;
      this.elements.splash.silhouette.animate([{ transform: 'scale(.9) translateX(-50%)', opacity: 0, offset: 0 }, { transform: 'scale(1) translateX(-50%)', opacity: 1, offset: 1 }], this.animSettings);
      this.elements.splash.title.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }], this.animSettings);
      this.elements.splash.bg.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }], this.animSettings);
      this.elements.splash.arrow.animate([{ opacity: 0, offset: 0 }, { opacity: 1, offset: 1 }], this.animSettings);
      this.elements.splash.arrow.style.pointerEvents = 'initial';
    }
  }, {
    key: 'showProjectsContent',
    value: function showProjectsContent() {
      this.animSettings.delay = 100;
      this.elements.projects.title.animate([{ transform: 'translateY(0px)', opacity: .5, offset: 0 }, { transform: 'translateY(0px)', opacity: 1, offset: 1 }], this.animSettings);
      this.animSettings.delay = 300;
      this.elements.projects.list.animate([{ transform: 'translateY(0px)', opacity: 0, offset: 0 }, { transform: 'translateY(0px)', opacity: 1, offset: 1 }], this.animSettings);
    }
  }, {
    key: 'hideProjectsContent',
    value: function hideProjectsContent() {
      this.animSettings.delay = 0;
      this.elements.projects.title.animate([{ transform: 'translateY(0px)', opacity: 1, offset: 0 }, { transform: 'translateY(40px)', opacity: 0, offset: 1 }], this.animSettings);
      this.elements.projects.list.animate([{ transform: 'translateY(40px)', opacity: 1, offset: 0 }, { transform: 'translateY(0px)', opacity: 0, offset: 1 }], this.animSettings);
    }
  }]);

  return SplashController;
}();

exports.default = SplashController;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoBG = function () {
  function VideoBG(selector) {
    _classCallCheck(this, VideoBG);

    this.selector = selector;
    this.el = document.querySelector(selector);
    this.videoEl = document.querySelector(selector + '__video');
    this.videoID = this.el ? this.el.getAttribute('data-video-id') : '';
    this.videoVars = {
      autoplay: 1,
      autohide: 1,
      controls: 0,
      rel: 0,
      loop: 1,
      playlist: this.videoID,
      showinfo: 0,
      iv_load_policy: 3,
      start: 127
    };

    if (this.videoEl !== null) {
      this.loadPlayer();
    }
  }

  _createClass(VideoBG, [{
    key: 'loadPlayer',
    value: function loadPlayer() {
      var _this = this;

      if (typeof YT == 'undefined' || typeof YT.Player == 'undefined') {
        // Add Youtube Video API script
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = function () {
          _this.onYoutubeReady();
        };
      } else {
        this.onYoutubeReady();
      }
    }
  }, {
    key: 'onYoutubeReady',
    value: function onYoutubeReady() {
      this.videoEl.id = 'ytplayer';
      this.player = new YT.Player('ytplayer', {
        videoId: 'VSEhrhzK830',
        playerVars: this.videoVars,
        events: {
          'onReady': this.onPlayerReady
        }
      });
    }
  }, {
    key: 'onPlayerReady',
    value: function onPlayerReady(event) {
      event.target.mute();
      event.target.playVideo();
    }
  }]);

  return VideoBG;
}();

exports.default = VideoBG;

},{}]},{},[3])

//# sourceMappingURL=maps/app.js.map
