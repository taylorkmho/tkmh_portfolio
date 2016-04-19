require('es6-shim');
require('./lib/_nodelist-shim');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
import { addClass, removeClass } from "./lib/_helpers";

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
  error: function(ele, msg){
    if(msg === 'missing'){
      console.log(ele + ' was missing')
    }
    else if(msg === 'invalid'){
      console.log(ele + ' was invalid')
    }
  }
});

/*
  Projects scroll-based animations
  via ScrollMagic + its GSAP plug-in
*/

let ScrollMagic        = require('scrollmagic');

let controller = new ScrollMagic.Controller();

const projects = document.querySelectorAll('.project');
for (let el of projects) {
  var bgTween = TweenMax.fromTo(el, 1,
    { backgroundColor: "rgba(34,34,34,1)" },
    { backgroundColor: "rgba(34,34,34,0)" }
  );
  let scene = new ScrollMagic.Scene(
      {
        triggerElement: el,
        duration: '25%'
      }
    )
    .setTween(bgTween)
    .addTo(controller);

  var screenTween = TweenMax.fromTo(el.querySelector('.project__screenshot'), 1,
    { scale: '1',   rotation: '0' },
    { scale: '1.1', rotation: '4' }
  );

  let scene02 = new ScrollMagic.Scene(
      {
        triggerElement: el,
        duration: '25%'
      }
    )
    .setTween(screenTween)
    .addTo(controller);
}

/*
  Projects scroll-based animations
  via GSAP library
*/

let tlHand = new TimelineMax({repeat: -1});
let hand = document.querySelector('.graphic--prototyping__hand');
tlHand.add( TweenLite.to(hand, .125, {scale:.9, transformOrigin:"center center"}) );
tlHand.add( TweenLite.to(hand, .25,  {scale:1}) ); // 2.25
tlHand.add( TweenLite.to(hand, 2.625, {scale:1}) ); // 4.5
// start over

let tlBoxes = new TimelineMax({repeat: -1});
let box1 = document.querySelector('.graphic--prototyping__box--01');
tlBoxes.add( TweenLite.to(box1, .25,  {scaleX:2, transformOrigin:"left center", delay: .125}) );
tlBoxes.add( TweenLite.to(box1, .25,  {scaleX:1, delay: 2.75}) );
tlBoxes.add( TweenLite.to(box1, 2.625, {scaleX:1}) );

let box2 = document.querySelector('.graphic--prototyping__box--02');
// start over




