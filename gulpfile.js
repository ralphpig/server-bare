var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var uglifyjs = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');

gulp.task("default", ["clean", "buildProduction"]);
gulp.task("staging", ["clean", "buildStaging"]);

gulp.task("clean", function () {
   return del("dist");
});

gulp.task("buildProduction", ["clean"], function () {
   gulp.src(["**/*.js", "!**/*.min.js", "!flightplan.js", "!gulpfile.js", "!node_modules/**/*.js"])
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(uglifyjs())
      .pipe(gulp.dest('dist'));

      buildCommon();
});

gulp.task("buildStaging", ["clean"], function () {
   gulp.src(["**/*.js", "!**/*.min.js", "!flightplan.js", "!gulpfile.js", "!node_modules/**/*.js"])
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(gulp.dest('dist'));

      buildCommon();
});

function buildCommon() {
   gulp.src([
      "**/*.min.js",
      "**/*.min.css",
      "package.json",
      "production.json",
      "staging.json",
      "nginx/default"
   ]).pipe(gulp.dest("dist"));

   gulp.src([
      "letsencrypt/*"
   ]).pipe(gulp.dest("dist/letsencrypt"));
}
