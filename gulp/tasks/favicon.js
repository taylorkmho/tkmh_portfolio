var gulp              = require('gulp'),
    paths             = require('../config').paths;

gulp.task('favicon', () => {
  gulp.src(`${paths.src.favicon}/**/*`)
    .pipe(gulp.dest(paths.dist.favicon))
})