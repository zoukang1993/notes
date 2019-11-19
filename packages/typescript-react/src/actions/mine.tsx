import {
    FETCH_INFO,
} from '../constants/mine';

import {
    fetchMineInfo,
} from '../apis/mine'

export const fetchInfo = () => {
    const info = fetchMineInfo();
    return {
        info,
        text: 'fetch_mine_info_data',
        type: FETCH_INFO,
    };
};
