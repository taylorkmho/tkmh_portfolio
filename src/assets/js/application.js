'use strict';

import { addClass, removeClass, hasClass, timer } from "./lib/_helpers";
import Carousel from "./lib/_carousel";
import VideoBG from "./lib/_video-bg";
let Blazy              = require('blazy');
let FontFaceObserver              = require('fontfaceobserver');


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
  Splash - Intro animation
*/
if (window.innerWidth >= 768) {
  let controller  = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: 'onEnter'
    }
  });

  let splashTitleEl = $('.splash__title');
  var splashTitleAnim = TweenMax.to(splashTitleEl, 1, {
    y: '-20%'
  });
  let splashTitleScene = new ScrollMagic.Scene({
    triggerElement: splashTitleEl,
    duration: splashTitleEl.innerHeight()
  })
    .setTween(splashTitleAnim)
    .addTo(controller);

  $('.intro__column').each(function(index, element){
    let tween = TweenMax.to(element, 1, { y: -200/(index+2) + '%' });
    let scene = new ScrollMagic.Scene({
      triggerElement: element,
      triggerHook: 'onEnter',
      duration: '300%'
    })
      .setTween(tween)
      .addTo(controller);
  });

  $('.projects--main .project').each(function(index, element){
    let fromVars = {}
    var position = (index % 3) + 1;
    if (position === 1) {
      fromVars['x'] = -100
      fromVars['rotation'] = 15
    } else if (position === 3) {
      fromVars['x'] = 100
      fromVars['rotation'] = -15
    }

    let tween = TweenLite.from(element, 1, fromVars);
    let scene = new ScrollMagic.Scene({
      triggerElement: element,
      duration: element.offsetHeight * 1.5
    })
      .setTween(tween)
      .addTo(controller);
  });

  $('.projects--snippets .project').each(function(index, element){
    let fromVars = {}
    var position = (index % 4) + 1;
    if (position === 1) {
      fromVars['x'] = -100
      fromVars['rotation'] = 15
    } else if (position === 2) {
      fromVars['x'] = -5
    } else if (position === 3) {
      fromVars['x'] = 5
    } else if (position === 4) {
      fromVars['x'] = 100
      fromVars['rotation'] = -15
    }

    let tween = TweenLite.from(element, 1, fromVars);
    let scene = new ScrollMagic.Scene({
      triggerElement: element,
      duration: element.offsetHeight * 1.5
    })
      .setTween(tween)
      .addTo(controller);
  });

  let contactBGEl = $('.contact__bg');
  var contactBGAnim = TweenMax.from(contactBGEl, 1, {
    y: -20 + '%'
  });
  let contactBGScene = new ScrollMagic.Scene({
      triggerElement: $('.footer')[0],
      triggerHook: 'onEnter',
      duration: '100%'
  })
    .setTween(contactBGAnim)
    .addTo(controller);

  let contactContainerEl = $('.contact__container');
  var contactContainerAnim = TweenMax.from(contactContainerEl, 1, {
    y: 100 + '%',
    opacity: 0
  });
  let contactContainerScene = new ScrollMagic.Scene({
      triggerElement: $('.footer')[0],
      triggerHook: 'onEnter',
      duration: '60%'
  })
    .setTween(contactContainerAnim)
    .addTo(controller);

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
          console.log(image)
          images += '<a class="Wallop-pagination__option" href="#"><img src="/assets/images/projects/' + image + '--thumbnail.jpg"></a>';
        })
        return images;
      }
      // parse elements into modal content
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
              '<a class="btn btn--filled btn--filled-primary" href="' + data.url + '" target="_blank">View site</a>' +
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

let videoBG = new VideoBG('.video-bg');