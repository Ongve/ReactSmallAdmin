import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import { reqWeather } from '../../api'
import menuList from '../../config/menuConfig'
import { formatDate } from '../../utils/dateUtils'
import './index.less'
import LinkButton from '../link-button'
import { connect } from 'react-redux'
import { logOut } from '../../redux/actions'

class Header extends Component {
	state = {
		currentTime: formatDate(Date.now()),
		dayPictureUrl: '',
		weather: ''
	}

	componentDidMount() {
		this.getTime()
		this.getWeather()
	}
	componentWillUnmount() {
		clearInterval(this.intervalId)
	}

	getTime = () => {
		this.intervalId = setInterval(() => {
			// 启动的定时器还需要清除
			const currentTime = formatDate(Date.now())
			this.setState({ currentTime })
		}, 1000)
	}
	getWeather = async () => {
		const { dayPictureUrl, weather } = await reqWeather('温州')
		// 获取到数据后更新状态
		this.setState({ dayPictureUrl, weather })
	}
	getTitle = () => {
		const path = this.props.location.pathname // 本来没有 pathname，需用 withRouter 包装
		let title
		menuList.forEach(item => {
			if (item.key === path) {
				title = item.title
			} else if (item.children) {
				// 在所有子item中查找匹配项
				const cItem = item.children.find(cItem => path.includes(cItem.key))
				// 若有值说明有匹配项
				if (cItem) {
					title = cItem.title // 取出其title
				}
			}
		})
		return title
	}
	logOut = () => {
		Modal.confirm({
			title: '确定要退出吗？',
			onOk: () => {
				// 需改成箭头函数，否则没有this
				// console.log(this);
				// 删除保存数据
				this.props.logOut()
			}
		})
	}

	render() {
		const { currentTime, dayPictureUrl, weather } = this.state
		const username = this.props.user.username
		// const title = this.getTitle() // 得到当前需要显示的title
		const title = this.props.headTitle

		return (
			<div className='header'>
				<div className='header-top'>
					<span>欢迎，{username}</span>
					<LinkButton onClick={this.logOut}>退出</LinkButton>
				</div>
				<div className='header-bottom'>
					<div className='header-bottom-left'>{title}</div>
					<div className='header-bottom-right'>
						<span>{currentTime}</span>
						<img src={dayPictureUrl} alt='天气' />
						<span>{weather}</span>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({ headTitle: state.headTitle, user: state.user }),
	{ logOut }
)(withRouter(Header))
