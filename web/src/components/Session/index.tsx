import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Authenticate from "./Authenticate";
import UserProfile from "models/UserProfile";

interface IProps {
  authUserProfile?: UserProfile;
}

export default class Session extends React.Component<IProps, any> {
  render() {
    return this.props.authUserProfile ? (
      <Redirect to="/" />
    ) : (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/authenticate" component={Authenticate} />
      </Switch>
    );
  }
}
