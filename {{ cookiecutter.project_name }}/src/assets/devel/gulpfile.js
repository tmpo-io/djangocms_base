// Include gulp
var gulp = require('gulp');

var gutil = require('gulp-util');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber')



// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {
              gutil.beep();
              gutil.log( gutil.colors.red( err ) );
              this.emit('end');
            }
        }))
        .pipe(sass({includePaths: [
            './',
            './bower_components/'
        ]}))
        .pipe(gulp.dest('../css'))
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('../css'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', [ 'sass', 'watch']);
