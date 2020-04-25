import * as React from 'react';
import Header from "./Header";
import { Container, Title } from "bloomer";

import './App.scss';

class App extends React.PureComponent {
    render() {
        return (
            <React.StrictMode>
                <Header />
                <Container isFluid>
                    <Title>Hello World!</Title>
                </Container>
            </React.StrictMode>
        );
    }
}

export default App;