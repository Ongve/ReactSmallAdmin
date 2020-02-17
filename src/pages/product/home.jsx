import React, { Component } from 'react'
import { message, Card, Select, Input, Button, Icon, Table } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constant'

const Option = Select.Option

export default class ProductHome extends Component {
	state = {
		// 商品的数组
		products: [],
		total: 0,
		loading: false,
		// 搜索的关键字
		searchName: '',
		searchType: 'productName'
	}
	// 初始化 Table 列的数组
	initColumns = () => {
		this.columns = [
			{
				title: '商品名称',
				dataIndex: 'name'
			},
			{
				title: '商品描述',
				dataIndex: 'desc'
			},
			{
				title: '价格',
				dataIndex: 'price',
				// 当前指定了对应的属性，传入的是对应属性值
				render: price => '￥' + price
			},
			{
				width: 100,
				title: '状态',
				render: product => {
					const { status, _id } = product
					return (
						<span>
							<Button
								type='primary'
								onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
							>
								{status === 1 ? '下架' : '在售'}
							</Button>
							<span>{status === 1 ? '在售' : '已下架'}</span>
						</span>
					)
				}
			},
			{
				width: 80,
				title: '操作',
				render: product => (
					<span>
						<LinkButton
							onClick={() =>
								this.props.history.push('/product/detail', product)
							}
						>
							详情
						</LinkButton>
						<LinkButton
							onClick={() =>
								this.props.history.push('/product/addupdate', product)
							}
						>
							修改
						</LinkButton>
					</span>
				)
			}
		]
	}
	// 获取指定页码的列表数据
	getProducts = async pageNum => {
		// 保存当前的 pageNum
		this.pageNum = pageNum
		this.setState({ loading: true })

		const { searchName, searchType } = this.state
		let result
		if (searchName) {
			result = await reqSearchProducts({
				pageNum,
				pageSize: PAGE_SIZE,
				searchName,
				searchType
			})
		} else {
			result = await reqProducts(pageNum, PAGE_SIZE)
		}

		if (result.status === 0) {
			// 取出分页数据，更新状态，显示分页列表
			const { total, list } = result.data
			this.setState({
				total,
				products: list
			})
		}

		this.setState({ loading: false })
	}
	// 更新商品的状态
	updateStatus = async (productId, status) => {
		const result = await reqUpdateStatus(productId, status)
		if (result.status === 0) {
			message.success('商品状态更新成功')
			this.getProducts(this.pageNum)
		}
	}

	componentWillMount() {
		this.initColumns()
	}
	componentDidMount() {
		this.getProducts(1)
	}

	render() {
		const { products, total, loading, searchName, searchType } = this.state

		const title = (
			<span>
				<Select
					value={searchType}
					style={{ width: 130 }}
					onChange={value => this.setState({ searchType: value })}
				>
					<Option value='productName'>按名称搜索</Option>
					<Option value='productDesc'>按描述搜索</Option>
				</Select>
				<Input
					placeholder='请输入关键字'
					value={searchName}
					style={{ width: 200, margin: '0 15px' }}
					onChange={e => this.setState({ searchName: e.target.value })}
				/>
				<Button type='primary' onClick={() => this.getProducts(1)}>
					搜索
				</Button>
			</span>
		)
		const extra = (
			<Button
				type='primary'
				onClick={() => this.props.history.push('/product/addupdate')}
			>
				<Icon type='plus' />
				添加商品
			</Button>
		)

		return (
			<Card title={title} extra={extra}>
				<Table
					bordered
					loading={loading}
					rowKey='_id'
					dataSource={products}
					columns={this.columns}
					pagination={{
						defaultPageSize: PAGE_SIZE,
						showQuickJumper: true,
						total,
						onChange: this.getProducts,
						current: this.pageNum
					}}
				/>
			</Card>
		)
	}
}
