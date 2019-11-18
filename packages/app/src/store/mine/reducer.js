import * as mine from './action-type';

let defaultState = {
    info: {}, // 个人信息
};

  // 首页表单数据
export const formData = (state = defaultState , action = {}) => {
    switch(action.type){
        case home.FETCHINFO:
            return {...state, ...{[action.datatype]: action.value}};
        default:
        return state;
    }
};

