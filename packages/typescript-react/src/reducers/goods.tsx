const initData = {
    goodsItem: {}, // goods list
    goodsList: [], // goods item
}

export default function goods(state = initData, action: any): any {
    switch(action.type) {
        case 'FETCH_GOODS_LIST':
            return Object.assign({}, state, { goodsList: action.goodsList });
        case 'FETCH_GOOD_ITEM':
            return Object.assign({}, state, { goodsItem: action.goodsItem });
        default:
            return state;
    }
}
