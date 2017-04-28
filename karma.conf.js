module.exports = function(config) {
	var configuration = {
		browsers: ['Firefox'],
		files: ['./node_modules/chart.js/dist/Chart.js', './node_modules/chart.js/test/mockContext.js', './Chart.Financial.js', './test/**/*.js'],
		frameworks: ['jasmine'],
		reporters: ['progress', 'kjhtml'],
	};

	// If on the CI, use the CI chrome launcher
	if (process.env.TRAVIS) {
		configuration.browsers.push('Chrome_travis_ci');
		configuration.customLaunchers = {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		};
	} else {
		configuration.browsers.push('Chrome');
	}

	config.set(configuration);
};
