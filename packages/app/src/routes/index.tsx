import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }
interface HelloStates {
    title: string,
    mark?: string,
}

export default class Hello extends React.Component<HelloProps, HelloStates> {
    constructor(props: Readonly<HelloProps>) {
        super(props);
        this.state = {
            title: "entry",
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
        console.log(
            "entry",
            compiler,
            framework
        );
        return <h1>Hello from {compiler} and {framework}!</h1>;
    }
}
