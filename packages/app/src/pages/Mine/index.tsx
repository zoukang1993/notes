import * as React from "react";
import { DatePicker } from 'antd';

export interface HelloProps {
    compiler: string;
    framework: string;
}
interface HelloStates {
    title: string;
    mark?: string;
}

export default class Hello extends React.Component<HelloProps, HelloStates> {
    constructor(props: Readonly<HelloProps>) {
        super(props);
        this.state = {
            title: "app",
        };
    }

    componentDidMount() {
        document.title = this.state.title;
    }

    render() {
        const {
            compiler = '',
            framework = ''
        } = this.props

        return(
            <div>
                <h1>Hello from {compiler} and {framework}!</h1>
                <DatePicker />
            </div>
        );
    }
}
