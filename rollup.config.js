const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const banner = `/*!
 * @license
 * ${pkg.name}
 * http://chartjs.org/
 * Version: ${pkg.version}
 *
 * Copyright ${new Date().getFullYear()} Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/${pkg.name}/blob/master/LICENSE.md
 */`;

module.exports = [
	{
		input: 'src/index.js',
		output: {
			name: 'Chart.Financial',
			file: `dist/${pkg.name}.js`,
			banner: banner,
			format: 'umd',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			commonjs({
				include: 'node_modules/**',
			}),
			nodeResolve(),
		],
		external: [
			'chart.js'
		]
	},
	{
		input: 'src/index.js',
		output: {
			name: 'Chart.Financial',
			file: `dist/${pkg.name}.min.js`,
			banner: banner,
			format: 'umd',
			indent: false,
			globals: {
				'chart.js': 'Chart'
			}
		},
		plugins: [
			commonjs({
				include: 'node_modules/**',
			}),
			nodeResolve(),
			terser({output: {comments: 'some'}})
		],
		external: [
			'chart.js'
		]
	}
];
