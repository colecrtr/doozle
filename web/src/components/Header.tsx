import * as React from "react";

import { Navbar, NavbarItem, NavbarBrand } from "bloomer";


export default class Header extends React.Component {
    render() {
        return (
            <header>
                <Navbar>
                    <NavbarItem>
                        <NavbarBrand style={{ fontSize: "1.25rem" }}>Doozle</NavbarBrand>
                    </NavbarItem>
                </Navbar>
            </header>
        );
    }
}