import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Line extends Component {
	state = {
		sales: [5, 10],
		stock: [3, 13]
	}

	update = () => {
		this.setState(state => ({
			sales: state.sales.map(sale => sale + 1),
			stock: state.stock.reduce((pre, store) => {
				pre.push(store - 1)
				return pre
			}, [])
		}))
	}

	getOption = (sales, stock) => {
		return {
			title: {
				text: '入门示例'
			},
			legend: { data: ['销量', '库存'] },
			xAxis: {
				data: ['衬衫', '羊毛衫']
			},
			yAxis: {},
			series: [
				{
					name: '销量',
					type: 'line',
					data: sales
				},
				{
					name: '库存',
					type: 'line',
					data: stock
				}
			]
		}
	}

	render() {
		const { sales, stock } = this.state
		return (
			<div>
				<Card>
					<Button type='primary' onClick={this.update}>
						更新
					</Button>
				</Card>
				<Card title='折线图'>
					<ReactEcharts option={this.getOption(sales, stock)} />
				</Card>
			</div>
		)
	}
}
