import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, Icon } from 'antd'

import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

import LinkButton from '../../components/link-button'

const { Option } = Select

export default class ProductHome extends Component {
  state = {
    searchType: 'productName',
    searchName: '',
    products: [], // 商品的数组
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  getProducts = async (pageNum) => {
    this.loading = true
    const result = await reqProducts(pageNum, PAGE_SIZE)
    this.loading = false
    console.log('result', result)
    if (result && result.status === 0) {
      this.setState({
        products: result.data.list
      })
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? '下架' : '上架'}
              </Button>
              <span>{status===1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  render () {
    const { searchType, searchName, products } = this.state
    const title = (<span>
      <Select value={searchType} style={{ width: 150 }} onChange={e => { this.setState({ searchType: e }) }}>
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select >
      <Input value={searchName} style={{width: 150, margin: '0 15px'}} onChange={event => this.setState({searchName:event.target.value})} />
      <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
    </span>)

    const extra = (<span>
      <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}><Icon type='plus'/>添加商品</Button>
    </span>)
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={this.loading}
          rowKey='_id'
          dataSource={products}
          columns={this.columns}
        />
      </Card>
    )
  }
}