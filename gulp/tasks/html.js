var gulp           = require('gulp'),
    data           = require('gulp-data'),
    fs             = require('fs'),
    paths          = require('../config').paths,
    errorHandler   = require('../config').swallowError,
    jade           = require('gulp-jade'),
    rename         = require('gulp-rename'),
    content        = require('../../src/assets/data/content.json');


gulp.task('html', function() {
  gulp.src(paths.src.html + "/**/[^_]*.jade")
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync(paths.src.data + '/content.json'));
    }))
    .pipe(jade())
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.dist.html))
});

gulp.task('generateProjects', function() {
  var projects = content.projects;
  projects.forEach((project)=>{
    gulp.src(paths.src.html + "/_project.jade")
      .pipe(data(function() {
        return { project: project };
      }))
      .pipe(jade())
      .pipe(rename(project.niceName + '.html'))
      .pipe(gulp.dest(paths.dist.html + '/projects'))
  })
})