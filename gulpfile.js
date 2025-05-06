const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const fs = require('fs');
const path = require('path');
const gulpIf = require('gulp-if');

const paths = {
    html: 'app/**/*.html',
    css: 'app/css/**/*.css',
    js: 'app/js/**/*.js',
    dest: 'prod',
};

const isDev = process.env.NODE_ENV !== 'production';

function validateHTML() {
    return gulp.src(paths.html)
        .pipe(connect.reload());
}

function validateCSS() {
    return gulp.src(paths.css)
        .pipe(stylelint({ reporters: [{ formatter: 'string', console: true }] }));
}

function validateJS() {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format());
}

function compressHTML() {
    return gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dest));
}

function compressCSS() {
    return gulp.src(paths.css)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${paths.dest}/css`));
}

function compressJS() {
    return gulp.src(paths.js)
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(uglify())
        .pipe(gulp.dest(`${paths.dest}/js`));
}

function transpileJSForDev() {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/js'))
        .pipe(connect.reload());
}

function transpileJSForProd() {
    return compressJS();
}

function clean(done) {
    const target = path.resolve(paths.dest);
    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
    }
    done();
}


// DEV TASK
function dev() {
    connect.server({ livereload: true, root: 'app' });

    gulp.watch(paths.html, gulp.series(validateHTML));
    gulp.watch(paths.css, gulp.series(validateCSS));
    gulp.watch(paths.js, gulp.series(validateJS, transpileJSForDev));
}

// PROD TASK
const build = gulp.series(
    clean,
    gulp.parallel(validateHTML, validateCSS, validateJS),
    gulp.parallel(compressHTML, compressCSS, compressJS)
);

exports.validateHTML = validateHTML;
exports.validateCSS = validateCSS;
exports.validateJS = validateJS;
exports.compressHTML = compressHTML;
exports.compressCSS = compressCSS;
exports.compressJS = compressJS;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.dev = dev;
exports.build = build;
exports.default = dev;
