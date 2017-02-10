'use strict';

/********************************************************************
* DEPENDENCIES
*********************************************************************/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var strReplace = require('gulp-replace');
var rimraf = require('rimraf');


/********************************************************************
* GULP TASKS
*********************************************************************/
var lib = 'public/assets/js/*.js';
var output = 'build';
var packageName = 'core.js';

// [Task] removes 'src/'
gulp.task('clean', function(cb) {
  rimraf(output, cb);
});

// [Task] uglify js
gulp.task('build', function() {
  return gulp.src(lib)
    .pipe(strReplace(/'use strict';/g, ''))
    .pipe(concat(packageName))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(output));
});

// [Task] generates build
gulp.task('default', ['build']);
