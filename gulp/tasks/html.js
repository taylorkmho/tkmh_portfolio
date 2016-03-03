var gulp         = require('gulp'),
    paths        = require('../config').paths,
    errorHandler = require('../config').swallowError,
    jade         = require ('gulp-jade');

gulp.task('html', function() {
  return gulp.src(paths.src.html + "/**/[^_]*.jade")
    .pipe(jade()).on('error', errorHandler)
    .pipe(gulp.dest(paths.dist.html))
    .on('error', errorHandler);
});