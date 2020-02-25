import React, { Component } from 'react'
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Pie extends Component {
	getOption1 = () => {
		return {
			title: {
				text: '用户访问来源',
				subtext: '虚假滴',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a}<br/>{b} : {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['直接访问', '搜索引擎']
			},
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{ value: 555, name: '直接访问' },
						{ value: 133, name: '搜索引擎' }
					]
				}
			]
		}
	}
	getOption2 = () => {
		return {
			backgroundColor: '#2c343c',
			title: {
				text: '用户访问来源',
				left: 'center',
				top: 20,
				textStrle: {
					color: '#ccc'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a}<br/>{b} : {c} ({d}%)'
			},
			visualMap: {
				show: false,
				min: 80,
				max: 600,
				inRange: {
					colorLightness: [0, 1]
				}
			},
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: [
						{ value: 555, name: '直接访问' },
						{ value: 133, name: '搜索引擎' }
					].sort((a, b) => a.value - b.value),
					roseType: 'radius',
					label: {
						normal: {
							textStyle: {
								color: 'rgba(255,255,255,0.3)'
							}
						}
					},
					labelLine: {
						normal: {
							lineStyle: {
								color: 'rgba(255,255,255,0.3)'
							},
							smooth: 0.2,
							length: 10,
							length2: 20
						}
					},
					itemStyle: {
						normal: {
							color: '#c23531',
							shadowBlur: 200,
							shadowColor: 'rgba(255,255,255,0.3)'
						}
					},
					animationType: 'scale',
					animationEasing: 'elasticOut',
					animationDelay: () => Math.random() * 200
				}
			]
		}
	}

	render() {
		return (
			<div>
				<Card title='饼图一'>
					<ReactEcharts option={this.getOption1()} style={{ height: 300 }} />
				</Card>
				<Card title='饼图二'>
					<ReactEcharts option={this.getOption2()} style={{ height: 300 }} />
				</Card>
			</div>
		)
	}
}
