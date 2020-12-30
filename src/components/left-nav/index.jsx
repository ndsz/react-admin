import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import logo from '../../assets/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  getMenuNodes_map = menuList => {
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_map(item.children)}
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes_reduce = menuList => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果存在, 说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        
        pre.push(
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes_reduce(item.children)}
          </SubMenu>
        )
      }
      return pre
    }, [])
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes_reduce(menuList)
  }

  render () {
    const path = this.props.location.pathname
    
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt=""/>
          <h1>后台管理</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          mode="inline"
          theme="dark"
          defaultOpenKeys={[this.openKey]}
          // inlineCollapsed={this.state.collapsed}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)
