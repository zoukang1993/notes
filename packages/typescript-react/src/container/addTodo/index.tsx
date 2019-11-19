import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { addTodo } from '../../actions';

export interface IAddTodoProps {
    [index: string]: any;
    dispatch: Dispatch;
}

class AddTodo extends React.Component<IAddTodoProps, {}>{
    public inputType: HTMLInputElement | null | any;
    
    constructor(props: IAddTodoProps) {
        super(props);
    }

    public handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!this.inputType.value.trim()) {
            return;
        }

        this.props.dispatch(addTodo(this.inputType.value));
        this.inputType.value = '';
    }

    public render() {
        return(
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <input ref={ node => this.inputType = node } />
                    <button type="submit"> Add Todo </button>
                </form>
            </div>
        );
    }
}



export default connect()(AddTodo);