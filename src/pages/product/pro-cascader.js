import React, { Component } from 'react'
import { Cascader } from 'antd';
import { reqCategorys } from '../../api'

export default class ProCascader extends Component {
  state = {
    options: [],
  };

  componentDidMount() {
    this.getCategorys('0')
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))
    // 如果是一个二级分类商品的更新
    const { value } = this.props
    const pCategoryId = value && value[0] ? value[0] : ''
    if(pCategoryId && pCategoryId!=='0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }

    // 更新options状态
    this.setState({
      options
    })
  }

    /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }

  onChange = (value, selectedOptions) => {
    this.props.onChange(value, selectedOptions);
  };

  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false;

    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options],
    });
  };

  render() {
    const { options } = this.state
    return (
      <Cascader
        {...this.props}
        options={options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    );
  }
}