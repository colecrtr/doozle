import * as React from 'react';
import Header from "./Header";
import { Container, Columns, Column } from "bloomer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Session from "./Session";
import LoadingBar from "./LoadingBar";

import './App.scss';

class App extends React.PureComponent {
    render() {
        return (
            <React.StrictMode>
                <Header />
                <LoadingBar />
                <Container isFluid style={{ marginTop: "3rem" }}>
                    <Columns isCentered>
                        <Column isSize={{desktop: 6, tablet: 9, mobile: 12}}>
                            <BrowserRouter>
                                <Switch>
                                    <Route path="/login" component={Session} />
                                    <Route path="/authenticate" component={Session} />
                                </Switch>
                            </BrowserRouter>
                        </Column>
                    </Columns>
                </Container>
            </React.StrictMode>
        );
    }
}

export default App;