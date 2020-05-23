import * as React from "react";
import Header from "./Header";
import { Container, Columns, Column } from "bloomer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Session from "./Session";
import LoadingBar from "./LoadingBar";
import { trackPromise } from "react-promise-tracker";
import { auth } from "services/firebase";
import UserProfile from "models/UserProfile";
import Creator from "./Creator";
import { isProduction } from "helpers/consts";
import Solver from "./Solver";

interface IState {
  authUserProfile?: UserProfile;
}

class App extends React.PureComponent<any, IState> {
  state = {
    authUserProfile: undefined,
  };

  async componentDidMount() {
    if (!isProduction) {
      console.info("%c🔧 You're in development mode. 🔧", "font-size: 2rem;");
    }

    auth().onAuthStateChanged(async (user) => {
      if (user) {
        const authUserProfilePromise = UserProfile.getOrCreate(user.uid);
        trackPromise(authUserProfilePromise);

        const authUserProfile = await authUserProfilePromise;
        if (authUserProfile.exists) {
          this.setState({ authUserProfile });
        }
      }
    });
  }

  render() {
    return (
      <React.StrictMode>
        <Header />
        <LoadingBar />
        <Container isFluid style={{ marginTop: "3rem" }}>
          <Columns isCentered>
            <Column isSize={{ desktop: 8, tablet: 10, mobile: 12 }}>
              <BrowserRouter>
                <Switch>
                  <Route path="/login" component={Session} />
                  <Route path="/authenticate" component={Session} />
                  <Route
                    path="\/!:doozleId([-0-9A-Z_a-z]{20})"
                    render={(props) => (
                      <Solver
                        {...props}
                        authUserProfile={this.state.authUserProfile}
                        doozleId={props.match.params.doozleId}
                      />
                    )}
                  />
                  <Route
                    path="/"
                    render={(props) => (
                      <Creator
                        {...props}
                        authUserProfile={this.state.authUserProfile}
                      />
                    )}
                  />
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
