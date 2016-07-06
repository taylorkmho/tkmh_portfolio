var gulp = require('gulp'),
  	runSequence = require('run-sequence');

// Build Production Files, the Default Task
gulp.task('default', function () {
  runSequence('clean', ['html', 'generateProjects', 'css', 'js', 'images', 'rootFiles'], 'watch');
});