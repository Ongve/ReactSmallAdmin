// Product 的详情子路由组件
import React, { Component } from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constant'
import { reqCategory } from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {
	state = {
		// 一级分类名称
		cName1: '',
		// 二级分类名称
		cName2: ''
	}

	async componentDidMount() {
		const { pCategoryId, categoryId } = this.props.location.state
		// 一级分类下的商品
		if (pCategoryId === '0') {
			const result = await reqCategory(categoryId)
			const cName1 = result.data.name
			this.setState({ cName1 })
		} else {
			// const result1 = await reqCategory(pCategoryId)
			// const result2 = await reqCategory(categoryId)
			// const cName1 = result1.data.name
			// const cName2 = result2.data.name
			const results = await Promise.all([
				reqCategory(pCategoryId),
				reqCategory(categoryId)
			])
			const cName1 = results[0].data.name
			const cName2 = results[1].data.name
			this.setState({ cName1, cName2 })
		}
	}

	render() {
		const { name, desc, price, detail, imgs } = this.props.location.state
		const { cName1, cName2 } = this.state

		const title = (
			<span>
				<LinkButton>
					<Icon
						type='arrow-left'
						style={{ color: 'green', marginRight: 3, fontSize: 20 }}
						onClick={() => this.props.history.goBack()}
					/>
				</LinkButton>
				<span>商品详情</span>
			</span>
		)
		return (
			<Card title={title} className='product-detail'>
				<List>
					<Item>
						<span className='left'>商品名称：</span>
						<span>{name}</span>
					</Item>
					<Item>
						<span className='left'>商品描述：</span>
						<span>{desc}</span>
					</Item>
					<Item>
						<span className='left'>商品价格：</span>
						<span>{price}元</span>
					</Item>
					<Item>
						<span className='left'>所属分类：</span>
						<span>
							{cName1}
							{cName2 && '—>' + cName2}
						</span>
					</Item>
					<Item>
						<span className='left'>商品图片：</span>
						<span>
							{imgs.map(img => (
								<img
									src={BASE_IMG_URL + img}
									key={img}
									alt='商品图片'
									className='product-img'
								/>
							))}
						</span>
					</Item>
					<Item>
						<span className='left'>商品详情：</span>
						<span
							dangerouslySetInnerHTML={{
								__html: detail
							}}
						></span>
					</Item>
				</List>
			</Card>
		)
	}
}
