import React, { Component } from 'react';
import NavBar from '../NavBar/NavBar';
import OptionsNav from '../OptionsNav/OptionsNav';
import Fortunes from '../Fortunes/Fortunes';
import {Modal, Input} from 'antd';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleFortune : false,
      visibleConnection : false
    };
    this.toggleFortune = this.toggleFortune.bind(this);
    this.addFortune = this.addFortune.bind(this);
  }

  toggleFortune(val){
    this.setState({
      visibleFortune: val,
    });
  }

  addFortune(){
    this.toggleFortune(false);
  }

  render() {
    return (
      <div className="app">
        <NavBar />
        <div className="content">
          <OptionsNav addFortune={this.toggleFortune.bind(this,true)} />
          <Fortunes />
        </div>
        <Modal title="New Fortune" visible={this.state.visibleFortune}
          onOk={this.addFortune} onCancel={this.toggleFortune.bind(this,false)}
          okText="Add" cancelText="Cancel"
        >
          <Input type="textarea" rows={4} />
        </Modal>
      </div>
    );
  }
}

export default App;
