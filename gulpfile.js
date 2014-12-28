// Load plugins
var gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    vulcanize = require("gulp-vulcanize"),
    watch = require('gulp-watch'),
    connect = require('gulp-webserver'),
    fileinclude = require('gulp-file-include'),
    order = require('gulp-order'),
    plumber = require('gulp-plumber');


gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(
            connect({
                livereload: true,
                root: ['dist']//8000
            }));
});

// Styles
gulp.task('styles', function() {
    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(compass({
            sass: 'src/styles',
            css: 'dist/styles'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/styles'))
        //.pipe(connect.reload())
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/*.js')
        .pipe(plumber())
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
        //.pipe(connect.reload())
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('libScripts', function() {
    return gulp.src('src/scripts/libs/*.js')
        .pipe(plumber())
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(order([
            '**/handlebars-1.0.0.js',
            '**/ember.js',
            '**/*.js'
        ]))
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/scripts'))
        //.pipe(connect.reload())
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        /*.pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))*/
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist/images'))
        //.pipe(connect.reload())
        .pipe(notify({
            message: 'Images task complete'
        }));
});

// HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/'))
        //.pipe(livereload(server))
        .pipe(gulp.dest('dist'));

});

// Clean
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts'], {
            read: false
        })
        .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'libScripts', 'html', 'webserver', 'watch');
});

// Watch
gulp.task('watch', function() {

    //startExpress();

    // Listen on port 35729
    //server.listen(LIVERELOAD_PORT, function(err) {
    //  if (err) {
    //    return console.log(err);
    //}



    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/*.js', ['scripts']);

    gulp.watch('src/scripts/libs/*.js', ['libScripts']);

    // Watch image files
    //gulp.watch('src/images/**/*', ['images']);

    gulp.watch('src/*.html', ['html']);

    gulp.watch('src/*.hbs', ['html']);

    //gulp.watch('dist/*.html', ['livereload']);

    //        gulp.watch('dist/*.html',notifyLiveReload);

    //});

});
