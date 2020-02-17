import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

// 添加分类的 form 组件
class AddForm extends Component {
	static propTypes = {
		// 用来传递 form 对象的函数
		setForm: PropTypes.func.isRequired
	}

	componentWillMount() {
		this.props.setForm(this.props.form)
	}

	render() {
		const { getFieldDecorator } = this.props.form

		// 指定 Item 布局的配置对象
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 13 }
    }
    
		return (
			<Form>
				<Item label='角色名称' {...formItemLayout}>
					{getFieldDecorator('roleName', {
						initialValue: '',
						rules: [{ required: true, message: '名称不可为空' }]
					})(<Input placeholder='请输入角色名称' />)}
				</Item>
			</Form>
		)
	}
}

export default Form.create()(AddForm)
