var gulp = require('gulp');
var printExample = require('./lib/print-example');

gulp.task('example',function(){
  printExample.logExample(require('./examples/basic-usage-examples'));
  printExample.logExample(require('./examples/col-and-row-span-examples'));
});
