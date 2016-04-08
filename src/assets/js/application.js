require('es6-shim');

let Blazy              = require('blazy');

export default class LazyLoader {
  constructor(selector, hoverSelector) {
    this.selector        = selector;
    this.hoverSelector   = hoverSelector;
    this.initBlazy();
  }
  initBlazy() {
    this.blazy = new Blazy({
      selector: this.selector,
      successClass: 'lazyloaded',
      errorClass: 'lazyerrored',
      success: (el) => {

      },
      error: (el) => {

      }
    });
  }
}

let lazyloader = new LazyLoader('.lazyload')