var gulp = require('gulp');
var gutil = require('gulp-util');
var istanbul = require('gulp-istanbul');
var printExample = require('./lib/print-example');

gulp.task('example',function(){
  printExample.logExample(require('./examples/basic-usage-examples'));
  printExample.logExample(require('./examples/col-and-row-span-examples'));
});

/**
 * Do NOT run this in the same commit when you are adding images.
 * Commit the images, then run this.
 */
gulp.task('example-md',['example-md-basic','example-md-advanced']);
gulp.task('example-md-basic',function(cb){
  printExample.mdExample(require('./examples/basic-usage-examples'),'basic-usage.md',cb);
});
gulp.task('example-md-advanced',function(cb){
  printExample.mdExample(require('./examples/col-and-row-span-examples'),'advanced-usage.md',cb);
});
