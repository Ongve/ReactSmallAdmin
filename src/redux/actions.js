import {
	SET_HEAD_TITLE,
	RECEIVE_USER,
	SHOW_ERROR_MSG,
	RESET_USER
} from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

// 设置头部标题
export const setHeadTitle = headTitle => ({
	type: SET_HEAD_TITLE,
	data: headTitle
})
// 接收用户
export const receiveUser = user => ({
	type: RECEIVE_USER,
	user
})
// 显示错误信息
export const showErrorMsge = msg => ({
	type: SHOW_ERROR_MSG,
	msg
})
// 登录
export const login = (username, password) => {
	return async dispatch => {
		const result = await reqLogin(username, password)
		if (result.status === 0) {
			const user = result.data
			storageUtils.saveUser(user)
			dispatch(receiveUser(user))
		} else {
			dispatch(showErrorMsge(result.msg))
		}
	}
}
// 退出登录
export const logOut = () => {
	storageUtils.rmUser()
	return { type: RESET_USER }
}
