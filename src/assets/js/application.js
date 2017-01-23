'use strict'

import { addClass, removeClass, hasClass, timer } from './lib/_helpers'
import Carousel from './lib/_carousel'
import ProjectsScroll from './lib/_projects-scroll'
import VideoBG from './lib/_video-bg'
import SplashController from './lib/_splash-controller'
let Blazy              = require('blazy')
let FontFaceObserver   = require('fontfaceobserver')

/*
  mobile test
*/
window.mobilecheck = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
if (window.mobilecheck()) {
  document.documentElement.classList.add('mobile-device')
}


/*
  .no-js management
*/
document.documentElement.classList.remove('no-js')

/*
  Font management
*/

// If fonts already loaded in session, add `fonts-loaded` class to document (1)
if (!sessionStorage.fontsLoaded) {
  let font = new FontFaceObserver('Heebo')
  // If font.load() fails takes longer than 2000ms (2),
  // OR if font.load() fails (3),
  //   add `fonts-error` class to document
  // If success (4),
  //   add `fonts-loaded` class to document
  Promise.race([
    timer(2000),
    font.load()
  ]).then(function () { /* (4) */
    sessionStorage.fontsLoaded = true;
    document.documentElement.classList.remove('fonts-standby')
    document.documentElement.classList.add('fonts-loaded')
  }, function(){ /* (3) */
    sessionStorage.fontsLoaded = false;
    document.documentElement.classList.remove('fonts-standby')
    document.documentElement.classList.add('fonts-error')
  }).catch(function () { /* (2) */
    sessionStorage.fontsLoaded = false;
    document.documentElement.classList.remove('fonts-standby')
    document.documentElement.classList.add('fonts-error')
  });
} else { /* (1) */
  document.documentElement.classList.remove('fonts-standby')
  document.documentElement.classList.add('fonts-loaded')
}

/*
  Image lazy-loading
  via blazy.js
*/

let blazy = new Blazy({
  selector: '.lazyload',
  successClass: 'lazyloaded',
  errorClass: 'lazyerrored',
  src: 'data-src',
  breakpoints: [{
    width: 768,
    src: 'data-src-small'
  }],
  success: (ele) => {
    if (ele.classList.contains('lazyload--invisible')) {
      ele.style.backgroundImage = ''
    }
  },
  error: (ele, msg) => {
    if(msg === 'missing'){
      console.log(ele + ' was missing')
    }
    else if(msg === 'invalid'){
      console.log(ele + ' was invalid')
    }
  }
});

/*
  Fade page on unload
*/
window.onbeforeunload = () => {
  $('body').css('opacity', 0)
  window.scrollTo(0, 0);
}

if (document.querySelector('.splash') && !window.mobilecheck()) {
  let splashController = new SplashController();
}
/*
  Projects - Image Carousel
*/

let carousel = new Carousel('.showcase');

/*
  Projects modal
*/

$('a[data-modal="carousel"]').magnificPopup({
  type: 'inline',
  mainClass: 'is-active',
  closeBtnInside: false,
  fixedContentPos: true,
  callbacks: {
    elementParse: function(item) {
      // build data via data-content attribute
      let data = JSON.parse(item.el.attr('data-content'));
      const buildCarouselImages = (imageArray) => {
        let images = '';
        imageArray.forEach((image)=>{
          images += '<img class="Wallop-item lazyload" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="/assets/images/projects/' + image + '.jpg">';
        })
        return images;
      }
      const buildCarouselPag = (imageArray) => {
        let images = '';
        imageArray.forEach((image)=>{
          images += '<a class="Wallop-pagination__option" href="#"><img src="/assets/images/projects/' + image + '--thumbnail.jpg"></a>';
        })
        return images;
      }
      // parse elements into modal content
      function getLink() {
        if (data.url) {
          return '<a class="btn btn--filled btn--filled-primary" href="' + data.url + '" target="_blank">View site</a>'
        } else {
          return ''
        }
      }
      item.src =
        '<div class="showcase">' +
          '<div class="showcase__container">' +
            '<div class="showcase__images">' +
              '<div class="Wallop"><div class="Wallop-list">' +
                buildCarouselImages(data.imagesList) +
              '</div></div>' + // Wallop, Wallop-list
              '<div class="Wallop-pagination">' +
                '<button class="Wallop-pagination__arrow Wallop-pagination__arrow--prev"><img src="assets/images/svg/icon-arrow.svg" /></a></button>' +
                buildCarouselPag(data.imagesList) +
                '<button class="Wallop-pagination__arrow Wallop-pagination__arrow--next"><img src="assets/images/svg/icon-arrow.svg" /></a></button>' +
              '</div>' + //Wallop-pagination
            '</div>' + // showcase__images
            '<div class="showcase__description">' +
              '<img src="/assets/images/svg/logo-' + data.abbr + '.svg" alt="' + data.name + ' logo" title="' + data.name + ' logo" />' +
              '<p>' +
                data.description +
              '</p>' +
              getLink() +
            '</div>' + // showcase__description
          '</div>' + // showcase__container
        '</div>' // showcase
    },
    open: function() {
      carousel.init();
      blazy.load(document.querySelectorAll('.Wallop-item'), true)
      let $that = $(this)
      // update history
      setTimeout(function(){
        history.pushState(null, document.title, $that[0].currItem.el[0].getAttribute('href'));
      },10)
      $(window).on('popstate', function(e) {
        if(e.originalEvent.state === null) { // initial page
          $.magnificPopup.close();
        }
      });

    },
    close: function() {
      carousel.destroy()
      // update history
      history.pushState(null, document.title, '/');
      $(window).off('popstate');
    }
  }
})

/*
  About video bg
*/

if (document.querySelector('.video-bg')) {
  let videoBG = new VideoBG('.video-bg')
}

/*
  Set height for mobile - Splash
*/

if (matchMedia) {
  let mq = window.matchMedia("(max-width: 767px)");
  mq.addListener(widthUpdateHandler);
  widthUpdateHandler(mq);
}

// media query change
function widthUpdateHandler(mq) {
  if (mq.matches) {
    $('.splash').css('height', $(window).height() - 16)
  } else {
    $('.splash').css('height', '')
  }
}

/*
  Projects horizontal scroll
  - for mobile (<480px)
*/

if (document.querySelector('.projects--main')) {
  let scrollMainProjects = new ProjectsScroll('.projects--main')
}