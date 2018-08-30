var fs = require("fs");
var gulp = require("gulp");
var pkg = require("./package.json");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");
var footer = require("gulp-footer");
var header = require("gulp-header");
var indent = require("gulp-indent");
var istanbul = require("gulp-istanbul");
var jasmine = require("gulp-jasmine");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");

var scripts = [
    "./src/core.js",
    "./src/privates.js",
    "./src/array_basics.js",
    "./src/logic.js",
    "./src/math.js",
    "./src/type.js",
    "./src/accessors.js",
    "./src/array.js",
    "./src/grouping.js",
    "./src/sort.js",
    "./src/function.js",
    "./src/object.js",
    "./src/object_checking.js",
    "./src/string.js"
];

/* build */

gulp.task("concat", function () {
    var intro = fs.readFileSync("./src/_intro.js", "utf8");
    var outro = fs.readFileSync("./src/_outro.js", "utf8");

    return gulp.src(scripts)
        .pipe(concat("lamb.js"), {newLine: "\n"})
        .pipe(indent({tabs: false, amount: 4}))
        .pipe(header(intro, {pkg: pkg}))
        .pipe(footer(outro, {pkg: pkg}))
        .pipe(gulp.dest("dist"));
});

gulp.task("minify", gulp.series(
    "concat",
    function () {
        return gulp.src("dist/lamb.js")
            .pipe(sourcemaps.init())
            .pipe(uglify({
                output: {comments: "some"}
            }))
            .pipe(rename({extname: ".min.js"}))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("dist"));
    }
));

/* lint */

function lintWith (settings) {
    return function () {
        return gulp.src(settings.inputs)
            .pipe(eslint(settings.configPath))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    }
}

gulp.task("lint:code", gulp.series("concat", lintWith({
    configPath: ".eslintrc.json",
    inputs: "./dist/lamb.js"
})));

gulp.task("lint:tests", lintWith({
    configPath: ".eslintrc.test.json",
    inputs: "./test/**"
}));

gulp.task("lint", gulp.series("lint:code", "lint:tests"));

/* test */

gulp.task("test", gulp.series("concat", function () {
    return gulp.src("./test/spec/*.js")
        .pipe(jasmine({
            includeStackTrace: true
        }));
}));

gulp.task("test:coverage", gulp.series("concat", function (cb) {
    gulp.src("./dist/lamb.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on("finish", function () {
            gulp.src("./test/spec/*.js")
                .pipe(jasmine())
                .pipe(istanbul.writeReports())
                .on("end", cb);
        });
}));

gulp.task("test:verbose", gulp.series("concat", function () {
    return gulp.src("./test/spec/*.js")
        .pipe(jasmine({
            includeStackTrace: true,
            verbose: true
        }));
}));

/* travis */

gulp.task("travis", gulp.series("concat", "lint", "test", "minify"));

/* default */

gulp.task("default", gulp.series("concat", "lint", "test:coverage", "minify"));
