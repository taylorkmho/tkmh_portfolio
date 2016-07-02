import { addClass, removeClass, hasClass } from "./lib/_helpers";
let Blazy              = require('blazy');

/*
  Killing hover on scroll
*/
window.addEventListener('scroll', function() {
  clearTimeout(timer);
  if (!hasClass(document.body, 'disable-hover')) {
    addClass(document.body, 'disable-hover')
  }

  let timer = setTimeout(function(){
    removeClass(document.body, 'disable-hover')
  }, 500);
}, false);

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
  Projects modal
*/

$('.project > a').magnificPopup({
  type: 'inline',
  mainClass: 'is-active',
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
        '<div class="modal">' +
          '<div class="modal__container">' +
            '<div class="modal__images">' +
              '<div class="Wallop"><div class="Wallop-list">' +
                buildCarouselImages(data.imagesList) +
              '</div></div>' + // Wallop, Wallop-list
              '<div class="Wallop-pagination">' +
                '<a class="Wallop-pagination__arrow Wallop-pagination__arrow--prev"><img src="assets/images/svg/icon-arrow.svg" /></a>' +
                buildCarouselPag(data.imagesList) +
                '<a class="Wallop-pagination__arrow Wallop-pagination__arrow--next"><img src="assets/images/svg/icon-arrow.svg" /></a>' +
              '</div>' + //Wallop-pagination
            '</div>' + // modal__images
            '<div class="modal__description">' +
              '<h3>' +
                data.name +
              '</h3>' +
              '<p>' +
                data.description +
              '</p>' +
            '</div>' + // modal__description
          '</div>' + // modal__container
        '</div>' // modal
    },
    open: () => {
      // init slider
      let wallopEl = document.querySelector('.modal');
      let slider = new Wallop(wallopEl, {
        buttonPreviousClass: 'Wallop-pagination__arrow--prev',
        buttonNextClass: 'Wallop-pagination__arrow--next'
      });

      // add `click` to pagination items
      let pagEls = Array.from(document.querySelectorAll('.Wallop-pagination__option'))
      pagEls.forEach((pagEl, index)=>{
        if (index === 0) {
          pagEl.classList.add('is-active')
        }
        pagEl.addEventListener('click', (event)=>{
          event.preventDefault()
          slider.goTo(index)
        }, false)
      })
      slider.on('change', function(event) {
        pagEls.forEach((el, index)=>{
          if (index !== event.detail.currentItemIndex) {
            el.classList.remove('is-active')
          } else {
            el.classList.add('is-active')
          }
        })
      });

    }
  }
})