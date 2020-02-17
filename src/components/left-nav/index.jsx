import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'

const SubMenu = Menu.SubMenu

class LeftNav extends Component {
	hasAuth = item => {
		const { key, isPublic, children } = item
		const { menus } = memoryUtils.user.role
		const { username } = memoryUtils.user
		if (username === 'admin' || isPublic || menus.indexOf(key) != -1) {
			return true
		} else if (children) {
			return !!children.find(child => menus.indexOf(child.key) != -1)
		}
		return false
	}

	// 根据menu的数据数组生成对应的标签数组
	// 使用map() + 递归调用
	getMenuNodes_map = menuList => {
		return menuList.map(item => {
			const { children, key, icon, title } = item
			if (!children) {
				return (
					<Menu.Item key={key}>
						<Link to={key}>
							<Icon type={icon} />
							<span>{title}</span>
						</Link>
					</Menu.Item>
				)
			} else {
				return (
					<SubMenu
						key={key}
						title={
							<span>
								<Icon type={icon} />
								<span>{title}</span>
							</span>
						}
					>
						{this.getMenuNodes(children)}
					</SubMenu>
				)
			}
		})
	}
	// 使用reduce()
	getMenuNodes = menuList => {
		const path = this.props.location.pathname
		return menuList.reduce((pre, item) => {
			// 如果有权限，才显示对应菜单项
			const { children, key, icon, title } = item
			if (this.hasAuth(item)) {
				if (!children) {
					pre.push(
						<Menu.Item key={key}>
							<Link to={key}>
								<Icon type={icon} />
								<span>{title}</span>
							</Link>
						</Menu.Item>
					)
				} else {
					// 查找一个与当前请求路径匹配的子item
					// 原来是 cItem.key === path，优化为下面
					const cItem = children.find(cItem => path.includes(cItem.key))
					if (cItem) {
						this.openKey = key
					}

					pre.push(
						<SubMenu
							key={key}
							title={
								<span>
									<Icon type={icon} />
									<span>{title}</span>
								</span>
							}
						>
							{this.getMenuNodes(children)}
						</SubMenu>
					)
				}
			}
			return pre
		}, [])
	}
	// 为第一个render()准备数据，必须同步
	componentWillMount() {
		this.menuNodes = this.getMenuNodes(menuList)
	}

	render() {
		// 得到当前的路由路径
		let path = this.props.location.pathname
		if (path.includes('/product')) {
			path = '/product'
		}

		return (
			<div className='left-nav'>
				<Link to='/' className='left-nav-header'>
					<img src={logo} alt='logo' />
					<h1>硅谷后台</h1>
				</Link>
				<Menu
					mode='inline'
					theme='dark'
					selectedKeys={[path]}
					defaultOpenKeys={[this.openKey]}
				>
					{this.menuNodes}
				</Menu>
			</div>
		)
	}
}

// withRouter高阶组件：包装非路由组件，返回一个新的组件
// 新组件向非路由组件传递3个属性：histroy/location/match
export default withRouter(LeftNav)
