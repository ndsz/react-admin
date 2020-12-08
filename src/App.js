import React, { Component } from 'react'
import { Button } from 'antd'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

import './App.css'

/**
 * 应用的根组件
 */

 export default class App extends Component {
   render () {
     return (
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login}>Login</Route>
            <Route path="/" component={Admin}>Admin</Route>
          </Switch>
        </BrowserRouter>
     )
   }
 }