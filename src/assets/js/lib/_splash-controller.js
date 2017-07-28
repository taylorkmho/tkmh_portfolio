export default class SplashController {
  constructor(animSettings) {
    this.elements = {
      splash: {
        silhouette: document.querySelector('.splash__silhouette'),
        title: document.querySelector('.splash__title'),
        bg: document.querySelector('.splash__bg'),
        arrow: document.querySelector('.splash__arrow')
      },
      projects: {
        container: document.querySelector('.projects--main'),
        title: document.querySelector('.projects--main .section-title'),
        list: document.querySelector('.projects--main .projects__list')
      }
    }
    this.animSettings = animSettings ? animSettings : {
      duration: 500,
      easing: 'ease-out',
      delay: 0,
      iterations: 1,
      direction: 'normal',
      fill: 'forwards'
    }

    this.elements.projects.title.style.opacity = 0
    this.elements.projects.list.style.opacity = 0

    this.elements.splash.arrow.addEventListener('click', this.scrollHandler)

    let waypoint = new Waypoint({
      element: this.elements.projects.title,
      handler: (direction) => {
        if (direction === 'down') {
          this.hideSplashContent()
          this.showProjectsContent()
        } else {
          this.showSplashContent()
          this.hideProjectsContent()
        }
      },
      offset: '90%'
    })

  }
  scrollHandler() {
    setTimeout(()=>{
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }, 100)
  }
  hideSplashContent() {
    this.animSettings.delay = 0
    this.elements.splash.silhouette.animate([
      { transform: 'scale(1) translateX(-50%)', opacity: 1, offset: 0 },
      { transform: 'scale(.9) translateX(-50%)', opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.title.animate([
      { opacity: 1, offset: 0 },
      { opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.bg.animate([
      { opacity: 1, offset: 0 },
      { opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.arrow.animate([
      { opacity: 1, offset: 0 },
      { opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.arrow.style.pointerEvents = 'none'
  }
  showSplashContent() {
    this.animSettings.delay = 0
    this.elements.splash.silhouette.animate([
      { transform: 'scale(.9) translateX(-50%)', opacity: 0, offset: 0 },
      { transform: 'scale(1) translateX(-50%)', opacity: 1, offset: 1 }
    ], this.animSettings)
    this.elements.splash.title.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 },
    ], this.animSettings)
    this.elements.splash.bg.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 }
    ], this.animSettings)
    this.elements.splash.arrow.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 }
    ], this.animSettings)
    this.elements.splash.arrow.style.pointerEvents = 'initial'
  }
  showProjectsContent() {
    this.animSettings.delay = 100
    this.elements.projects.title.animate([
      {  transform: 'translateY(0px)', opacity: .5, offset: 0 },
      {  transform: 'translateY(0px)', opacity: 1, offset: 1 }
    ], this.animSettings)
    this.animSettings.delay = 300
    this.elements.projects.list.animate([
      {  transform: 'translateY(0px)', opacity: 0, offset: 0 },
      {  transform: 'translateY(0px)', opacity: 1, offset: 1 }
    ], this.animSettings)
  }
  hideProjectsContent() {
    this.animSettings.delay = 0
    this.elements.projects.title.animate([
      {  transform: 'translateY(0px)', opacity: 1, offset: 0 },
      {  transform: 'translateY(40px)', opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.projects.list.animate([
      {  transform: 'translateY(40px)', opacity: 1, offset: 0 },
      {  transform: 'translateY(0px)', opacity: 0, offset: 1 }
    ], this.animSettings)
  }
}
