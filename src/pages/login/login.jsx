import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import "./login.less";
import logo from "./images/logo.png";

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const form = this.props.form;
    const values = form.getFieldsValue();
    console.log(values);
  };

  render() {
    const form = this.props.form;
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "请输入用户名！" },
                  { min: 4, message: "用户名至少4位" },
                  { max: 16, message: "用户名最多16位" },
                  { pattern: /\d*/, message: "用户名需由英文、数字组成" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码！" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
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
