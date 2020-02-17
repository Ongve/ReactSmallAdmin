import React, { Component } from 'react'
import { Button, Card, Table, Modal, message } from 'antd'
import { formatDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constant'
import { reqUsers, delUser, reqAddOrUpdate } from '../../api'
import UserForm from './user-form'

export default class User extends Component {
	state = {
		users: [],
		roles: [],
		isShow: false
	}

	initColumns = () => {
		this.columns = [
			{
				title: '用户名',
				dataIndex: 'username'
			},
			{
				title: '邮箱',
				dataIndex: 'email'
			},
			{
				title: '电话',
				dataIndex: 'phone'
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				render: formatDate
			},
			{
				title: '所属角色',
				dataIndex: 'role_id',
				render: role_id => this.roleNames[role_id]
			},
			{
				title: '操作',
				render: user => (
					<span>
						<LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
						<LinkButton onClick={() => this.delUser(user)}>删除</LinkButton>
					</span>
				)
			}
		]
	}
	// 根据 roles 数组生成包含角色名的对象（属性名用角色 id 值）
	initRoleNames = roles => {
		const roleNames = roles.reduce((pre, role) => {
			pre[role._id] = role.name
			return pre
		}, {})
		this.roleNames = roleNames
	}
	// 添加或更新用户
	addOrUpdate = async () => {
		const user = this.form.getFieldsValue()
		this.form.resetFields()
		// 若是更新，需要给 user 指定_id熟悉
		if (this.user) {
			user._id = this.user._id
		}

		const result = await reqAddOrUpdate(user)
		if (result.status === 0) {
			message.success(`${this.user ? '修改' : '添加'}用户成功`)
			this.getUsers()
		} else {
			message.error(result.msg)
			console.log(result)
		}
		this.setState({ isShow: false })
	}
	// 显示修改用户面板
	showUpdate = user => {
		this.user = user
		this.setState({ isShow: true })
	}
	// 显示添加用户面板
	showAdd = () => {
		this.user = null
		this.setState({ isShow: true })
	}

	delUser = user => {
		Modal.confirm({
			title: `确认删除${user.username}吗？`,
			// 需改成箭头函数，原来是 onOk() => {
			onOk: async () => {
				const result = await delUser(user._id)
				if (result.status === 0) {
					message.success('删除用户成功')
					this.getUsers()
				}
			}
		})
	}

	getUsers = async () => {
		const result = await reqUsers()
		if (result.status === 0) {
			const { users, roles } = result.data
			this.initRoleNames(roles)
			this.setState({
				users,
				roles
			})
		}
	}

	componentWillMount() {
		this.initColumns()
	}
	componentDidMount() {
		this.getUsers()
	}

	render() {
		const { users, isShow, roles } = this.state
		const user = this.user || {}
		const title = (
			<Button type='primary' onClick={this.showAdd}>
				添加用户
			</Button>
		)

		return (
			<Card title={title}>
				<Table
					bordered
					rowKey='_id'
					dataSource={users}
					columns={this.columns}
					pagination={{ defaultPageSize: PAGE_SIZE }}
				/>
				<Modal
					title={user._id ? '修改用户' : '添加用户'}
					centered
					visible={isShow}
					onOk={this.addOrUpdate}
					onCancel={() => {
            this.setState({ isShow: false })
            this.form.resetFields()
          }}
				>
					<UserForm
						setForm={form => (this.form = form)}
						roles={roles}
						user={user}
					/>
				</Modal>
			</Card>
		)
	}
}
