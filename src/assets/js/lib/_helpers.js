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

// Ref: https://jakearchibald.com/2014/iterators-gonna-iterate/
export function nodeListShim() {
  NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
}