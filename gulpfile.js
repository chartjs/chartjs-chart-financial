const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const {exec} = require('child_process');
const gulp = require('gulp');
const htmllint = require('gulp-htmllint');
const karma = require('karma');
const path = require('path');
const pkg = require('./package.json');
const yargs = require('yargs');

const srcDir = './src/';
const srcFiles = srcDir + '**.js';
const buildDir = './dist/';
const docsDir = './docs/';

const header = "/*!\n\
 * chartjs-chart-financial\n\
 * Version: {{ version }}\n\
 *\n\
 * Copyright 2017 chartjs-chart-financial contributors\n\
 * Released under the MIT license\n\
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md\n\
 */\n";

gulp.task('build', gulp.series(rollupTask, copyDistFilesTask));
gulp.task('lint-html', lintHtmlTask);
gulp.task('lint-js', lintJsTask);
gulp.task('lint', gulp.parallel('lint-html', 'lint-js'));
gulp.task('unittest', unittestTask);
gulp.task('test', gulp.parallel('lint', 'unittest'));
gulp.task('watch', watchTask);
gulp.task('default', gulp.parallel('build'));

const argv = yargs
  .option('force-output', {default: false})
  .option('silent-errors', {default: false})
  .option('verbose', {default: false})
  .argv;

function run(bin, args, done) {
  var exe = '"' + process.execPath + '"';
  var src = require.resolve(bin);
  var ps = exec([exe, src].concat(args || []).join(' '));

  ps.stdout.pipe(process.stdout);
  ps.stderr.pipe(process.stderr);
  ps.on('close', () => done());
}

function rollupTask(done) {
  run('rollup/dist/bin/rollup', ['-c'], done);
}

function copyDistFilesTask() {
  return gulp.src(buildDir + pkg.name + '.js')
    .pipe(gulp.dest(docsDir));
}

function lintJsTask() {
  var files = [
    'docs/**/*.html',
//    'docs/**/*.js',
    'src/**/*.js'
//    'test/**/*.js'
  ];

  // NOTE(SB) codeclimate has 'complexity' and 'max-statements' eslint rules way too strict
  // compare to what the current codebase can support, and since it's not straightforward
  // to fix, let's turn them as warnings and rewrite code later progressively.
  var options = {
    rules: {
      'complexity': [1, 10],
      'max-statements': [1, 30]
    }
  };

  return gulp.src(files)
    .pipe(eslint(options))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function lintHtmlTask() {
  return gulp.src('docs/**/*.html')
    .pipe(htmllint({
      failOnError: true,
    }));
}

function unittestTask(done) {
  new karma.Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: !argv.watch,
    args: {
      coverage: !!argv.coverage,
      inputs: (argv.inputs || 'test/specs/**/*.js').split(';'),
      watch: argv.watch
    }
  },
  function(error) {
    // https://github.com/karma-runner/gulp-karma/issues/18
    error = error ? new Error('Karma returned with the error code: ' + error) : undefined;
    done(error);
  }).start();
}

function watchTask() {
  return gulp.watch(srcFiles, ['build']);
}
