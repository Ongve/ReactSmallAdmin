import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './login.less';
import logo from './images/logo.png';
import { reqLogin } from '../../api';

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    // 对所有表单字段进行校验
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 请求登录
        const { username, password } = values;
        const res = await reqLogin(username, password);
        console.log('请求成功', res.data);
      } else {
        console.log('校验失败！！');
      }
    });
  };
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码');
    } else if (value.length < 4) {
      callback('密码长度必须大于等于4位');
    } else if (value.length > 32) {
      callback('密码长度必须小于等于32位');
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback('密码需由英文、数字组成');
    } else {
      callback();
    }
  };

  render() {
    const form = this.props.form;
    const { getFieldDecorator } = form;

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className='login-form'>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '请输入用户名！' },
                  { min: 4, message: '用户名至少4位' },
                  { max: 16, message: '用户名最多16位' },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: '用户名需由英文、数字组成'
                  }
                ],
                initialValue: 'admin'
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='用户名'
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ validator: this.validatePwd }]
              })(
                <Input
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type='password'
                  placeholder='密码'
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
// 高价函数 + 高阶组件
const WrapLogin = Form.create()(Login);
export default WrapLogin;
