// Ref: http://youmightnotneedjquery.com
export function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    var currentClassName = el.className;
    el.setAttribute('class', currentClassName + ' ' + className);
  }
}

// Ref: http://youmightnotneedjquery.com
export function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.setAttribute('class', el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '));
  }
}