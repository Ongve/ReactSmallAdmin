import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategories, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {
	state = {
		categories: [],
		// 是否正在获取数据
		loading: false,
		// 二级分类列表
		subCategories: [],
		parentId: '0',
		parentName: '',
		// 标识添加和更新的确认框是否显示，0：都不显示，1：添加框显示，2：更新框显示
		showStatus: 0
	}

	// 初始化Table所有列的数组
	initColumns = () => {
		this.columns = [
			{
				title: '分类的名称',
				dataIndex: 'name'
			},
			{
				// 返回需要显示的界面标签
				title: '操作',
				width: 300,
				render: category => (
					<span>
						<LinkButton
							onClick={() => {
								this.showUpdate(category)
							}}
						>
							修改分类
						</LinkButton>
						{this.state.parentId === '0' && (
							<LinkButton onClick={() => this.showSubCategories(category)}>
								查看子分类
							</LinkButton>
						)}
					</span>
				)
			}
		]
	}

	getCategories = async parentId => {
		this.setState({ loading: true })
		parentId = parentId || this.state.parentId

		const result = await reqCategories(parentId)
		this.setState({ loading: false })
		if (result.status === 0) {
			// 取出分类数组（可能是二级也可能是一级）
			const categories = result.data

			if (parentId === '0') {
				this.setState({ categories })
			} else {
				this.setState({ subCategories: categories })
			}
		} else {
			message.error('获取分类列表失败')
		}
	}

	showSubCategories = category => {
		// 更新状态
		this.setState(
			{
				parentId: category._id,
				parentName: category.name
			},
			() => {
				this.getCategories()
			}
		)
	}
	// 显示一级分类列表
	showCategories = () => {
		// 更新为显示一级列表的状态
		this.setState({
			parentId: '0',
			parentName: '',
			subCategories: []
		})
	}
	// 隐藏添加及更新确认框
	handleCancel = () => {
		this.form.resetFields()
		this.setState({ showStatus: 0 })
	}
	// 显示添加分类的确认框
	showAdd = () => {
		this.setState({ showStatus: 1 })
	}
	// 显示更新分类的确认框
	showUpdate = category => {
		// 保存分类对象
		this.category = category
		// 更新状态
		this.setState({ showStatus: 2 })
	}

	// 添加分类
	addCategory = () => {
		this.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ showStatus: 0 })

				const { parentId, categoryName } = values
				// 清除输入的数据
				this.form.resetFields()
				// 发起请求数据
				const result = await reqAddCategory(categoryName, parentId)
				if (result.status === 0) {
					// 添加的分类就是当前分类列表下的分类
					if (parentId === this.state.parentId) {
						// 重新获取当前分类列表
						this.getCategories()
					} else if (parentId === '0') {
						this.getCategories('0')
					}
				}
			}
		})
	}
	// 更新分类
	updateCategory = () => {
		// 进行表单验证
		this.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ showStatus: 0 })
				const categoryId = this.category._id
				const { categoryName } = values
				// 清除输入的数据
				this.form.resetFields()
				// 发起请求数据
				const result = await reqUpdateCategory({ categoryId, categoryName })
				if (result.status === 0) {
					// 重新显示列表
					this.getCategories()
				}
			}
		})
	}

	componentWillMount() {
		this.initColumns()
	}
	componentDidMount() {
		this.getCategories()
	}

	render() {
		const {
			categories,
			loading,
			subCategories,
			parentId,
			parentName,
			showStatus
		} = this.state
		// 读取指定的分类
		const category = this.category || {}
		const title =
			parentId === '0' ? (
				'一级分类列表'
			) : (
				<span>
					<LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
					<Icon type='arrow-right' style={{ marginRight: 10 }} />
					<span>{parentName}</span>
				</span>
			)
		const extra = (
			<Button type='primary' onClick={this.showAdd}>
				<Icon type='plus' />
				添加
			</Button>
		)

		return (
			<Card title={title} extra={extra}>
				<Table
					bordered
					rowKey='_id'
					loading={loading}
					dataSource={parentId === '0' ? categories : subCategories}
					columns={this.columns}
					pagination={{ defaultPageSize: 5, showQuickJumper: true }}
				/>
				<Modal
					title='添加分类'
					centered
					visible={showStatus === 1}
					onOk={this.addCategory}
					onCancel={this.handleCancel}
				>
					<AddForm
						categories={categories}
						parentId={parentId}
						setForm={form => {
							this.form = form
						}}
					/>
				</Modal>
				<Modal
					title='更新分类'
					centered
					visible={showStatus === 2}
					onOk={this.updateCategory}
					onCancel={this.handleCancel}
				>
					<UpdateForm
						categoryName={category.name}
						setForm={form => {
							this.form = form
						}}
					/>
				</Modal>
			</Card>
		)
	}
}
