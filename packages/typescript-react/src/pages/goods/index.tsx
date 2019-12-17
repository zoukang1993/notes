import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux';
import {
    fetchGoods,
    fetchGood,
} from '../../actions/goods';

interface IGoodsProps {
    goodsList: any[],
    onFetchGoodsList: () => any,
    onFetchGoodItem: (id: number) => void,
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

    public fetchGoodItem = (record: any = {}): void => {
        const { id = null } = record;
        const { onFetchGoodItem } = this.props;
        onFetchGoodItem(id);
    }

    public render() {
        const { goodsList = [] } = this.props;
        
        return(
            <div>
                <h2>goods</h2>
                <div>
                    {goodsList && goodsList.map(item => {
                        return(
                            <div key={item.id.toString()} onClick={() => this.fetchGoodItem(item)}>{item.name}</div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        goodItem: state.goods.goodItem,
        goodsList: state.goods.goodsList,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => {
    return{
        onFetchGoodItem: (id: number) => dispatch(fetchGood(id)),
        onFetchGoodsList: () => dispatch(fetchGoods()),
    };
};

const goods = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Goods);

export default goods;
