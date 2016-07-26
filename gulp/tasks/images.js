var gulp              = require('gulp'),
    imageResize       = require('gulp-image-resize'),
    rename            = require('gulp-rename'),
    errorHandler      = require('../config').swallowError,
    paths             = require('../config').paths;

gulp.task('images', function() {
  gulp.src(paths.src.images + "/**/*.{gif,jpg,png,svg}")
    .pipe(gulp.dest(paths.dist.images));

  const SCREENSHOT_RESIZE_SETTINGS = {
    height: 180,
    crop: false,
    upscale : false
  }
  gulp.src(paths.src.images + "/projects/*.jpg")
    .pipe(imageResize(SCREENSHOT_RESIZE_SETTINGS))
    .pipe(rename((path)=>{
      path.basename += "--thumbnail"
    }))
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.dist.images + '/projects'));
});