import * as React from 'react';
import Header from "./Header";
import { Container, Columns, Column } from "bloomer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Session from "./Session";
import LoadingBar from "./LoadingBar";
import { trackPromise } from "react-promise-tracker";
import { auth } from "services/firebase";
import UserProfile from 'models/UserProfile';

interface IState {
    authUserProfile: null | UserProfile
}

class App extends React.PureComponent<any, IState> {
    state = {
        authUserProfile: null,
    }

    async componentDidMount() {
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