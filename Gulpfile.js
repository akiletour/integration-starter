var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    notify = require("gulp-notify"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    bower = require('gulp-bower'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    twig = require('gulp-twig');

var config = {
    sassPath: './resources/sass',
    bowerPath: './bower_components',
    jsPath: './resources/js',
    htmlPath: './resources/html',
    cssPublicPath: './public/css',
    jsPublicPath: './public/js',
    fontPublicPath: './public/fonts',
    htmlPublicPath: './public'
};

gulp.task('bower', function () {
    return bower().pipe(gulp.dest(config.bowerPath));
});

gulp.task('template', function () {
    return gulp.src(config.htmlPath + '/*.html.twig')
        .pipe(twig())
        .pipe(rename(function (path) {
            path.extname = ''
        }))
        .pipe(gulp.dest(config.htmlPublicPath));
});

gulp.task('lib-js', function () {
    return gulp.src([
            config.bowerPath + '/jquery/dist/jquery.js',
            config.bowerPath + '/bootstrap-sass/assets/javascripts/bootstrap.js'
        ])
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsPublicPath))
        .pipe(livereload());
});

gulp.task('js', function () {
    return gulp.src([
            config.jsPath + '/app.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsPublicPath))
        .pipe(livereload());
});

gulp.task('icons', function () {
    return gulp.src([
            config.bowerPath + '/font-awesome/fonts/**.*',
            config.bowerPath + '/bootstrap-sass/assets/fonts/bootstrap/**.*'
    ])
        .pipe(gulp.dest(config.fontPublicPath));
});

gulp.task('css', function () {
    return sass(config.sassPath + '/style.scss', {
        style: 'compressed',
        loadPath: [
            config.sassPath,
            config.bowerPath + '/bootstrap-sass/assets/stylesheets',
            config.bowerPath + '/font-awesome/scss'
        ]
    })
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        }))
        .pipe(gulp.dest(config.cssPublicPath))
        .pipe(livereload());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(config.sassPath + '/**/*.scss', ['css']);
    gulp.watch(config.jsPath + '/**/*.js', ['js']);
    gulp.watch(config.htmlPath + '/**/*.html.twig', ['template']);
});

gulp.task('default', ['bower', 'icons', 'lib-js', 'js', 'css', 'template']);
