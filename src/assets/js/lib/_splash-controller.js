export default class SplashController {
  constructor(animSettings) {
    this.elements = {
      splash: {
        silhouette: document.querySelector('.splash__silhouette'),
        title: document.querySelector('.splash__title'),
        bg: document.querySelector('.splash__bg')
      },
      projects: {
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
      offset: '75%'
    })
  }
  hideSplashContent() {
    this.animSettings.delay = 0
    this.elements.splash.silhouette.animate([
      { transform: 'scale(1)', opacity: 1, offset: 0 },
      { transform: 'scale(.9)', opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.title.animate([
      { opacity: 1, offset: 0 },
      { opacity: 0, offset: 1 }
    ], this.animSettings)
    this.elements.splash.bg.animate([
      { opacity: 1, offset: 0 },
      { opacity: 0, offset: 1 }
    ], this.animSettings)
  }
  showSplashContent() {
    this.animSettings.delay = 0
    this.elements.splash.silhouette.animate([
      { transform: 'scale(.95)', opacity: 0, offset: 0 },
      { transform: 'scale(1)', opacity: 1, offset: 1 }
    ], this.animSettings)
    this.elements.splash.title.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 },
    ], this.animSettings)
    this.elements.splash.bg.animate([
      { opacity: 0, offset: 0 },
      { opacity: 1, offset: 1 }
    ], this.animSettings)
  }
  showProjectsContent() {
    this.animSettings.delay = 250
    this.elements.projects.title.animate([
      {  transform: 'translateY(40px)', opacity: 0, offset: 0 },
      {  transform: 'translateY(0px)', opacity: 1, offset: 1 }
    ], this.animSettings)
    this.animSettings.delay = 500
    this.elements.projects.list.animate([
      {  transform: 'translateY(40px)', opacity: 0, offset: 0 },
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