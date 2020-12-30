import React, { Component } from 'react'
import { Icon, Modal, Button } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import moment from 'moment'
import { reqWeather } from '../../api'

import './index.less'

class Header extends Component {
  state = {
    currentTime: '', // 当前时间字符串
    weather: ''
  }

  componentDidMount() {
    this.setIntervalbanner();
    this.getWeather()
  }

  getWeather = async () => {
    // 调用接口请求异步获取数据
    const weather = await reqWeather('武汉')
    // 更新状态
    this.setState({weather})
  }

  componentWillUnmount() {
    clearInterval(this.currentTimeID);
  }

  setIntervalbanner = () => {
    this.currentTimeID = setInterval(
      () => this.queryCurrentTime(),
      1000
    );
  }

  queryCurrentTime = () => {
    const currentTime = `${moment(new Date()).format('YYYY-MM-DD')} ${moment(new Date()).format('HH:mm:ss')}`;
    this.setState({
      currentTime,
    });
  }

  getTitle = menuList => {
    const path = this.props.location.pathname
    let title = ''
    function queryTitle(menuList) {
      menuList.forEach(item => {
        if (path === item.key) {
          title = item.title
        } else if (item.children) {
          queryTitle(item.children)
        }
      })
    }
    queryTitle(menuList)
    return title
  }

    /*
  退出登陆
   */
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }

  render () {
    const { currentTime, weather } = this.state
    const title = this.getTitle(menuList)
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{memoryUtils.user.username}</span>
          {/* <Link to="/login">退出</Link> */}
          <Button className='header-top-button' onClick={this.logout}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <Icon type="smile" theme="twoTone" twoToneColor="#52c41a" style={{ fontSize: 18, margin: '0 15px' }} />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
