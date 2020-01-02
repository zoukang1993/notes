import * as React from 'react';
import Button from 'antd/es/button';

import Mine from './pages/mine';
import Goods from './pages/goods';

import './App.css';

class App extends React.Component {
    public render() {
        return (
            <div className="App">
                <Goods />
                <Mine />
                <Button type="primary">Button</Button>
            </div>
        );
    }
}

export default App;
