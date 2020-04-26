import * as React from "react";
import { Navbar, NavbarItem, NavbarBrand, NavbarMenu, NavbarEnd, Button, NavbarBurger } from "bloomer";

interface IState {
    isBurgerMenuActive: Boolean,
}

export default class Header extends React.Component<any, IState> {
    readonly state = { isBurgerMenuActive: false };

    toggleBurgerMenu() {
        this.setState({ isBurgerMenuActive: !this.state.isBurgerMenuActive });
    }

    render() {
        return (
            <header>
                <Navbar>
                    <NavbarBrand>
                        <NavbarItem style={{ fontSize: "1.25rem" }}>Doozle</NavbarItem>
                        <NavbarBurger isActive={this.state.isBurgerMenuActive} onClick={this.toggleBurgerMenu.bind(this)} />
                    </NavbarBrand>
                    <NavbarMenu isActive={this.state.isBurgerMenuActive} onClick={this.toggleBurgerMenu.bind(this)} >
                        <NavbarEnd>
                            <NavbarItem><Button href="/login" isColor="success">Login / Register</Button></NavbarItem>
                        </NavbarEnd>
                    </NavbarMenu>
                </Navbar>
            </header>
        );
    }
}