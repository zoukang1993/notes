import * as React from "react";
import { DatePicker } from 'antd';

export interface HomeProps {
    
}
interface HomeStates {
    title: string;
    mark?: string;
}

export default class Home extends React.Component<HomeProps, HomeStates> {
    constructor(props: Readonly<HomeProps>) {
        super(props);
        this.state = {
            title: "home",
        };
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        return(
            <div>
                home
            </div>
        );
    }
}
