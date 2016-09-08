var gulp = require('gulp'),
  	runSequence = require('run-sequence');

// Build Production Files, the Default Task
gulp.task('default', function () {
  runSequence('clean', ['html', 'generateProjects', 'gists', 'favicon', 'css', 'js', 'images', 'cname'], 'watch');
});