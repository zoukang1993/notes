import * as home from './action-type';

// 保存表单数据
export const fetchInfo = (value, datatype) => {
  return {
    type: home.FETCHINFO,
    value,
    datatype,
  }
};
