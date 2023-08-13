const gulp  = require("gulp")
const ts = require('gulp-typescript');
const rollup = require('rollup');
const rename = require('gulp-rename')
const uglify = require("gulp-uglify");
const dts = require('dts-bundle');

// import gulp from "gulp"
// import ts from 'gulp-typescript'
// import rollup from 'rollup'
// import rename from 'gulp-rename'
// import uglify from "gulp-uglify"
// import dts from 'dts-bundle'

const tsMjsProject = ts.createProject('tsconfig.json', { declaration: true });
const tsCjsProject = ts.createProject('tsconfig-cjs.json', { declaration: true });

gulp.task('buildMjs', () => {    
    return tsMjsProject.src().pipe(tsMjsProject()).pipe(gulp.dest('./buildMjs'));
})

gulp.task('buildCjs', () => {    
    return tsCjsProject.src().pipe(tsCjsProject()).pipe(gulp.dest('./buildCjs'));
})

gulp.task("rollupMjs", async function () {
    let mjsConfig = {
        input: "buildMjs/main.js",
        // external: [],
        output: {
            file: `./gnfun.mjs`,
            format: 'esm',
            extend: true,
            name: 'gnfun',
        },
    };
    const mjsTask = await rollup.rollup(mjsConfig);
    await mjsTask.write(mjsConfig.output);
});

gulp.task("rollupCjs", async function () {
    let cjsConfig = {
        input: "buildMjs/main.js",
        // external: [],
        output: {
            file: `./gnfun.cjs`,
            format: 'cjs',
            extend: true,
            name: 'gnfun',
        },
    };
    const cjsTask = await rollup.rollup(cjsConfig);
    await cjsTask.write(cjsConfig.output);
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
        dts.bundle({ name: "gnfun", main: "./buildMjs/main.d.ts", out: "../gnfun.d.ts" });
        resolve();
    });
})

gulp.task('build', gulp.series(
    'buildMjs',
    'buildCjs',
    'rollupMjs',
    'rollupCjs',
    // 'uglify',
    'buildDts',
))

gulp.task('test', gulp.series(
    'buildMjs',
    'buildCjs',
))