import React, { Component } from 'react';

export function setClassProps(allProps = {}) {
    return Components => {
        const WrapComponents = Components;

        return class extends Component {
            constructor(props) {
                super(props);
                this.state = {};
            }

            componentDidMount() {
            }

            render() {
                const newProps = {
                    ...this.props,
                    ...allProps,
                }

                return(
                    <WrapComponents
                        {...newProps}
                    />
                );
            }
        }
    }    
}
