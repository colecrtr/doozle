import * as React from "react";
import { auth } from "services/firebase";
import { trackPromise } from "react-promise-tracker";
import { setTitle } from "helpers/title";
import {
  Title,
  Field,
  Label,
  Control,
  Input,
  Button,
  Help,
  Subtitle,
} from "bloomer";
import { Redirect } from "react-router-dom";

interface IState {
  isAuthenticated: Boolean;
  isLinkInvalid: Boolean;
}

export default class Authenticate extends React.Component<any, IState> {
  readonly state = {
    isAuthenticated: false,
    isLinkInvalid: false,
  };

  componentDidMount() {
    setTitle("Authenticate");

    const href = window.location.href;

    if (auth().isSignInWithEmailLink(href)) {
      let email: string = window.localStorage.getItem(
        "emailForAuthenticateHandler"
      ) as string;
      if (!email) {
        /* User probably clicked the link on a different device than they logged
         * in with.
         */
        email = window.prompt(
          "Please provide your email for confirmation"
        ) as string;
      }

      const authenticatePromise = auth()
        .signInWithEmailLink(email, href)
        .then((_result: any) => {
          window.localStorage.removeItem("emailForAuthenticateHandler");
          this.setState({ isAuthenticated: true });
        })
        .catch((error: any) => {
          console.error(error);
          if (error.code === "auth/invalid-action-code") {
            this.setState({ isLinkInvalid: true });
          }
        });
      trackPromise(authenticatePromise);
    } else {
      this.setState({ isLinkInvalid: true });
    }
  }

  render() {
    if (this.state.isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <>
        <Title>
          {this.state.isLinkInvalid ? "Link is invalid." : "Authenticating..."}
        </Title>
      </>
    );
  }
}
