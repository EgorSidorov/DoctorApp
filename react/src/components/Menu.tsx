import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export interface Props {
}

function Menu() {
  return (
    <div className="Menu">
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#/">Клиника</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link href="#/record">Форма записи</Nav.Link>
            <Nav.Link href="#/schedule">Расписание врачей</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    </div>
  );
}

export default Menu;