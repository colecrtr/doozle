import React from "react";
import {
  Navbar,
  NavbarItem,
  NavbarBrand,
  NavbarEnd,
  Button,
  Level,
  LevelItem,
} from "bloomer";
import UserProfile from "models/UserProfile";

interface IProps {
  authUserProfile?: UserProfile;
}
interface IState {
  isBurgerMenuActive: Boolean;
}

export default class Header extends React.Component<IProps, IState> {
  readonly state = { authUserProfile: undefined, isBurgerMenuActive: false };

  toggleBurgerMenu() {
    this.setState({ isBurgerMenuActive: !this.state.isBurgerMenuActive });
  }

  render() {
    return (
      <header>
        <Navbar style={{ display: "flex" }}>
          <NavbarBrand>
            <NavbarItem href="/" style={{ fontSize: "1.25rem" }}>
              Doozle
            </NavbarItem>
          </NavbarBrand>
          <NavbarEnd
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            <NavbarItem style={{ display: "flex", alignItems: "center" }}>
              {this.props.authUserProfile ? (
                <Level>
                  <LevelItem
                    isHidden="mobile"
                    style={{ marginRight: "0.5rem" }}
                  >
                    {this.props.authUserProfile.name}
                  </LevelItem>
                  <LevelItem>
                    <img
                      src={this.props.authUserProfile.avatarSrc}
                      style={{ borderRadius: "1rem" }}
                    />
                  </LevelItem>
                </Level>
              ) : (
                <Button href="/login" isColor="success">
                  Login / Register
                </Button>
              )}
            </NavbarItem>
          </NavbarEnd>
        </Navbar>
      </header>
    );
  }
}
