
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
  FloatingLabel
} from 'react-bootstrap';

var ref;

class NgDet extends Component {
  constructor() {
    super();
    this.state = {
      ngText: "",
      ngtextResult: false,
      ngTextLoading: false,
      ngModalLoading: false,
      ngNegated: false,
      ngTextEmpty: false,
      ngFileLoading: false,
      fileValue: "",
      invalidFile: false,
      done: "0",
      ngData: {},
    };
    this.getNgResult = this.getNgResult.bind(this);
    this.getNgFileResult = this.getNgFileResult.bind(this);
    this.showFile = this.showFile.bind(this);
    this.calculateFile = this.calculateFile.bind(this);
    this.sleep = this.sleep.bind(this);
    ref = this;
  }

  showFile() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {


      this.setState({ invalidFile: false })
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          ref.setState({ fileValue: event.target.result })
        };
      } else {
        this.setState({ invalidFile: true })
      }
      reader.readAsText(file);
    } else {
      alert('Your browser is too old to support HTML5 File API');
    }
  };

  getNgFileResult(text) {


    if (text.length === 0) {
      this.setState({
        ngData: { ...this.state.ngData, [text]: "null" }
      })
      return;
    }

    if (text.split("<e>").length !== 2 || text.split("<e>")[1].split("</e>").length !== 2) {
      this.setState({ ngData: { ...this.state.ngData, [text]: "null" } })
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer api_HtOvcvPDzHrYxWsKbTtFBiCPJwxeUeHoaz");
    myHeaders.append("Content-Type", "text/plain");

    var raw = "\"" + text + "\"";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api-inference.huggingface.co/models/iAmmarTahir/domain-adapted-negation", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.length === 1) {
          if (result[0][0].label === "LABEL_0" && result[0][0].score > 0.5) {
            this.setState({ ngData: { ...this.state.ngData, [text]: "0" } })
          }
          else {
            this.setState({ ngData: { ...this.state.ngData, [text]: "1" } })
          }
        }
        else {
          this.setState({ ngData: { ...this.state.ngData, [text]: "null" } })
        }
        this.setState({
          done: ((Object.keys(this.state.ngData).length / this.state.fileValue.replaceAll("\r", "").split("\n").length) * 100).toString()
        })
        if (((Object.keys(this.state.ngData).length / this.state.fileValue.replaceAll("\r", "").split("\n").length) * 100).toString() === "100") this.setState({ ngFileLoading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ ngData: { ...this.state.ngData, [text]: "null" } })
        this.setState({
          done: ((Object.keys(this.state.ngData).length / this.state.fileValue.replaceAll("\r", "").split("\n").length) * 100).toString()
        })
        if (((Object.keys(this.state.ngData).length / this.state.fileValue.replaceAll("\r", "").split("\n").length) * 100).toString() === "100") this.setState({ ngFileLoading: false });

      });

  }

  getNgResult() {
    console.log("now");

    this.setState({ ngTextEmpty: false, ngtextResult: false, ngTextLoading: true, ngModalLoading: false })

    if (this.state.ngText.length === 0) {
      this.setState({ ngTextEmpty: true, ngTextLoading: false })
      return;
    }
    if (this.state.ngText.split("<e>").length !== 2 || this.state.ngText.split("<e>")[1].split("</e>").length !== 2) {
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

    fetch("https://api-inference.huggingface.co/models/iAmmarTahir/domain-adapted-negation", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.length === 1) {
          if (result[0][0].label === "LABEL_0" && result[0][0].score > 0.5) {
            this.setState({ ngtextResult: true, ngNegated: false, ngModalLoading: false, ngTextLoading: false })
          }
          else {
            this.setState({ ngtextResult: true, ngNegated: true, ngModalLoading: false, ngTextLoading: false })
          }
        }
        else {
          this.setState({ ngTextLoading: false, ngModalLoading: true })
        }

      })
      .catch(error => {
        this.setState({ ngTextLoading: false, ngModalLoading: true })
      });

  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculateFile() {
    this.setState({ done: "0", ngFileLoading: true, ngData: {} })
    var Data = this.state.fileValue.replaceAll("\r", "").split("\n");
    console.log(Data);
    Data.forEach(async (element, i) => {
      this.getNgFileResult(element)
      await this.sleep(3000);
    });

  }


  render() {
    return (
      <>
        <Row className="p-3">
          <Col>
            <div className="d-flex justify-content-center">
              <h2>
                Negation Detection <Badge bg="secondary">Beta</Badge>
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
                        <Form.Control value={this.state.ngText} onChange={(e) => { this.setState({ ngText: e.target.value }) }} type="text" placeholder="I am <e>sick</e>" />
                      </Form.Group>
                      <div className="text-center">
                        {this.state.ngTextEmpty &&
                          <Alert variant="danger">
                            Incorrect input format!
                          </Alert>}
                        {this.state.ngModalLoading &&
                          <Alert variant="danger">
                            The negation detection modal is loading, Try again later!
                          </Alert>}
                        {this.state.ngTextLoading ?
                          <Spinner animation="border" variant="primary" /> :
                          <Button className="m-3" variant="primary" type="button" onClick={this.getNgResult}>
                            Submit
                          </Button>}</div>
                      {this.state.ngtextResult &&
                        <>
                          {this.state.ngNegated ?
                            <Alert variant="info">
                              Entity <b>Negated</b>
                            </Alert> :
                            <Alert variant="info">
                              Entity <b>Not Negated</b>
                            </Alert>}</>}
                    </Form>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>

          </Col>
        </Row>
        <Row className="w-100 p-3">
          <Col className="w-100">
            <Card>
              <Card.Body>
                <Card.Title>
                  Test With File

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
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Add .txt file here! (One input each line)</Form.Label>
                        <Form.Control type="file" onChange={this.showFile} />
                      </Form.Group>
                      <div className="text-center">
                        {this.state.invalidFile &&
                          <Alert variant="danger">
                            Incorrect file format!
                          </Alert>}
                        {this.state.fileValue.length > 0 && <>
                          < FloatingLabel controlId="floatingTextarea2" label="File Data">
                            <Form.Control
                              as="textarea"
                              placeholder="verify Data here"
                              value={this.state.fileValue}
                              onChange={(e) => { this.setState({ fileValue: e.target.value }) }}
                              style={{ height: '200px' }}
                            />
                          </FloatingLabel>

                          {this.state.ngFileLoading ?
                            <><Spinner animation="border" variant="primary" />{this.state.done} %</> :
                            <Button className="m-3" variant="primary" type="button" onClick={this.calculateFile}>
                              Submit
                            </Button>}</>}
                        <div className="m-4">
                          {
                            Object.keys(this.state.ngData).map((key, i) => (
                              <p key={i}>
                                <span>{key}</span>
                                <span> : </span>
                                <span><b>{this.state.ngData[key]}</b></span>
                              </p>
                            ))
                          }
                        </div>
                      </div>
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
export default NgDet;
