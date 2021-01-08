import React, { PureComponent } from 'react'
import { DatePicker } from 'antd';
const { WeekPicker } = DatePicker;

export default class WeekPickerInterval extends PureComponent {

  constructor(props) {
    super(props);
 
    const value = props.value || {};
    this.state = {
      startValue: value instanceof Array && value.length > 1 ? value[0] : null,
      endValue: value instanceof Array && value.length > 1 ? value[1] : null,
      startString: '',
      endString: '',
      endOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      if (value instanceof Array && value.length > 1) {
        this.setState({
          startValue: value[0] || null,
          endValue: value[1] || null
        });
      }
    }
  }

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, fieldString, value, dateString) => {
    this.setState({
      [field]: value,
      [fieldString]: dateString,
    }, () => {
      const {startValue, endValue, startString, endString } = this.state
      const onChange = this.props.onChange;
      if (onChange) {
        onChange([startValue, endValue], [startString, endString])
      }
    });
  };

  onStartChange = (startValue, dateString) => {
    this.onChange('startValue', 'startString', startValue, dateString);
  };

  onEndChange = (endValue, dateString) => {
    this.onChange('endValue', 'endString', endValue, dateString);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render () {
    const { startValue, endValue, endOpen } = this.state
    return (
      <div>
        <WeekPicker
          {...this.props}
          disabledDate={this.disabledStartDate}
          value={startValue}
          placeholder="开始周"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <WeekPicker 
          {...this.props}
          style={{ marginLeft: 8 }}
          disabledDate={this.disabledEndDate}
          value={endValue}
          placeholder="结束周"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}/>
      </div>
    )
  }
}