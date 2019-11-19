import * as React from 'react';
import './App.css';

import CountCon from './container/CounterCon';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <CountCon />
      </div>
    );
  }
}

export default App;
