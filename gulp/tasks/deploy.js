var gulp    = require('gulp'),
    paths   = require('../config').paths,
    ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
  return gulp.src("./dist/**/*")
    .pipe(ghPages());
});