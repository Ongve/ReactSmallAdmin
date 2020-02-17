const { override, fixBabelImports, addLessLoader } = require('customize-cra')

// 按需打包
module.exports = override(
	// 根据import来打包(使用babel-plugin-import)
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: {
			'@primary-color': '#1DA57A'
		}
	})
)
