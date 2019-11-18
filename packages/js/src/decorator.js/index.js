import react, { Component } from 'react';
import {
  setClassProps,
} from './setClassProps';
// import {readonly} from './readonly';

@setClassProps({
  title: 'app',
})
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        my app
      </div>
    );
  }
}

