import { combineReducers } from 'redux'

import mine from './mine';
import goods from './goods'

const app = combineReducers({
    mine,
    goods,
});

export default app;
