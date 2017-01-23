export default class ProjectsScroll {
  constructor(selector) {
    this.selector = selector
    this.el = document.querySelector(selector)
    this.mq = (matchMedia) ? window.matchMedia('(max-width: 479px)') : null
    this.list = this.el.querySelector('[class*="list"]')
    this.projects = this.el.querySelectorAll('.project')
    this.gutter = '32px'

    if (this.el !== null && this.mq) {
      this.mq.addListener(this.resizeHandler.bind(this))
      this.resizeHandler()
    }
  }
  resizeHandler() {
    if (this.mq.matches) {
      this.buildContainer()
    } else if (this.container !== undefined) {
      console.log(this.container)
      this.destroyContainer()
    }
  }
  buildContainer() {
    this.container = document.createElement('div')

    let tempContainer = document.createDocumentFragment(),
        count = this.projects.length,
        el = this.projects[0],
        width = el.getBoundingClientRect().width + parseInt(window.getComputedStyle(el)['margin-right'])

    // add projects to fragment
    while (this.list.childNodes.length > 0) {
      tempContainer.appendChild(this.list.childNodes[0])
    }

    // add container to list
    this.list.appendChild(this.container)

    // append fragment to container
    this.container.appendChild(tempContainer)

    // apply styles
    this.list.style.overflow = 'scroll'
    this.list.style.paddingLeft = this.gutter
    this.list.style.width = `calc(100% + 2 * ${this.gutter})`
    this.list.style.position = 'relative'
    this.list.style.left = `-${this.gutter}`
    this.container.style.width = `${count * width}px`
  }
  destroyContainer() {
    this.list.style.overflow = 'initial'
    this.list.style.paddingLeft = 'initial'
    this.list.style.width = 'initial'
    this.list.style.position = 'initial'
    this.list.style.left = 'initial'
    this.container.style.width = 'auto'
  }
}