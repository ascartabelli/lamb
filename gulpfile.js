/* eslint-disable require-jsdoc */

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const jest = require("gulp-jest").default;
const rename = require("gulp-rename");
const rollup = require("rollup");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const jestBaseConfig = require("./jest.config");
const pkg = require("./package.json");

const intro = [
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

gulp.task("build", () => rollup
    .rollup({ input: "src/index.js" })
    .then(bundle => bundle.write({
        banner: intro,
        exports: "named",
        file: "dist/lamb.js",
        format: "umd",
        freeze: false,
        name: "lamb",
        sourcemap: false,
        strict: true
    }))
);

gulp.task("minify", gulp.series("build", () => gulp.src("dist/lamb.js")
    .pipe(sourcemaps.init())
    .pipe(uglify({ output: { comments: "some" } }))
    .pipe(rename({ extname: ".min.js" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"))
));

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
