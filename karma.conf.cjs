const istanbul = require('rollup-plugin-istanbul');
const yargs = require('yargs');

module.exports = async function(karma) {
	const builds = (await import('./rollup.config.js')).default;

	const args = yargs
		.option('verbose', {default: false})
		.argv;

	// Use the same rollup config as our dist files: when debugging (npm run dev),
	// we will prefer the unminified build which is easier to browse and works
	// better with source mapping. In other cases, pick the minified build to
	// make sure that the minification process (terser) doesn't break anything.
	const regex = args.watch ? /chartjs-chart-financial\.js$/ : /chartjs-chart-financial\.min\.js$/;
	const output = builds[0].output.filter((v) => v.file.match(regex))[0];
	const build = Object.assign({}, builds[0], {output: output});
	const inputs = args.inputs || 'test/specs/**/*.js';

	if (args.coverage) {
		build.plugins.push(
			istanbul({exclude: ['node_modules/**/*.js', 'package.json']})
		);
	}

	karma.set({
		browsers: (args.browsers || 'chrome,firefox').split(','),
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
			'node_modules/chart.js/dist/chart.umd.js',
			'node_modules/chartjs-adapter-luxon/dist/chartjs-adapter-luxon.umd.js',
			'test/index.js',
			'src/index.js'
		].concat(inputs),
		preprocessors: {
			'test/specs/**/*.js': ['rollup'],
			'test/index.js': ['rollup'],
			'src/index.js': ['sources']
		},
		rollupPreprocessor: {
			external: [
				'chart.js',
				'chart.js/helpers',
				'chartjs-chart-financial',
			],
			output: {
				format: 'umd',
				globals: {
					'chart.js': 'Chart',
					'chart.js/helpers': 'Chart.helpers',
					'chartjs-chart-financial': 'Chart.Financial'
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

	if (args.coverage) {
		karma.reporters.push('coverage');
		karma.coverageReporter = {
			dir: 'coverage/',
			reporters: [
				{type: 'html', subdir: 'html'},
				{type: 'lcovonly', subdir: (browser) => browser.toLowerCase().split(/[ /-]/)[0]}
			]
		};
	}
};
