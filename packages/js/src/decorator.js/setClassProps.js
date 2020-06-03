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


/**
 * two
 *
*/

function newClass(obj = {}) {
  return Components => {
    const Wrapper = Components;

    class Maggic extends Component {
      constructor(props) {
        super(props);
        this.state = {};
      }

      render() {
        const newProps = {
          ...this.props,
          tests: obj,
        };

        return <Wrapper {...newProps} />;
      }
    }

    return React.forwardRef((props, ref) => {
      return <Maggic {...props} maggicRef={ref} />;
    });
  };
}
