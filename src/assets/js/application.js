'use strict';

import { addClass, removeClass, hasClass } from "./lib/_helpers";
import Carousel from "./lib/_carousel";
let Blazy              = require('blazy');

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
  Animating in text in Short Bio section
*/

let removeFontsStandby = () => {
  removeClass(document.documentElement, 'standby-for-fonts');
}

let fontsActiveCallback = () => {
  removeFontsStandby();
}

try{
  Typekit.load({
    async: true,
    active: fontsActiveCallback,
    inactive: removeFontsStandby
  });
}
catch(e){
  removeFontsStandby();
}

setTimeout(()=>{
  removeFontsStandby();
},3000)

/*
  Projects - Image Carousel
*/

let carousel = new Carousel('.showcase');

/*
  Projects modal
*/

$('a[data-modal="iframe"]').magnificPopup({
  disableOn: 700,
  type: 'iframe',
  mainClass: 'is-active',
  preloader: false,

  fixedContentPos: false
});

$('a[data-modal="carousel"]').magnificPopup({
  type: 'inline',
  mainClass: 'is-active',
  closeBtnInside: false,
  callbacks: {
    elementParse: function(item) {
      let data = JSON.parse(item.el.attr('data-content'));
      const buildCarouselImages = (imageArray) => {
        let images = '';
        imageArray.forEach((image)=>{
          images += '<img class="Wallop-item" src=' + image + '>';
        })
        return images;
      }
      const buildCarouselPag = (imageArray) => {
        let images = '';
        imageArray.forEach((image)=>{
          images += '<a class="Wallop-pagination__option" href="#"><img src=' + image + '></a>';
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
                '<a class="Wallop-pagination__arrow Wallop-pagination__arrow--prev"><img src="assets/images/svg/icon-arrow.svg" /></a>' +
                buildCarouselPag(data.imagesList) +
                '<a class="Wallop-pagination__arrow Wallop-pagination__arrow--next"><img src="assets/images/svg/icon-arrow.svg" /></a>' +
              '</div>' + //Wallop-pagination
            '</div>' + // showcase__images
            '<div class="showcase__description">' +
              '<h3>' +
                data.name +
                '<b>'+
                  data.type +
                '</b>'+
              '</h3>' +
              '<p>' +
                data.description +
              '</p>' +
              '<a class="btn btn--filled btn--filled-primary" href="' + data.url + '" target="_blank">View site</a>' +
            '</div>' + // showcase__description
          '</div>' + // showcase__container
        '</div>' // showcase
    },
    open: function() {
      carousel.init()
    }
  }
})