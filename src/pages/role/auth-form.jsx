import React, { PureComponent } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

// 添加分类的 form 组件
export default class AuthForm extends PureComponent {
	static propTypes = {
		role: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)

		const { menus } = this.props.role
		this.state = {
			checkedKeys: menus
		}
	}

	getTreeNodes = menuList => {
		return menuList.reduce((pre, item) => {
			pre.push(
				<TreeNode title={item.title} key={item.key}>
					{item.children && this.getTreeNodes(item.children)}
				</TreeNode>
			)
			return pre
		}, [])
	}

	onCheck = checkedKeys => {
		this.setState({ checkedKeys })
	}
	// 为父组件提交最新 menus 数据
	getMenus = () => this.state.checkedKeys

	componentWillMount() {
		this.treeNodes = this.getTreeNodes(menuList)
	}
	componentWillReceiveProps(nextProps) {
		const menus = nextProps.role.menus
		this.setState({ checkedKeys: menus })
	}

	render() {
		const { role } = this.props
		const { checkedKeys } = this.state
		// 指定 Item 布局的配置对象
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 13 }
		}

		return (
			<div>
				<Item label='角色名称' {...formItemLayout}>
					<Input value={role.name} disabled />
				</Item>
				<Tree
					checkable
					// onSelect={this.onSelect}
					onCheck={this.onCheck}
					defaultExpandAll={true}
					checkedKeys={checkedKeys}
				>
					<TreeNode title='平台权限' key='all'>
						{this.treeNodes}
					</TreeNode>
				</Tree>
			</div>
		)
	}
}
