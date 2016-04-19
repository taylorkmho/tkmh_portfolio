// Ref: https://jakearchibald.com/2014/iterators-gonna-iterate/
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
