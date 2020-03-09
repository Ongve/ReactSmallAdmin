// 包含应用中所有接口请求函数的模块
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'

// const BASE = 'http://localhost:5000'
const BASE = '/api'

// 登录
export const reqLogin = (username, password) =>
	ajax(
		BASE + '/login',
		{
			username,
			password
		},
		'POST'
	)

// jsonp请求的接口请求函数
export const reqWeather = city => {
	return new Promise((resolve, reject) => {
		const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
		jsonp(url, {}, (err, data) => {
			if (!err && data.status === 'success') {
				const { dayPictureUrl, weather } = data.results[0].weather_data[0]
				resolve({ dayPictureUrl, weather })
			} else {
				message.error('获取天气信息失败')
			}
		})
	})
}
// reqWeather('温州')

// 获取一级/二级分类的列表
export const reqCategories = parentId =>
	ajax(BASE + '/manage/category/list', { parentId })

// 添加分类
export const reqAddCategory = (categoryName, parentId) =>
	ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
	ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取分类
export const reqCategory = categoryId =>
	ajax(BASE + '/manage/category/info', { categoryId })

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
	ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 按名称/描述搜索商品
// searchType: 搜索的类型, productName/productDesc
export const reqSearchProducts = ({
	pageNum,
	pageSize,
	searchName,
	searchType
}) =>
	ajax(BASE + '/manage/product/search', {
		pageNum,
		pageSize,
		[searchType]: searchName
	})

// 更新商品状态（上架或在售）
export const reqUpdateStatus = (productId, status) =>
	ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除指定的图片
export const reqDelImg = name =>
	ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/修改商品
export const addOrUpdate = product =>
	ajax(
		BASE + '/manage/product/' + (product._id ? 'update' : 'add'),
		product,
		'POST'
	)

// 获取所有角色
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const addRole = roleName =>
	ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 修改角色
export const reqUpdateRole = role =>
	ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const delUser = userId =>
	ajax(BASE + '/manage/user/delete', { userId }, 'POST')
// 添加/修改用户
export const reqAddOrUpdate = user =>
	ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
