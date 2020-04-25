import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login";

export default class Session extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/session" component={Login} />
            </BrowserRouter>
        );
    }
}