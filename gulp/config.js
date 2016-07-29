/*
  FILE PATHS
  ==============
*/

var paths = {
  base: {
    root:     '',
    src:      './src/',
    dist:     './dist/',
    tmp:      './tmp/'
  }
};

paths.src = {
  css:        paths.base.src + 'assets/css',
  js:         paths.base.src + 'assets/js',
  images:     paths.base.src + 'assets/images',
  data:       paths.base.src + 'assets/data',
  favicon:    paths.base.src + 'assets/favicon',
  gists:      paths.base.src + 'gists',
  html:       paths.base.src + 'html'
};

paths.dist = {
  css:        paths.base.dist + 'assets/css',
  fonts:      paths.base.dist + 'assets/fonts',
  js:         paths.base.dist + 'assets/js',
  images:     paths.base.dist + 'assets/images',
  gists:      paths.base.dist + 'gists',
  favicon:    paths.base.dist,
  html:       paths.base.dist
};

/*
  ERROR HANDLING
  ==============
*/

function swallowError (error) {
  //If you want details of the error in the console
  console.log(error.toString());

  // Optional Beep
  process.stdout.write('\x07');
  this.emit('end');
}

/*
  BROWSER REQUIREMENTS
  ====================
*/

var browserReqs = ['last 2 versions', 'ie >= 9'];

module.exports = { paths, swallowError, browserReqs };