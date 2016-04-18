require('es6-shim');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
import { addClass, removeClass, nodeListShim } from "./lib/_helpers";
nodeListShim();

let Blazy              = require('blazy');
let ScrollMagic        = require('scrollmagic');

let blazy = new Blazy({
  selector: '.lazyload',
  successClass: 'lazyloaded',
  errorClass: 'lazyerrored',
  src: 'data-src',
  breakpoints: [{
    width: 768,
    src: 'data-src-small'
  }],
  success: function(ele, msg){
    console.log(ele);
  },
  error: function(ele, msg){
    if(msg === 'missing'){
      console.log(ele + ' was missing')
    }
    else if(msg === 'invalid'){
      console.log(ele + ' was invalid')
    }
  }
});

let controller = new ScrollMagic.Controller();

const projects = document.querySelectorAll('.project');
for (let el of projects) {
  var bgTween = TweenMax.fromTo(el, 1,
    {
      backgroundColor: "rgba(34,34,34,1)"
    },
    {
      backgroundColor: "rgba(34,34,34,0)"
    }
  );
  var screenTween = TweenMax.fromTo(el.querySelector('.project__screenshot'), 1,
    {
      scale: '1',
      rotation: '0'
    },
    {
      scale: '1.1',
      rotation: '4'
    }
  );
  let scene = new ScrollMagic.Scene(
      {
        triggerElement: el,
        duration: '25%'
      }
    )
    .setTween(bgTween)
    .addTo(controller);
  let scene02 = new ScrollMagic.Scene(
      {
        triggerElement: el,
        duration: '25%'
      }
    )
    .setTween(screenTween)
    .addTo(controller);
}