import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login";
import Authenticate from "./Authenticate";

export default class Session extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/login" component={Login} />
                <Route exact path="/authenticate" component={Authenticate} />
            </BrowserRouter>
        );
    }
}