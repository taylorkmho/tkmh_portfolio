var projects = document.querySelector('.projects');
var flkty = new Flickity(projects, {
  wrapAround: true,
  cellSelector: '.project',
  pageDots: false
});