
var fs = require("fs");
var gulp = require("gulp");
var pkg = require("./package.json");
var concat = require("gulp-concat");
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
    "./src/generics.js",
    "./src/logic.js",
    "./src/math.js",
    "./src/type.js",
    "./src/accessors.js",
    "./src/array.js",
    "./src/grouping.js",
    "./src/sort.js",
    "./src/function.js",
    "./src/object.js",
    "./src/string.js"
];

gulp.task("analysis", function (done) {
    // required here in an isolated task as plato loads jshint,
    // which uses shelljs that pollutes the String.prototype
    require("plato").inspect(scripts, "./plato_report", {title: "Lamb Analysis"}, function () {});
});

gulp.task("concat", function () {
    var intro = fs.readFileSync("./src/_intro.js", "utf8");
    var outro = fs.readFileSync("./src/_outro.js", "utf8");

    return gulp.src(scripts)
        .pipe(concat("lamb.js"), {newLine: "\n"})
        .pipe(indent({tabs: false, amount: 4}))
        .pipe(header(intro, {pkg: pkg}))
        .pipe(footer(outro, {pkg: pkg}))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("coverage", ["concat"], function (cb) {
    gulp.src("./dist/lamb.js")
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on("finish", function () {
            gulp.src("./test/spec/*.js")
                .pipe(jasmine())
                .pipe(istanbul.writeReports())
                .on("end", cb);
        });
});

gulp.task("minify", ["concat"], function () {
    return gulp.src("./dist/lamb.js")
        .pipe(sourcemaps.init())
        .pipe(uglify({
            preserveComments: "some"
        }))
        .pipe(rename({extname: ".min.js"}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("test", ["concat"], function () {
    return gulp.src("./test/spec/*.js")
        .pipe(jasmine({
            includeStackTrace: true
        }));
});

gulp.task("test-verbose", ["concat"], function () {
    return gulp.src("./test/spec/*.js")
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
});

gulp.task("default", ["concat", "minify", "coverage"]);
