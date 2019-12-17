import * as React from 'react';

import Mine from './pages/mine';
import Goods from './pages/goods';

import './App.css';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Goods />
                <Mine />
            </div>
        );
    }
}

export default App;
