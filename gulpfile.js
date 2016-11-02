'use strict';  
  
//引入 gulp 和 nodemon livereload 插件  
var gulp       = require('gulp');  
var nodemon    = require('gulp-nodemon');  
var livereload = require('gulp-livereload');  
var concat 		 = require('gulp-concat');
var sass 			 = require('gulp-sass');
var clean 		 = require('gulp-clean');

gulp.task('server', function () {
  nodemon({
		"restartable": "rs",
		"ignore": [
			".git",
			"node_modules/**/node_modules"
		],
		"verbose": false,
		"execMap": {
			"": "node",
			"js": "node --harmony"
		},
		"env": {
			"NODE_ENV": "development",
			"PORT": "4000"
		},
		"ext": "js json jade",
		"legacy-watch": false
  })
})

gulp.task('lv', function() {
  gulp.src([
  			'public/images/**/*',
  			'public/scripts/**/*',
  			'views/**/*',
  			'routes/**/*',
  			'app/**/*'
  		])
  	.pipe(livereload())
});

gulp.task('sass', function(){
	return gulp.src('./public/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/tempcss'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles'))
		.pipe(livereload())
})

gulp.task('adminsass', function(){
	return gulp.src('./public/styles/admin/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/admintempcss'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles/admin'))
		.pipe(livereload())
})



gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(['public/styles/*.scss'], ['sass'])
	gulp.watch(['public/styles/admin/*.scss'], ['adminsass'])
	gulp.watch(['public/images/**/*', 'public/scripts/**/*', 'views/**/*', 'routes/**/*', 'app/**/*'], ['lv']);
});


gulp.task('default', ['server', 'sass', 'adminsass', 'watch']);  