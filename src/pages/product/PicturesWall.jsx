import React from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import { reqDelImg } from '../../api'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from "../../utils/constant";

export default class Pic extends React.Component {
	static proTypes = {
		imgs: PropTypes.array
	}

	constructor(props) {
		super(props)

		let fileList = []
		const { imgs } = this.props
		if (imgs && imgs.length) {
			// 存在BUG
			fileList=imgs.map((img, idx) => ({
				uid: -idx,
				name: img,
				status: 'done',
				url: BASE_IMG_URL + img
			}))
		}

		this.state = {
			// 是否显示大图
			previewVisible: false,
			// 图片链接
			previewImage: '',
			fileList
		}
	}

	// fileList 当前的文件列表
	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = async file => {
		this.setState({
			previewImage: file.url,
			previewVisible: true
		})
	}

	handleChange = async ({ file, fileList }) => {
		if (file.status === 'done') {
			const result = file.response
			if (result.status == 0) {
				message.success('上传图片成功')
				Object.assign(fileList[fileList.length - 1], result.data)
			} else {
				message.error('上传图片失败')
			}
		} else if (file.status === 'removed') {
			const result = await reqDelImg(file.name)
			if (result.status === 0) {
				message.success('删除图片成功')
			} else {
				message.error('删除图片失败')
			}
		}
		this.setState({ fileList })
	}
	// 获取已上传图片的文件名数组
	getImgs = () => {
		return this.state.fileList.map(file => file.name)
	}

	render() {
		const { previewVisible, previewImage, fileList } = this.state
		const uploadButton = (
			<div>
				<Icon type='plus' />
				<div>上传</div>
			</div>
		)
		return (
			<div className='clearfix'>
				<Upload
					action='/manage/img/upload'
					accept='image/*'
					name='image'
					listType='picture-card'
					fileList={fileList}
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
					{fileList.length >= 8 ? null : uploadButton}
				</Upload>
				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this.handleCancel}
				>
					<img alt='example' style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		)
	}
}
