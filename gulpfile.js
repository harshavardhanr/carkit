var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    watch     = require('gulp-watch'),
    util      = require('gulp-util');

gulp.task('default', ['watch', 'sass']);
gulp.task('build', ['sass']);

gulp.task('sass', function() {
  gulp.src('./www/scss/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./www/css'));
});

gulp.task('watch', function() {
  gulp.watch(['./www/scss/**/*.scss'], ['sass']);
})
