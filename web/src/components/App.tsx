import * as React from 'react';
import Header from "./Header";

import "bulma";
import './App.scss';

class App extends React.PureComponent {
    render() {
        return (
            <React.StrictMode>
                <Header />
                <div>
                    <h1>Hello World!</h1>
                </div>
            </React.StrictMode>
        );
    }
}

export default App;