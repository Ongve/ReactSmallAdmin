// 能发送异步ajax请求的函数模块
// 函数的返回值是promise对象
// 优化：统一处理请求异常
import axios from 'axios'

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise()
    if (type === 'GET') {
        return axios.get(url, {
            params: data
        })
    } else {
        return axios.post(url, data)
    }
}