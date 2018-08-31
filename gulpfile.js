/* eslint-disable require-jsdoc */

var gulp = require("gulp");
var eslint = require("gulp-eslint");
var jest = require("gulp-jest").default;
var rename = require("gulp-rename");
var rollup = require("rollup");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");

var jestBaseConfig = require("./jest.config");
var pkg = require("./package.json");

var intro = [
    "/**",
    "* @overview " + pkg.name + " - " + pkg.description,
    "* @author " + pkg.author.name + " <" + pkg.author.email + ">",
    "* @version " + pkg.version,
    "* @module lamb",
    "* @license " + pkg.license,
    "* @preserve",
    "*/"
].join("\n");

/* env */

gulp.task("set-test-env", cb => {
    process.env.NODE_ENV = "test";

    return cb();
});

/* build */

gulp.task("build", function () {
    return rollup.rollup({ input: "src/index.js" }).then(function (bundle) {
        return bundle.write({
            banner: intro,
            exports: "named",
            file: "dist/lamb.js",
            format: "umd",
            freeze: false,
            name: "lamb",
            sourcemap: false,
            strict: true
        });
    });
});

gulp.task("minify", gulp.series(
    "build",
    function () {
        return gulp.src("dist/lamb.js")
            .pipe(sourcemaps.init())
            .pipe(uglify({ output: { comments: "some" } }))
            .pipe(rename({ extname: ".min.js" }))
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
    };
}

gulp.task("lint:code", lintWith({
    configPath: ".eslintrc.json",
    inputs: ["./*.js", "./src/**/*.js", "!./src/**/__{tests,mocks}__/**"]
}));

gulp.task("lint:tests", lintWith({
    configPath: ".eslintrc.test.json",
    inputs: "./src/**/__{tests,mocks}__/**/*.js"
}));

gulp.task("lint", gulp.series("lint:code", "lint:tests"));

/* test */

function testWith (extraSettings) {
    return gulp.series(
        "set-test-env",
        function () {
            return gulp.src("./src").pipe(jest(Object.assign({}, jestBaseConfig, extraSettings)));
        }
    );
}

gulp.task("test", testWith({}));

gulp.task("test:coverage", testWith({ collectCoverage: true }));

gulp.task("test:verbose", testWith({ verbose: true }));

gulp.task("test:travis", testWith({ collectCoverage: true, maxWorkers: 4 }));

gulp.task("test:watch", testWith({ watch: true }));

/* travis */

gulp.task("travis", gulp.series("lint", "test:travis"));

/* default */

gulp.task("default", gulp.series("lint", "test:coverage"));
