/* eslint-disable require-jsdoc */

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const jest = require("gulp-jest-acierto").default;
const rename = require("gulp-rename");
const rollup = require("rollup");
const shell = require("gulp-shell");
const sourcemaps = require("gulp-sourcemaps");
const terser = require("gulp-terser");

const jestBaseConfig = require("./jest.config.js");
const pkg = require("./package.json");

const intro = [
    "/**",
    "* @overview " + pkg.name + " - " + pkg.description,
    "* @author " + pkg.author.name + " <" + pkg.author.email + ">",
    "* @version " + pkg.version,
    "* @module lamb",
    "* @license " + pkg.license,
    "*/"
].join("\n");

const commonOptions = {
    banner: intro,
    exports: "named",
    freeze: false,
    name: "lamb",
    sourcemap: false,
    strict: true
};

const esOptions = Object.assign({}, commonOptions, {
    file: "dist/lamb.mjs",
    format: "esm"
});

const umdOptions = Object.assign({}, commonOptions, {
    file: "dist/lamb.js",
    format: "umd"
});

/* env */

gulp.task("set-test-env", cb => {
    process.env.NODE_ENV = "test";

    return cb();
});

/* build */

const builder = opts => () => rollup.rollup({ input: "src/index.js" }).then(bundle => bundle.write(opts));

const minifier = isES => () => gulp.src(`dist/lamb${isES ? ".mjs" : ".js"}`)
    .pipe(sourcemaps.init())
    .pipe(terser({ mangle: { module: isES }, output: { comments: "some" } }))
    .pipe(rename({ extname: isES ? ".min.mjs" : ".min.js" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));

gulp.task("bump", shell.task("bump package.json package-lock.json"));

gulp.task("build:es", gulp.series(builder(esOptions), minifier(true)));

gulp.task("build:umd", gulp.series(builder(umdOptions), minifier(false)));

gulp.task("build", gulp.series("bump", gulp.parallel("build:es", "build:umd")));

/* lint */

const lintWith = settings => () => gulp.src(settings.inputs)
    .pipe(eslint(settings.configPath))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

gulp.task("lint:code", lintWith({
    configPath: ".eslintrc.json",
    inputs: ["./src/**/*.js", "!./src/**/__{tests,mocks}__/**"]
}));

gulp.task("lint:tests", lintWith({
    configPath: ".eslintrc.test.json",
    inputs: ["./*.js", "./src/**/__{tests,mocks}__/**/*.js"]
}));

gulp.task("lint", gulp.series("lint:code", "lint:tests"));

/* test */

const testWith = extraSettings => gulp.series(
    "set-test-env",
    async () => gulp.src("./src", { read: false }).pipe(
        jest(Object.assign({}, jestBaseConfig, extraSettings))
    )
);

gulp.task("test", testWith({}));

gulp.task("test:coverage", testWith({ collectCoverage: true }));

gulp.task("test:verbose", testWith({ verbose: true }));

gulp.task("test:travis", testWith({ collectCoverage: true, maxWorkers: 4 }));

gulp.task("test:watch", testWith({ watch: true }));

/* travis */

gulp.task("travis", gulp.series("lint", "test:travis"));

/* default */

gulp.task("default", gulp.series("lint", "test:coverage"));
