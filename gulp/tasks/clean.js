var gulp       = require('gulp'),
    paths      = require('../config').paths,
    fs         = require('fs');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath;
      curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        return deleteFolderRecursive(curPath);
      } else {
        return fs.unlinkSync(curPath);
      }
    });
    return fs.rmdirSync(path);
  }
};

gulp.task('clean', function() {
  deleteFolderRecursive(paths.base.dist);
  deleteFolderRecursive(paths.base.tmp);
});