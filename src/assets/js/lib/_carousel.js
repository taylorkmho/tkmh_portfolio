export default class Carousel {
  constructor(selector) {
    this.selector = selector
    if (document.querySelector(this.selector) !== null) {
      this.init()
    }
  }
  init() {
    this.el = document.querySelector(this.selector)
    let slider = new Wallop(this.el, {
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

    this.keyDownTextField = (e) => {
      var keyCode = e.keyCode;
      if (keyCode===37) {
        slider.previous()
      } else if (keyCode===39) {
        slider.next()
      }
    }
    document.addEventListener('keydown', this.keyDownTextField, false)
  }
  destroy() {
    document.removeEventListener('keydown', this.keyDownTextField)
  }
}