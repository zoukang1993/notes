import * as React from 'react';
import { connect } from 'react-redux'
import { Dispatch } from 'redux';

export interface IMineProps {
    info: any;
    onFetchInfo: () => void;
}

class Mine extends React.Component<IMineProps, {}> {
    constructor(props: IMineProps) {
        super(props);
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

const mapStateToProps = (state: any): { info: any } => ({
    info: state.info,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onFetchInfo: () => dispatch({type: 'FETCH_INFO'}),
});

const mine = connect(
    mapStateToProps,
    mapDispatchToProps
)(Mine);

export default mine;
