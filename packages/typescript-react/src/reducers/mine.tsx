
const initData = {
    info: {},
};

function mine(state = initData, action: any) {
    switch(action.type) {
        case "FETCH_INFO":
            return Object.assign({}, state, {
                info: action.info || {},
            });
        default:
            return state;
    }
}

export { mine };
