import React, { Component } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Button,
} from 'react-bootstrap';
import NgDet from './NgDet';
import TimeX from './TimeX';

class App extends Component {
  constructor() {
    super();
    this.state = {
      ngDet: true,
    };
  }



  render() {
    return (
      <Container className="mw-100 p-0">
        <Navbar bg="primary" variant="dark" className="p-2">
          <Navbar.Brand href="#home">Source-Free Domain Adaptation for Semantic Analysis</Navbar.Brand>
          <Nav className="me-auto">
            <Button variant={this.state.ngDet ? "light" : "primary"} onClick={() => this.setState({ ngDet: true })} className="mx-2">Negation Detection</Button>
            <Button variant={!this.state.ngDet ? "light" : "primary"} onClick={() => this.setState({ ngDet: false })} className="mx-2">Time Expression Recognition</Button>
          </Nav>
        </Navbar>
        {this.state.ngDet ? <NgDet /> : <TimeX />}
      </Container>
    );
  }
}
export default App;
