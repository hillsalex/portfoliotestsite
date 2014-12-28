var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-continuous-concat'),
    notify = require('gulp-notify'),
    vulcanize = require('gulp-vulcanize'),
    plumber = require('gulp-plumber');



//sass
gulp.task('default',function(){

	watch({glob:"src/styles/**/*.scss"})
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('./dist/css'));

	watch({glob:"src/js/**/*.js"})
		.pipe(plumber())
		//.pipe(uglify())
		.pipe(concat("app.min.js"))
		.pipe(gulp.dest('./dist/js'));

	watch({glob:"src/js/vendor/**/*.js"})
		.pipe(plumber())
		//.pipe(uglify())
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./dist/js'));

	watch({glob:"src/*.html"},function(){
		gulp.src('src/index.html')
		.pipe(plumber())
		.pipe(vulcanize({dest:'./dist/'}))
		.pipe(gulp.dest('./dist/'));
	});
});