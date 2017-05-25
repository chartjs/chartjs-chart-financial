module.exports = function(karma) {
	var config = {
		browsers: ['Firefox'],
		files: ['./node_modules/chart.js/dist/Chart.js', './Chart.Financial.js', './test/**/*.js'],
		frameworks: ['browserify', 'jasmine'],
		reporters: ['progress', 'kjhtml'],
		preprocessors: {
			'./test/jasmine.index.js': ['browserify'],
			'./src/**/*.js': ['browserify']
		},
		browserify: {
			debug: true
		}
	};

	// If on the CI, use the CI chrome launcher
	if (process.env.TRAVIS) {
		config.browsers.push('Chrome_travis_ci');
		config.customLaunchers = {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		};
	} else {
		config.browsers.push('Chrome');
	}

	karma.set(config);
};
