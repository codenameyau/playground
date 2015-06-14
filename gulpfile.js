'use strict';

/********************************************************************
* DEPENDENCIES
*********************************************************************/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var strReplace = require('gulp-replace');


/********************************************************************
* GULP TASKS
*********************************************************************/
var playgroundFile = 'public/assets/js/playground.js';

// [Task] removes 'src/'
gulp.task('clean', function(cb) {
  rimraf('src/', cb);
});

// [Task] copy public files to src
gulp.task('src', function() {
  gulp.src(playgroundFile)
    .pipe(gulp.dest('src'));
});

// [Task] uglify js
gulp.task('uglify', function() {
  return gulp.src(playgroundFile)
    .pipe(strReplace(/'use strict';/g, ''))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src'));
});

// [Task] generates src
gulp.task('default', ['src', 'uglify']);
