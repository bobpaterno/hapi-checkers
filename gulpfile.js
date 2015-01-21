var gulp = require('gulp');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var less = require('gulp-less');

gulp.task('jade2html', function(){
  gulp.src('./app/*.jade')
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest('./app/'))
});

gulp.task('clean', function(callback){
  return gulp.src("./app/*.html", {read:false})
  .pipe(clean());
});

gulp.task('less2css', function(){
  gulp.src('./app/css/*.less')
      .pipe(less())
      .pipe(gulp.dest('./app/css'));
});

gulp.task('html', ['clean', 'jade2html', 'less2css'], function(){
  console.log("default");
});
