// Product 的添加和更新的子路由组件
import React, { PureComponent } from 'react'
import { Card, Input, Form, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategories, addOrUpdate } from '../../api'
import Pic from './PicturesWall'
import RichText from './rich-text'
import memoryUtils from '../../utils/memoryUtils'

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends PureComponent {
	state = {
		options: []
	}
	pic = React.createRef()
	editor = React.createRef()

	// 异步获取一级/二级分类列表，并显示
	getCategories = async parentId => {
		const result = await reqCategories(parentId)
		if (result.status === 0) {
			const categories = result.data
			if (parentId === '0') {
				this.initOptions(categories)
			} else {
				// 当前 async 函数返回的 promise 就会成功且 value 为 categories
				return categories
			}
		}
	}
	initOptions = async categories => {
		const options = categories.map(c => ({
			value: c._id,
			label: c.name,
			isLeaf: false
		}))
		// 若是修改一个二级分类商品
		const { isUpdate, product } = this
		const { pCategoryId } = product
		if (isUpdate && pCategoryId !== '0') {
			// 获取对应二级分类列表
			const subCategories = await this.getCategories(pCategoryId)
			const childOptions = subCategories.map(c => ({
				value: c._id,
				label: c.name
			}))
			// 找到当前商品对应的一级 option 对象
			const targetOption = options.find(option => option.value === pCategoryId)
			targetOption.children = childOptions
		}
		// 此时是全新的 options，无需解构赋值也会重新渲染
		this.setState({ options })
	}

	// 加载下一级列表的回调函数
	loadData = async selectedOptions => {
		// 得到选择的 option 对象
		const targetOption = selectedOptions[0]
		targetOption.loading = true

		const subCategories = await this.getCategories(targetOption.value)
		if (subCategories && subCategories.length) {
			const childOptions = subCategories.map(c => ({
				value: c._id,
				label: c.name
			}))
			targetOption.children = childOptions
		} else {
			// 当前选中分类无二级分类
			targetOption.isLeaf = true
		}

		targetOption.loading = false
		this.setState({
			options: [...this.state.options]
		})
	}

	submit = () => {
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { name, desc, price, categoryIds } = values
				let categoryId, pCategoryId
				if (categoryIds.length === 1) {
					pCategoryId = '0'
					categoryId = categoryIds[0]
				} else {
					pCategoryId = categoryIds[0]
					categoryId = categoryIds[1]
				}
				const imgs = this.pic.current.getImgs()
				const detail = this.editor.current.getDetail()

				const product = {
					name,
					desc,
					price,
					imgs,
					detail,
					categoryId,
					pCategoryId
				}

				if (this.isUpdate) {
					product._id = this.product._id
				}

				const result = await addOrUpdate(product)
				if (result.status === 0) {
					message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
					this.props.history.goBack()
				} else {
					message.error(`${this.isUpdate ? '更新' : '添加'}商品成功`)
				}
			}
		})
	}

	validatePrice = (rule, value, callback) => {
		if (value * 1 > 0) {
			callback()
		} else {
			callback('价格必须大于0')
		}
	}

	componentDidMount() {
		this.getCategories('0')
	}
	componentWillMount() {
		const product = memoryUtils.product
		this.isUpdate = !!product._id
		this.product = product || {}
	}
	componentWillUnmount() {
		memoryUtils.product = {}
	}

	render() {
		const { isUpdate, product } = this
		const { getFieldDecorator } = this.props.form
		const { pCategoryId, categoryId, imgs, detail } = product
		const categoryIds = []
		if (isUpdate) {
			if (pCategoryId === '0') {
				// 一级分类下的商品
				categoryIds.push(categoryId)
			} else {
				// 二级分类下的商品
				categoryIds.push(pCategoryId)
				categoryIds.push(categoryId)
			}
		}

		// 指定 Item 布局的配置对象
		const formItemLayout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 8 }
		}

		const title = (
			<span>
				<LinkButton onClick={() => this.props.history.goBack()}>
					<Icon
						style={{ color: 'green', marginRight: 3, fontSize: 20 }}
						type='arrow-left'
					/>
				</LinkButton>
				<span>{isUpdate ? '修改商品' : '添加商品'}</span>
			</span>
		)

		return (
			<Card title={title}>
				<Form {...formItemLayout}>
					<Item label='商品名称'>
						{getFieldDecorator('name', {
							initialValue: product.name,
							rules: [{ required: true, message: '必须输入商品名称' }]
						})(<Input placeholder='请输入商品名称' />)}
					</Item>
					<Item label='商品描述'>
						{getFieldDecorator('desc', {
							initialValue: product.desc,
							rules: [{ required: true, message: '必须输入商品描述' }]
						})(
							<TextArea
								placeholder='请输入商品描述'
								autosize={{ minRows: 2, maxRows: 6 }}
							/>
						)}
					</Item>
					<Item label='商品价格'>
						{getFieldDecorator('price', {
							initialValue: product.price,
							rules: [
								{ required: true, message: '必须输入商品价格' },
								{ validator: this.validatePrice }
							]
						})(
							<Input
								addonAfter='元'
								type='number'
								placeholder='请输入商品价格'
							/>
						)}
					</Item>
					<Item label='商品分类'>
						{getFieldDecorator('categoryIds', {
							initialValue: categoryIds,
							rules: [{ required: true, message: '必须选择商品分类' }]
						})(
							<Cascader
								placeholder='请选择分类'
								options={this.state.options}
								loadData={this.loadData}
							/>
						)}
					</Item>
					<Item label='商品图片'>
						<Pic ref={this.pic} imgs={imgs} />
					</Item>
					<Item
						label='商品详情'
						labelCol={{ span: 2 }}
						wrapperCol={{ span: 20 }}
					>
						<RichText ref={this.editor} detail={detail} />
					</Item>
					<Item>
						<Button type='primary' onClick={this.submit}>
							提交
						</Button>
					</Item>
				</Form>
			</Card>
		)
	}
}

export default Form.create()(ProductAddUpdate)
