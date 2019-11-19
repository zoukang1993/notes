import {
    FETCH_INFO,
} from '../constants/mine';

import {
    fetchMineInfo,
} from '../apis/mine'

const info = fetchMineInfo();

export const fetchInfo = () => ({
    info,
    text: 'fetch_mine_info_data',
    type: FETCH_INFO,
});

