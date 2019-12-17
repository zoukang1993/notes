import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux';
import {
    fetchGoods,
} from '../actions/goods';

interface IGoodsProps {
    goodsList: any[],
    onFetchGoodsList: () => void,
}

class Goods extends React.Component<IGoodsProps, {}> {
    constructor(props: IGoodsProps) {
        super(props);

        this.state = {};
    }

    public componentDidMount() {
        const { onFetchGoodsList } = this.props;
        onFetchGoodsList();
    }

    public render() {
        return(
            <div>goods</div>
        );
    }
}

const mapStateToProps = (state: any):{goodsList: any[]} => {
    return {
        goodsList: state.goods.goodsList,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return{
        onFetchGoodsList: dispatch(fetchGoods()),
    };
};

const goods = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Goods);

export default goods;
