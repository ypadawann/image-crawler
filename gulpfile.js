var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

const dist_dir = 'dist'
const src_dir = 'src'

gulp.task("typescript", function(){
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest(dist_dir + '/js'));
});

gulp.task('config', function(){
  return gulp.src(src_dir+'/crawler-config.json')
    .pipe(gulp.dest(dist_dir));
});

gulp.task("default", gulp.series(gulp.parallel('typescript', 'config')), function(){
});
