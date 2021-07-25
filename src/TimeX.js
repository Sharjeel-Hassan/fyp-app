
import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  Button,
  Badge,
  Card,
  Alert,
  Spinner,
} from 'react-bootstrap';


class TimeX extends Component {
  constructor() {
    super();
    this.state = {
      ngText: "",
      ngTextLoading: false,
      ngTextEmpty: false,
      result: []
    };
    this.getNgResult = this.getNgResult.bind(this);
  }




  getNgResult() {
    this.setState({ ngTextLoading: true, ngTextEmpty: false })
    if (this.state.ngText.length === 0) {
      this.setState({ ngTextEmpty: true, ngTextLoading: false })
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer api_HtOvcvPDzHrYxWsKbTtFBiCPJwxeUeHoaz");
    myHeaders.append("Content-Type", "text/plain");

    var raw = "\"" + this.state.ngText + "\"";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api-inference.huggingface.co/models/iAmmarTahir/domain-adapted-timex", requestOptions)
      .then(response => response.json())
      .then(r => {
        this.setState({ result: r, ngTextLoading: false, })
      })
      .catch(error => { this.setState({ result: [], ngTextLoading: false, }) });
  }




  render() {
    return (
      <>
        <Row className="p-3">
          <Col>
            <div className="d-flex justify-content-center">
              <h2>
                Time Expresion Recoganition <Badge bg="secondary">Beta</Badge>
              </h2></div></Col></Row>
        <Row className="w-100 p-3">
          <Col className="w-100">
            <Card>
              <Card.Body>
                <Card.Title>
                  Test With Text

                </Card.Title>
                <Card.Text>
                  <div className="d-flex justify-content-center">
                    <Form className="w-50">
                      <Form.Group className="mb-3" controlId="formDomainNg">
                        <Form.Label>Select a Domain</Form.Label>
                        <Form.Select aria-label="Default select example">
                          <option value="1">Clinical Domain</option>
                          <option value="2">News Domain</option>
                          <option value="3">Linguistics</option>
                          <option value="4">Weather/Climate Domain</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Input</Form.Label>
                        <Form.Control value={this.state.ngText} onChange={(e) => { this.setState({ ngText: e.target.value }) }} type="text" placeholder="my birthday is on 1999 october" />
                      </Form.Group>
                      <div className="text-center">
                        {this.state.ngTextEmpty &&
                          <Alert variant="danger">
                            Incorrect input format!
                          </Alert>}

                        {this.state.ngTextLoading ?
                          <Spinner animation="border" variant="primary" /> :
                          <Button className="m-3" variant="primary" type="button" onClick={this.getNgResult}>
                            Submit
                          </Button>}</div>
                      {this.state.result.map((obj) => (
                        <>
                          <div className="m-4">
                            {Object.keys(obj).map((key, i) => (
                              <p key={i}>
                                <span>{key}: </span>
                                <span>{obj[key]}</span>
                              </p>
                            ))}
                          </div>
                          <hr />
                        </>
                      ))
                      }
                    </Form>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>

          </Col>
        </Row>

      </>
    );
  }
}
export default TimeX;
