import React, { Component } from 'react'
import { Card, Form, Input, Icon, Button, message } from 'antd'

import LinkButton from '../../components/link-button'
import ProCascader from './pro-cascader'
import PriceInput from './priceInput'
import PicturesWall from './pictures-wall'
// import RichTextEditor from './rich-text-editor'
import { reqAddOrUpdateProduct } from '../../api'

const Item = Form.Item

const { TextArea } = Input;

class ProductAddUpdate extends Component {

  constructor(props) {
    super(props)
    this.pw = React.createRef()
    // this.editor = React.createRef()
  }

  componentWillMount () {
    // 取出携带的state
    const product = this.props.location.state  // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product
    // 保存商品(如果没有, 保存是{})
    this.product = product || {}
  }

  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. 收集数据, 并封装成product对象
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        // const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }

    /*
  验证价格的自定义验证函数
   */
  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('价格必须大于0') // 验证没通过
    }
  }

  render () {

    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product

    // 用来接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const title = (<span>
       <LinkButton onClick={() => this.props.history.goBack()}>
        <Icon type='arrow-left' style={{fontSize: 20}}/>
      </LinkButton>
      <span>{isUpdate ? '修改商品' : '添加商品'}</span>
    </span>)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const { getFieldDecorator } = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  { required: true, message: '请输入商品名称' }
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  { required: true, message: '请输入商品描述' }
                ]
              })(
                <TextArea
                  placeholder="请输入商品描述"
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '请输入商品价格' },
                  {validator: this.validatePrice}
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
              )
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  { required: true, message: '请输入商品分类' },
                ]
              })(
                <ProCascader placeholder='请输入商品分类'/>
              )
            }
          </Item>
          <Item label="Price1">
            {getFieldDecorator('price1', {
              initialValue: { number: 0, currency: 'rmb' },
            })(<PriceInput />)}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            {/* <RichTextEditor ref={this.editor} detail={detail}/> */}
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)
