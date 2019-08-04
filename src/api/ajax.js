// 能发送异步ajax请求的函数模块
// 函数的返回值是promise对象
// 优化：统一处理请求异常
import axios from 'axios'
import { message } from "antd";

export default function ajax(url, data = {}, type = 'GET') {
    let promise
    return new Promise((resolve, reject) => {
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => {
            resolve(response)
        }).catch(error => {
            message.error('请求出错了：' + error.message)
        })
    })
}