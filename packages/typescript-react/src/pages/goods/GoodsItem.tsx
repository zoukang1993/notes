import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface IGoodItem {
    goodsItem: any,
}

class GoodsItem extends React.Component<IGoodItem, {}> {
    constructor(props: IGoodItem) {
        super(props);
        
        this.state = {};
    }

    public render() {
        return (
            <div>
                GoodsItem
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        goodsItem: state.goods.goodsItem,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {

    };
}

const goodsItem = connect(
    mapDispatchToProps,
    mapStateToProps,
)(GoodsItem);

export default goodsItem;
