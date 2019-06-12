import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';

 class App extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.handleClose = this.handleClose.bind(this);
  
      this.state = {
        show: false,
      };
    }
    componentWillReceiveProps(props)
    {
        this.setState({show: props.isOpen})
    }  
    handleClose() {
      this.setState({ show: false });
    }

  
    render() {
      return (
        <>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Melding weddenschap</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                Melding weddenschap</Modal.Body>
            <Modal.Footer>
              <button className="secondary" onClick={this.handleClose}>
                Close
              </button>
              <button className="primary" onClick={this.handleClose}>
                Save Changes
              </button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
  }
  export default App;
  