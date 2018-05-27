const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: './src/index.js'
	},
	devtool: 'inline-source-map',
	plugins: [
		new CleanWebpackPlugin(['build']),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		}),
		new VueLoaderPlugin()
	],
	output: {
		path: path.resolve(__dirname, 'build/static'),
		filename: '[name].js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'vue-material-home': 'vue-material/dist/'
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.pug$/,
				loader: 'pug-plain-loader'
			},
			{
				test: /\.stylus$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'stylus-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				loader: 'file-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
}