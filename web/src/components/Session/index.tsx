import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Authenticate from "./Authenticate";

export default class Session extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/authenticate" component={Authenticate} />
            </Switch>
        );
    }
}