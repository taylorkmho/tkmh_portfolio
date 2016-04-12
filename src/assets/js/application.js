require('es6-shim');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
import { addClass, removeClass, nodeListShim } from "./lib/_helpers";
nodeListShim();

let Blazy              = require('blazy');
let ScrollMagic        = require('scrollmagic');

let blazy = new Blazy({
  selector: '.lazyload',
  successClass: 'lazyloaded',
  errorClass: 'lazyerrored'
});

let controller = new ScrollMagic.Controller();

const projects = document.querySelectorAll('.project');
for (let el of projects) {
  var mainTween = TweenMax.fromTo(el, 1,
    {
      backgroundColor: "rgba(34,34,34,1)"
    },
    {
      backgroundColor: "rgba(34,34,34,0)"
    }
  );
  var secondaryTween = TweenMax.fromTo(el.querySelector('.project__screenshot'), 1,
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
    .setTween(mainTween)
    .addTo(controller);
  let scene02 = new ScrollMagic.Scene(
      {
        triggerElement: el,
        duration: '25%'
      }
    )
    .setTween(secondaryTween)
    .addTo(controller);
}

// const projects = document.querySelectorAll('.project');
// for (let el of projects) {
//   let waypoint1 = new Waypoint({
//     element: el,
//     handler: function(direction) {
//       if (direction === 'down') {
//         addClass(el, 'is-active')
//       } else if (direction === 'up') {
//         removeClass(el, 'is-active')
//       }
//     },
//     offset: '75%'
//   })
//   let waypoint2 = new Waypoint({
//     element: el,
//     handler: function(direction) {
//       if (direction === 'down') {
//         removeClass(el, 'is-active')
//       } else if (direction === 'up') {
//         addClass(el, 'is-active')
//       }
//     },
//     offset: '-25%'
//   })
// }