import React from 'react';
import { Navbar, NavItem, NavLink } from 'reactstrap';
import Style from '../Style.css';


function Navigation() {


    return (
        <div>
            <div className="row">
                <Navbar style={Style.nav} expand="lg">
                    <div className="col-md-6">
                        <span className="navbar-brand">
                            <img src="./images/logo.jpg" className="logo" alt="logo" />
                        </span>
                    </div>
                    <div className="col-md-6 navcat">
                        <NavItem className="navbar">
                            <NavLink style={{ color: 'black' }} href='#'>Category 1</NavLink>
                        </NavItem>

                        <NavItem className="navbar">
                            <NavLink style={{ color: 'black' }} href='#'>Category 2</NavLink>
                        </NavItem>

                        <NavItem className="navbar">
                            <NavLink style={{ color: 'black' }} href='#'>Category 3</NavLink>
                        </NavItem>

                        <NavItem className="navbar">
                            <NavLink style={{ color: 'black' }} href='#'>Category 4</NavLink>
                        </NavItem>

                        <NavItem className="navbar">
                            <NavLink style={{ color: 'black' }} href='#'>Category 5</NavLink>
                        </NavItem>
                    </div>
                </Navbar>

            </div>
        </div>

    );
}

export default Navigation;