var gulp         = require('gulp'),
    paths        = require('../config').paths;

gulp.task('cname', function() {
  gulp.src(paths.base.src + "/CNAME")
    .pipe(gulp.dest(paths.base.dist));
})