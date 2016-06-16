var gulp = require("gulp"),
  concat = require("gulp-concat"),
  src = {css: "src/styles/*.css", js: "src/scripts/*.js"},
  dest = "public/";

gulp.task("css", () => gulp.src(src.css).pipe(concat("style.css")).pipe(gulp.dest(dest)));
gulp.task("js", () => gulp.src(src.js).pipe(concat("client.js")).pipe(gulp.dest(dest)));

gulp.task("default", ["js", "css"]);
gulp.task("watch", ["default"], function(){
  gulp.watch(src.js, ["js"]);
  gulp.watch(src.css, ["css"]);
});
