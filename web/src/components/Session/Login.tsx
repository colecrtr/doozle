import * as React from "react";
import { setTitle } from "helpers/title";
import { auth } from "services/firebase";
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
import { trackPromise } from "react-promise-tracker";

interface IState {
  isLoading: Boolean;
  email: String;
  isEmailInvalid: Boolean;
  isEmailSent: Boolean;
}

export default class Login extends React.Component<any, IState> {
  readonly state = {
    isLoading: false,
    email: "",
    isEmailInvalid: false,
    isEmailSent: false,
  };

  componentDidMount() {
    setTitle("Login");
  }

  onEmailChange(event: React.FormEvent) {
    const target = event.target as HTMLInputElement;
    this.setState({ email: target.value });
  }

  onSubmit(event: React.DetailedHTMLProps<any, any>) {
    event.preventDefault();
    this.setState({ isEmailInvalid: false, isLoading: true });

    const actionCodeSettings = {
      url: `${window.location.protocol}//${window.location.host}/authenticate`,
      handleCodeInApp: true,
    };
    const sendEmailPromise = auth()
      .sendSignInLinkToEmail(this.state.email, actionCodeSettings)
      .then(() => {
        /* Email sent successfully, store the email address for the authenticate handler
         * to use to make it more seamless for the user to login.
         */
        window.localStorage.setItem(
          "emailForAuthenticateHandler",
          this.state.email
        );
        this.setState({ isEmailSent: true, isLoading: false });
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          this.setState({ isEmailInvalid: true, isLoading: false });
        }
      });
    trackPromise(sendEmailPromise);
  }

  render() {
    return (
      <>
        <Title>Login / Register</Title>
        {this.state.isEmailSent ? (
          <Subtitle style={{ marginTop: "1rem", marginBottom: 0 }}>
            Success! We sent a login link to {this.state.email}
          </Subtitle>
        ) : (
          <form
            onSubmit={this.onSubmit.bind(this)}
            style={{ maxWidth: "400px" }}
          >
            <Field>
              <Label>Email</Label>
              <Control>
                <Input
                  type="email"
                  placeholder="cole@example.com"
                  disabled={this.state.isLoading}
                  value={this.state.email}
                  onChange={this.onEmailChange.bind(this)}
                  isColor={this.state.isEmailInvalid ? "danger" : ""}
                  required
                />
              </Control>
              <Help>
                {this.state.isEmailInvalid
                  ? "The email you entered is invalid. We will send a secure login and/or registration link to this email so please make sure it is correct."
                  : "We will send a secure login and/or registration link to this email."}
              </Help>
            </Field>
            <Field>
              <Control>
                <Button
                  type="submit"
                  isColor="success"
                  isLoading={this.state.isLoading}
                >
                  Request login link
                </Button>
              </Control>
            </Field>
          </form>
        )}
      </>
    );
  }
}
