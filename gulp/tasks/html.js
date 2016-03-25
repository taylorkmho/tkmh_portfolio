var gulp         = require('gulp'),
    data         = require('gulp-data'),
    fs           = require('fs'),
    paths        = require('../config').paths,
    errorHandler = require('../config').swallowError,
    jade         = require ('gulp-jade');

gulp.task('html', function() {
  return gulp.src(paths.src.html + "/**/[^_]*.jade")
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync(paths.src.data + '/content.json'));
    }))
    .pipe(jade())
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.dist.html))
});