const initData = {
    goodsList: [],
}

export default function goods(state = initData, action: any): any {
    switch(action.type) {
        case 'FETCH_GOODS_LIST':
            return Object.assign({}, state, { goodsList: action.goodsList });
        default:
            return state;
    }
}
