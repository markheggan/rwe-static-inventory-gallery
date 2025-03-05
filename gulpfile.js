const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const header = require("gulp-header");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const archiver = require("archiver");
const sourcemaps = require("gulp-sourcemaps");
const versionNumber = require("gulp-version-number");
const package = require("./package.json");

// Cache Bursting configuration
const cbConfig = {
  value: `${package.version}`,
  append: {
    key: "v",
    to: ["css", "js"],
  },
};

// Template for banner to add to file headers
const banner = {
  main: `/*! <%= package.name %> v<%= package.version %> | Copyright (c) 2011 - ${new Date().getFullYear()} <%= package.author.name %> | <%= package.author.url %> */`,
};

// New task to compile Pug files
function compilePug() {
  return gulp
    .src(
      "./src/html/**/[^_]*.pug", // Match .pug files that don't start with _
      "!./src/html/**/_*/" // Exclude any directory that starts with _
    )
    .pipe(
      pug({
        basedir: "./dist/",
        doctype: "html",
        pretty: true,
        // debug: true,
      })
    )
    .pipe(versionNumber(cbConfig))
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
}

// Task to process CSS files
function processCSS() {
  return gulp
    .src(["src/css/*.css"])
    .pipe(cleanCSS())
    .pipe(header(banner.main, { package: package }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

// Task to process JavaScript files
function processJS() {
  return gulp
    .src(["src/js/*.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(header(banner.main, { package: package }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
}

// Task to copy files from src/copy to dist/
function copyFiles() {
  return gulp
    .src("src/copy/**/*", { encoding: false })
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.stream());
}

// Task to compile .zip of dist/
function zipDist(cb) {
  const output = fs.createWriteStream(
    path.join(__dirname, `${package.name}-latest.zip`)
  );
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Compression level
  });

  output.on("close", function () {
    console.log(`${archive.pointer()} total bytes`);
    console.log("Zip file has been created.");
    cb();
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.directory("dist/", false);
  archive.finalize();
}

// BrowserSync server
function serve(cb) {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  cb();
}

// Watch task
function watch() {
  gulp.watch(["./src/html/**/*.pug"], compilePug);
  gulp.watch(["src/css/*.css"], processCSS);
  gulp.watch(["src/js/*.js"], processJS);
  gulp.watch(["src/copy/**/*"], copyFiles);
  gulp.watch("dist/").on("change", browserSync.reload);
}

// Serve task
exports.default = gulp.series(
  gulp.parallel(compilePug, processCSS, processJS, copyFiles),
  serve
);

// Default task
exports.build = gulp.series(
  gulp.parallel(compilePug, processCSS, processJS, copyFiles),
  zipDist
);

// Development task
exports.dev = gulp.series(
  gulp.parallel(compilePug, processCSS, processJS, copyFiles),
  serve,
  watch
);
