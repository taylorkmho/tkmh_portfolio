var gulp              = require('gulp'),
    paths             = require('../config').paths;

gulp.task('gists', () => {
  gulp.src(`${paths.src.gists}/**/*`)
    .pipe(gulp.dest(paths.dist.gists))
})