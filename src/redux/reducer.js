import storageUtils from '../utils/storageUtils'
import { combineReducers } from 'redux'
import {
	SET_HEAD_TITLE,
	RECEIVE_USER,
	SHOW_ERROR_MSG,
	RESET_USER
} from './action-types'

// 管理头部标题
const initHeadTitle = ''
function headTitle(state = initHeadTitle, action) {
	switch (action.type) {
		case SET_HEAD_TITLE:
			return action.data

		default:
			return state
	}
}
// 管理登录用户
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
	switch (action.type) {
		case RECEIVE_USER:
			return action.user
		case SHOW_ERROR_MSG:
			const { msg } = action
			return { ...state, msg }
		case RESET_USER:
			return {}

		default:
			return state
	}
}
// 暴露的是合并产生的总的reducer函数
export default combineReducers({
	headTitle,
	user
})
