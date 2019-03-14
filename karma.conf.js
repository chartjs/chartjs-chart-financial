const commonjs = require('rollup-plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');
const resolve = require('rollup-plugin-node-resolve');
const builds = require('./rollup.config');

module.exports = function(karma) {
	const args = karma.args || {};

	// Use the same rollup config as our dist files: when debugging (--watch),
	// we will prefer the unminified build which is easier to browse and works
	// better with source mapping. In other cases, pick the minified build to
	// make sure that the minification process (terser) doesn't break anything.
	const regex = args.watch ? /chartjs-chart-financia\.js$/ : /chartjs-chart-financial\.min\.js$/;
	const build = builds.filter(v => v.output.file.match(regex))[0];

	karma.set({
		browsers: ['chrome'],
		// Explicitly disable hardware acceleration to make image
		// diff more stable when ran on Travis and dev machine.
		// https://github.com/chartjs/Chart.js/pull/5629
		customLaunchers: {
			chrome: {
				base: 'Chrome',
				flags: [
					'--disable-accelerated-2d-canvas'
				]
			},
			firefox: {
				base: 'Firefox',
				prefs: {
					'layers.acceleration.disabled': true
				}
			}
		},
		frameworks: ['jasmine'],
		reporters: ['progress', 'kjhtml'],

		files: [
			'node_modules/luxon/build/global/luxon.js',
			'node_modules/chart.js/dist/Chart.js',
			'node_modules/chartjs-adapter-luxon/dist/chartjs-adapter-luxon.js',
			'test/index.js',
			'src/index.js'
		].concat(args.inputs),
		preprocessors: {
			'test/specs/**/*.js': ['rollup'],
			'test/index.js': ['rollup'],
			'src/index.js': ['sources']
		},
		rollupPreprocessor: {
			plugins: [
				resolve(),
				commonjs()
			],
			external: [
				'chart.js'
			],
			output: {
				format: 'umd',
				globals: {
					'chart.js': 'Chart'
				}
			}
		},
		customPreprocessors: {
			sources: {
				base: 'rollup',
				options: build
			}
		},
		browserify: {
			debug: true
		}
	});

	// https://swizec.com/blog/how-to-run-javascript-tests-in-chrome-on-travis/swizec/6647
	if (process.env.TRAVIS) {
		karma.customLaunchers.chrome.flags.push('--no-sandbox');
	}

	if (args.coverage) {
		karma.reporters.push('coverage');
		karma.coverageReporter = {
			dir: 'coverage/',
			reporters: [
				{type: 'html', subdir: 'html'},
				{type: 'lcovonly', subdir: '.'}
			]
		};
		[
			karma.rollupPreprocessor,
			karma.customPreprocessors.sources.options
		].forEach(v => {
			(v.plugins || (v.plugins = [])).unshift(
				istanbul({
					include: 'src/**/*.js'
				}));
		});
	}
};
