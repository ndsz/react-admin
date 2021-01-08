import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, Icon, message } from 'antd';
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants"
import ImgCrop from '../../components/antd-img-crop'
import lrz from 'lrz'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, // 标识是否显示大图预览Modal
    previewImage: '', // 大图的url
    previewTitle: '',
    fileList: [
      // {
      //   uid: '-1', // 每个file都有自己唯一的id
      //   name: 'image.png', // 图片文件名
      //   status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除, error被 beforeUpload 拦截的文件没有 status 属性
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '-5',
      //   name: 'image.png',
      //   status: 'error',
      // },
    ],
  };

  constructor(props) {
    super(props)

    let fileList = []

    const { imgs } = props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: BASE_IMG_URL + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList // 所有已上传图片的数组
    }
  }

   /*
    获取所有已上传图片文件名的数组
   */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  // 隐藏modal
  handleCancel = () => this.setState({ previewVisible: false });

  dataUrltoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mine = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const uBarr = new Uint8Array(n)
    while(n--){
      uBarr[n] = bstr.charCodeAt(n)
    }
    return new File([uBarr], filename, { type: mine })
  }

  backPromise = res => {
    return new Promise((resolve, reject) => {
      if (res instanceof Object) {
        const file = this.dataUrltoFile(res.base64, res.origin.name)
        Object.assign(file, {
          uid: file.lastModified
        })
        resolve(file)
      } else {
        reject('压缩失败！')
      }
    })
  }

  compress = file => {
    try {
      let ratio = 1
      debugger
      const { size } = file
      console.log('size', size, size / 1024)
      if (size !== undefined && size > 102400) {
        debugger
        ratio = parseFloat(102400 / size)
        return lrz(file, {
          quality: ratio
        }).then(rst => {
          console.log('rst', rst)
          return this.backPromise(rst)
        }).catch(() => {
          return false
        })
      }
      return true
    } catch (error) {
      
    }
  }

  beforeUpload = (file, fileList) => {
    console.log('file', file, fileList)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    console.log('压缩前', file.size)
    const p = this.compress(file)
    console.log('压缩后', file.size)
    console.log('p', p)
    const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    if (isJpgOrPng) {
      return p
    }
    // return isJpgOrPng && isLt2M;
    return false
  }

  handlePreview = async file => {
    console.log('file', file)
    // 显示指定file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /*
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片文件对象的数组
   */
  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file.status, file, fileList)
    const result = file.response
    // 一旦上传成功, 将当前上传的file的信息修正(name, url)
    if (file.status === 'done') {
      if(result.status===0) {
        message.success('上传图片成功!')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <ImgCrop
          aspect={359 / 412}
          modalWidth={800}
          grid={false}
          rotate={true}
        >
          <Upload
            action="/manage/img/upload" /*上传图片的接口地址*/
            accept='image/*'  /*只接收图片格式*/
            name='image' /*请求参数名*/
            listType="picture-card"  /*卡片样式*/
            fileList={fileList}  /*所有已上传图片文件对象的数组*/
            onPreview={this.handlePreview}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal
          visible={previewVisible}
          // title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}