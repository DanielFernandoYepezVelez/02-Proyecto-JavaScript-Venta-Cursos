const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

function css() {
    return gulp
        .src('./dev/scss/app.scss')
        .pipe(autoprefixer({
            overridebrowsersList: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass({
            outputStyle: 'expanded', // nested, compact, compressed
        }))
        .pipe(gulp.dest('./public/css/'));
}


// Registrar funciones como tareas
gulp.task('css', css)