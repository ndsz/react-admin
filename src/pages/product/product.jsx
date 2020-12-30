import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'


export default class Product extends Component {
  render () {
    return (
      <Switch>
        <Route path="/product" component={Home} exact />
        <Route path="/product/addUpdate" component={AddUpdate} />
        <Route path="/product/detail" component={Detail} />
        <Redirect to="/product" />
      </Switch>
    )
  }
}