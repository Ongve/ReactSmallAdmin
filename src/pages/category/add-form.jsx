import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

// 添加分类的 form 组件
class AddForm extends Component {
	static propTypes = {
		categories: PropTypes.array.isRequired,
		parentId: PropTypes.string.isRequired,
		// 用来传递 form 对象的函数
		setForm: PropTypes.func.isRequired
	}

	componentWillMount() {
		this.props.setForm(this.props.form)
	}

	render() {
		const { parentId, categories } = this.props
		const { getFieldDecorator } = this.props.form
		return (
			<Form>
				<Item>
					{getFieldDecorator('parentId', {
						initialValue: parentId
					})(
						<Select>
							<Option value='0'>一级分类</Option>
							{categories.map(c => (
								<Option key={c._id} value={c._id}>
									{c.name}
								</Option>
							))}
						</Select>
					)}
				</Item>
				<Item>
					{getFieldDecorator('categoryName', {
						initialValue: '',
						rules: [{ required: true, message: '名称不可为空' }]
					})(<Input placeholder='请输入分类名称' />)}
				</Item>
			</Form>
		)
	}
}

export default Form.create()(AddForm)
