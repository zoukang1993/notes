import { FETCH_GOODS_LIST } from '../constants/goods'
import {
    fetchGoodList,
} from '../apis/goods';

export const fetchGoods = () => {
    return {
        goodsList: fetchGoodList(),
        text: 'fetch_goods_list',
        type: FETCH_GOODS_LIST,
    }
}
