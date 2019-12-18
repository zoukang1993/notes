import {
    FETCH_GOODS_LIST,
    FETCH_GOOD_ITEM,
    IGood,
    // IGood,
} from '../constants/goods'
import {
    fetchGoodList,
    fetchGoodItem,
} from '../apis/goods';

export const fetchGoods = () => {
    const goodsList = fetchGoodList();

    return {
        goodsList,
        text: 'fetch_goods_list',
        type: FETCH_GOODS_LIST,
    }
}

export const fetchGood = (id: number): IGood | any => {
    const goodsItem = fetchGoodItem(id);

    return {
        goodsItem,
        text: 'fetch_good_item',
        type: FETCH_GOOD_ITEM,
    }
}
