import React, { Component } from 'react';
import {Navbar, Nav, NavItem } from 'react-bootstrap';

class NavBar extends Component {
  render() {
    const {user} = this.props;
    let menu = null;
    if (!user.authenticated) {
      menu = (
        <Nav pullRight>
          <NavItem eventKey={2} href="#" onClick={this.props.showConnect}>Se connecter</NavItem>
          <NavItem eventKey={2} href="#" onClick={this.props.showSubscription}>S'inscrire</NavItem>
        </Nav>
      );
    } else {
      menu = (
        <Nav pullRight>
          <NavItem eventKey={2}>{user.data.username}</NavItem>
          <NavItem eventKey={2}>|</NavItem>
          <NavItem eventKey={2} href="#" onClick={this.props.logout}>Se déconnecter</NavItem>
        </Nav>
      );
    }
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Fortune</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {menu}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
