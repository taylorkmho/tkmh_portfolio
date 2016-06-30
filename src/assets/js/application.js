import { addClass, removeClass, hasClass } from "./lib/_helpers";
require('./lib/_nodelist-shim');
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
  Skills animations in Intro section
  via GSAP library
*/

// UI/UX graphic in intro.css

// PROTOTYPING graphic (panel 2)
let tlHand = new TimelineMax({repeat: -1});
let hand = document.querySelector('.graphic--prototyping__hand');
tlHand.add( TweenLite.to(hand, .125, {scale:.9, transformOrigin:"center center"}) );
tlHand.add( TweenLite.to(hand, .25,  {scale:1}) );
tlHand.add( TweenLite.to(hand, 2.625, {scale:1}) );

let tlBox1 = new TimelineMax({repeat: -1});
let box1 = document.querySelector('.graphic--prototyping__box--01');
tlBox1.add(
  TweenMax.fromTo(box1, .25,
    {width:52, fill: '#555', stroke: '#bbb'},
    {width:86, fill: '#F24C27', stroke: '#F24C27', transformOrigin:"left center", delay: .125}
  )
);
tlBox1.add( TweenLite.to(box1, .25, {width:52, fill: '#555', stroke: '#bbb', delay: 2.75}) );
tlBox1.add( TweenLite.to(box1, 2.625, {width:52 }) );

let tlBox2 = new TimelineMax({repeat: -1});
let box2 = document.querySelector('.graphic--prototyping__box--02');
tlBox2.add( TweenLite.to(box2, .25, {x: '100%', opacity: 0, delay: .125}) );
tlBox2.add( TweenLite.to(box2, .25,  {x: '0%', opacity: 1, delay: 2.75}) );
tlBox2.add( TweenLite.to(box2, 2.625, {x: '0%'}) );

// DEVELOPMENT graphic (panel 3)
const graphicProjects = document.querySelectorAll('.graphic--development__device');
for (let el of graphicProjects) {
  let elBoxes = el.querySelectorAll('.graphic--development__boxes rect');
  let elScreen = el.querySelector('.graphic--development__screen');

  let tlDevice = new TimelineMax({repeat: -1});
  tlDevice.add( TweenLite.fromTo(elScreen, .25, {fill:'#F24C27'},{fill:'#fff', delay: 1}) );
  tlDevice.add( TweenLite.fromTo(elBoxes[0], .125, {y:'2px', opacity: 0}, {y:'0px', opacity: 1}) );
  tlDevice.add( TweenLite.fromTo(elBoxes[1], .125, {y:'2px', opacity: 0}, {y:'0px', opacity: 1}) );
  tlDevice.add( TweenLite.fromTo(elBoxes[2], .125, {y:'2px', opacity: 0}, {y:'0px', opacity: 1}) );
  tlDevice.add( TweenLite.to(elBoxes[0], .125, {fill:'#f24c27', stroke:'#f24c27', delay: 4}) );
  tlDevice.add( TweenLite.to(elBoxes[0], .25, {clearProps: 'fill,stroke'}) );
  tlDevice.add( TweenLite.to(elBoxes[1], .125, {y:'2px', opacity: 0}) );
  tlDevice.add( TweenLite.to(elBoxes[2], .125, {y:'2px', opacity: 0}) );
  tlDevice.add( TweenLite.to(elBoxes[0], .125, {y:'2px', opacity: 0}) );
  tlDevice.add( TweenLite.to(elScreen, .5, {fill:'#f24c27'}) );
}

/*
  "Phrase" swap-out for Footer section
*/
let footerPhrase = document.getElementById('footer-phrase');
if (footerPhrase) {
  const phraseArray = ['ARE WE MEANT TO BE?', 'YOUR TEAM + ME = AWESOME?', 'LET US BE ONE?', 'NEED A DIFFERENT OUTLOOK?', 'DOES YOUR TEAM NEED A &ldquo;ME&rdquo;?', 'DO I COMPLETE YOU(R TEAM)?', 'SHOULD WE DO THIS?', 'BECAUSE WHY NOT?', 'LET&rsquo;S DO THIS.', '&ldquo;WHAT A GREAT HIRE.&rdquo; – YOUR BOSS', 'FANCY A NEW TEAMMATE?', 'WHY NOT US? WHY NOT NOW?', 'I SEE YOU LOOKING.', 'WE SHOULD TRY THIS.', 'NEED A DESIGN-MINDED DEV?', 'HIRING A FRONT-END?', 'WANT A RESUMÉ?', 'LET&lsquo;S PUT &ldquo;U&rdquo; &amp; &ldquo;I&rdquo; TOGETHER.'];

  setInterval(()=>{
    TweenLite.fromTo(footerPhrase, 1, {opacity:'1'},{
      opacity: 0,
      onComplete: function() {
        TweenLite.to(footerPhrase, 0, {clearProps: 'opacity'});
        footerPhrase.innerHTML = phraseArray[Math.floor(Math.random()*phraseArray.length)];
      }
    })
  }, 6000)
}