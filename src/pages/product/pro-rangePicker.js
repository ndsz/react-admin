import React, { PureComponent } from 'react'
import { DatePicker } from 'antd';
import moment from 'moment'
import calendar from './calendar/calendar';

const { RangePicker } = DatePicker;

export default class ProRangePicker extends PureComponent {
  handleDateRender = (current, today) => { // current当前页的所有日期，
    const lunarDay = calendar.solar2lunar(current.year(), current.month() + 1, current.date()).IDayCn; // 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
    const style = {};
    if (moment(current).format('YYYY-MM-DD') === moment(today).format('YYYY-MM-DD')) {
      style.border = '2px solid #1890ff';
      style.backgroundColor = '#bae7ff'
      style.color= ' #1890ff'
      style.fontWeight= 700
    }
    return (
      <div style={style}>
        <div>{current.date()}</div>
        <div style={{ fontSize: 10 }}>{lunarDay}</div>
      </div>
    );
  }

  onChange = (date, dateString) => {
    this.props.onChange(date, dateString);
  };

  render () {
    return (
      <div>
        {/* <DatePicker
          {...this.props}
          dateRender={this.handleDateRender}
          onChange={this.onChange}
        /> */}
        <RangePicker
          {...this.props}
          dateRender={this.handleDateRender}
          onChange={this.onChange}
        />
      </div>
    )
  }
}