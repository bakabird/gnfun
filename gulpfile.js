const gulp = require("gulp")
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");
const dts = require('dts-bundle');
const tsProject = ts.createProject('tsconfig.json', { declaration: true });

gulp.task('buildJs', () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('./dest'));
})


//js文件打包
gulp.task('pack', (done) => {
    gulp.src('./dest/**/*.js')
        .pipe(concat("gnfun.min.js"))  //多个文件合并为一个文件，注：文件合并必须在babel之后
        .pipe(uglify()) //js代码压缩
        .pipe(gulp.dest('./'))
    done()
})

gulp.task('buildDts', function () {
    return new Promise(function (resolve, reject) {
        dts.bundle({ name: "gnfun", main: "./dest/main.d.ts", out: "../gnfun.d.ts" });
        resolve();
    });
})

gulp.task('build', gulp.series(
    'buildJs',
    'pack',
    'buildDts',
))