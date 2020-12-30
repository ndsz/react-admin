import React, { Component } from 'react'
import { Form, Input, Button, Icon, message } from 'antd';
import { Redirect } from 'react-router-dom'

import './login.less'
import logo from '../../assets/logo.png'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqLogin } from '../../api'

class Login extends Component {

  componentWillMount() {
    // storageUtils.removeUser()
    // memoryUtils.user = {}
    // 如果用户已经登陆, 自动跳转到管理界面
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, history } = this.props;
    // const values = form.getFieldsValue()
    form.validateFields(async (errors, values) => {
      if (!errors) {
        const { username, password } = values
        const result = await reqLogin(username, password)
        const { setUser } = storageUtils;
        if (result.status === 0) {
          // 提示登陆成功
          message.success('登陆成功')
          memoryUtils.user = result.data // 保存在内存中
          setUser(result.data)
          history.replace('/')
        } else {
          message.error(result.msg)
        }
      }
    });
    // form.validateFields(['username', 'password'], (errors, values) => {
    //   console.log('2', values)
    // });
    // form.validateFields(['username', 'password'], { force: true }, (errors, values) => {
    //   console.log('3', values)
    // });
    // console.log('e', values, form);
  }

  /*
  用户名/密码的的合法性要求
  1). 必须输入
  2). 必须大于等于 4 位
  3). 必须小于等于 12 位
  4). 必须是英文、数字或下划线组成
  */
  validator = (rule, value, callback) => {
    // console.log(rule, value, callback)
    if (!value) {
      callback('必须输入密码！')
    } else if (value.length < 4) {
      callback('密码必须大于4位！')
    } else if (value.length > 12) {
      callback('密码必须小于12位！')
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('必须是英文、数字或下划线组成')
    }
    callback()
  }

  render() {
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }
    
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-section">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, whitespace: true, message: '请输入用户名！' },
                  { min: 4, message: '必须大于等于 4 位' },
                  { max: 12, message: '必须小于等于 12 位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文、数字或下划线组成' }
                ],
                initialValue: 'admin'
              })(
              <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                    required: true, message: '请输入密码！'
                  },
                  // { min: 4, message: '必须大于等于 4 位' },
                  // { max: 12, message: '必须小于等于 12 位' },
                  // { pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文、数字或下划线组成' },
                  {
                    validator: this.validator
                  }
                ],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div >
    )
  }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */

const WrapLogin = Form.create()(Login)

export default WrapLogin;
