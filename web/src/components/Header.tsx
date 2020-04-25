import * as React from "react";

import { Navbar, NavbarItem, NavbarBrand, NavbarMenu, NavbarEnd, Button } from "bloomer";


export default class Header extends React.Component {
    render() {
        return (
            <header>
                <Navbar>
                    <NavbarBrand>
                        <NavbarItem style={{ fontSize: "1.25rem" }}>Doozle</NavbarItem>
                    </NavbarBrand>
                    <NavbarMenu>
                        <NavbarEnd>
                            <NavbarItem><Button href="/session">Login / Register</Button></NavbarItem>
                        </NavbarEnd>
                    </NavbarMenu>
                </Navbar>
            </header>
        );
    }
}