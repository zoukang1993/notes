// import {
//     fetchInfo,
// } from '../actions/mine';

const initData = {
    info: {},
};

function mine(state = initData, action: any): any {
    switch(action.type) {
        case "FETCH_INFO":
            return Object.assign({}, state, {
                info: action,
            });
        default:
            return state;
    }
}

export { mine };