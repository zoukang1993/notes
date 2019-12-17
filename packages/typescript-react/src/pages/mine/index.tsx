import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux';
import {
    fetchInfo,
} from '../../../actions/mine';

export interface IMineProps {
    info: any;
    onFetchInfo: () => void;
}

class Mine extends React.Component<IMineProps, {}> {
    constructor(props: IMineProps) {
        super(props);

        this.state = {};
    }

    public componentDidMount() {
        const {
            onFetchInfo
        } = this.props;
        onFetchInfo();
    }

    public render() {
        return(
            <div>mine</div>
        );
    }
}

const mapStateToProps = (state: any): { info: any } => {
    return {
        info: state.mine.info,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onFetchInfo: () => dispatch(fetchInfo()),
    };
};

const mine = connect(
    mapStateToProps,
    mapDispatchToProps
)(Mine);

export default mine;
