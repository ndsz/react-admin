用法：
```
import WeekPickerInterval from '@/components//WeekPickerInterval';

{
  getFieldDecorator('time', {
    initialValue: [moment(new Date()), moment(new Date('2021-01-23'))],
    rules: [
      { required: true, message: '请输入时间' },
      {validator: this.validateTime}
    ]
  })(
    <WeekPickerInterval onChange={this.onChange} placeholder='请输入时间'/>
  )
}

validateTime = (rule, value, callback) => {
  if (value && value[0] && value[1]) {
    callback() // 验证通过
  } else {
    callback('请输入时间区间！') // 验证没通过
  }
}

onChange = (value, dateString) => {
  console.log( value, dateString)
}
```

## API

| 参数     | 说明                     | 类型        | 默认值 |
|----------|--------------------------|-------------|------ -|

其他属性同Ant Design WeekPicker组件