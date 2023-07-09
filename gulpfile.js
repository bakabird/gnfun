const gulp = require("gulp")
const ts = require('gulp-typescript');
const rollup = require('rollup');
const rename = require('gulp-rename')
const uglify = require("gulp-uglify");
const dts = require('dts-bundle');
const tsProject = ts.createProject('tsconfig.json', { declaration: true });

gulp.task('buildJs', () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('./build'));
})

gulp.task("rollup", async function () {
    let config = {
        input: "build/main.js",
        // external: [],
        output: {
            file: `./gnfun.mjs`,
            format: 'esm',
            extend: true,
            name: 'gnfun',
        },
    };
    const subTask = await rollup.rollup(config);
    await subTask.write(config.output);
});


//js文件打包
gulp.task("uglify", function () {
    return gulp.src(`./gnfun.mjs`)
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("./"));
});


gulp.task('buildDts', function () {
    return new Promise(function (resolve, reject) {
        dts.bundle({ name: "gnfun", main: "./build/main.d.ts", out: "../gnfun.d.ts" });
        resolve();
    });
})

gulp.task('build', gulp.series(
    'buildJs',
    'rollup',
    'uglify',
    'buildDts',
))