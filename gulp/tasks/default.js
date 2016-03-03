var gulp = require('gulp'),
  	runSequence = require('run-sequence');

// Build Production Files, the Default Task
gulp.task('default', function () {
  // runSequence('clean', ['fileinclude', 'copy', 'images', 'styles']);
  runSequence('clean', ['html', 'css', 'js', 'images'], 'watch');
});