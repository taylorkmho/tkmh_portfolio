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

// Ref: http://youmightnotneedjquery.com
export function hasClass(el, className) {
  return el.className && new RegExp("(\\s|^)" + className + "(\\s|$)").test(el.className);
}

// Ref: https://www.bramstein.com/writing/web-font-loading-patterns.html
export function timer(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, time);
  });
}