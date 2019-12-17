const initData = {
    goodsList: [],
}

export default function goods(state = initData, action: any): any {
    switch(action.type) {
        case 'FETCH_GOODS_LIST':
            return Object.assign({}, state, { goodsList: action.goodsList });
        case 'FETCH_GOOD_ITEM':
            return Object.assign({}, state, { goodItem: action.goodItem });
        default:
            return state;
    }
}
