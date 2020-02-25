import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
import { reqRoles, addRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formatDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import { connect } from 'react-redux'
import { logOut } from '../../redux/actions'

class Role extends Component {
	constructor(props) {
		super(props)
		this.state = {
			roles: [],
			// 选中的角色
			role: {},
			isShowAdd: false,
			isShowAuth: false
		}

		this.auth = React.createRef()
	}

	initColumns = () => {
		this.columns = [
			{
				title: '角色名称',
				dataIndex: 'name'
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				render: formatDate
			},
			{
				title: '授权时间',
				dataIndex: 'auth_time',
				render: formatDate
			},
			{
				title: '授权人',
				dataIndex: 'auth_name'
			}
		]
	}

	onRow = role => {
		return {
			onClick: () => {
				this.setState({ role })
			}
		}
	}

	getRoles = async () => {
		const result = await reqRoles()
		if (result.status === 0) {
			const roles = result.data
			this.setState({ roles })
		}
	}
	// 添加角色
	addRole = () => {
		// 表单验证
		this.form.validateFields(async (error, values) => {
			if (!error) {
				this.setState({ isShowAdd: false })
				const { roleName } = values
				this.form.resetFields()
				const result = await addRole(roleName)
				if (result.status === 0) {
					message.success('添加角色成功')
					const role = result.data

					this.setState(state => ({
						roles: [...state.roles, role]
					}))
				} else {
					message.error('添加角色失败')
				}
			}
		})
	}
	// 更新角色权限
	updateRole = async () => {
		this.setState({ isShowAuth: false })
		const { role } = this.state
		const { user, logOut } = this.props
		const menus = this.auth.current.getMenus()
		role.menus = menus
		role.auth_time = Date.now()
		role.auth_name = user.username

		const result = await reqUpdateRole(role)
		if (result.status === 0) {
			// 若修改自己角色的权限，则清除数据并强制退出
			if (role._id === user.role._id) {
				message.info('当前用户权限已修改，请重新登录')
				logOut()
			} else {
				message.success('设置角色权限成功')
				this.setState({
					roles: [...this.state.roles]
				})
			}
		} else {
			message.error('设置角色权限失败')
		}
	}

	componentDidMount() {
		this.getRoles()
	}

	componentWillMount() {
		this.initColumns()
	}

	render() {
		const { roles, role, isShowAdd, isShowAuth } = this.state

		const title = (
			<span>
				<Button
					type='primary'
					style={{ marginRight: 18 }}
					onClick={() => this.setState({ isShowAdd: true })}
				>
					创建角色
				</Button>
				<Button
					type='primary'
					disabled={!role._id}
					onClick={() => this.setState({ isShowAuth: true })}
				>
					设置角色权限
				</Button>
			</span>
		)

		return (
			<Card title={title}>
				<Table
					bordered
					rowKey='_id'
					dataSource={roles}
					columns={this.columns}
					pagination={{ defaultPageSize: PAGE_SIZE }}
					rowSelection={{
						type: 'radio',
						selectedRowKeys: [role._id],
						onSelect: role => this.setState({ role })
					}}
					onRow={this.onRow}
				/>
				<Modal
					title='添加角色'
					centered
					visible={isShowAdd}
					onOk={this.addRole}
					onCancel={() => this.setState({ isShowAdd: false })}
				>
					<AddForm setForm={form => (this.form = form)} />
				</Modal>
				<Modal
					title='设置角色权限'
					centered
					visible={isShowAuth}
					onOk={this.updateRole}
					onCancel={() => this.setState({ isShowAuth: false })}
				>
					<AuthForm ref={this.auth} role={role} />
				</Modal>
			</Card>
		)
	}
}

export default connect(state => ({ user: state.user }), { logOut })(Role)
