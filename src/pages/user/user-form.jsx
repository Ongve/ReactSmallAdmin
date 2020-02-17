import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

// 添加/修改用户的 form 组件
class UserForm extends PureComponent {
	static propTypes = {
		// 用来传递 form 对象的函数
		setForm: PropTypes.func.isRequired,
		roles: PropTypes.array.isRequired,
		user: PropTypes.object
	}

	componentWillMount() {
		this.props.setForm(this.props.form)
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const { roles, user } = this.props

		// 指定 Item 布局的配置对象
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 13 }
		}

		return (
			<Form {...formItemLayout}>
				<Item label='用户名'>
					{getFieldDecorator('username', {
						initialValue: user.username,
						rules: [{ required: true, message: '名称不可为空' }]
					})(<Input placeholder='请输入用户名' />)}
				</Item>
				{!user._id && (
					<Item label='密码'>
						{getFieldDecorator('password', {
							initialValue: user.password,
							rules: [{ required: true, message: '密码不可为空' }]
						})(<Input type='password' placeholder='请输入密码' />)}
					</Item>
				)}
				<Item label='手机号'>
					{getFieldDecorator('phone', {
						initialValue: user.phone
					})(<Input placeholder='请输入手机号' />)}
				</Item>
				<Item label='邮箱'>
					{getFieldDecorator('email', {
						initialValue: user.email
					})(<Input placeholder='请输入邮箱' />)}
				</Item>
				<Item label='角色'>
					{getFieldDecorator('role_id', {
						initialValue: user.role_id
					})(
						<Select placeholder='请选择角色'>
							{roles.map(role => (
								<Option key={role._id} value={role._id}>
									{role.name}
								</Option>
							))}
						</Select>
					)}
				</Item>
			</Form>
		)
	}
}

export default Form.create()(UserForm)
