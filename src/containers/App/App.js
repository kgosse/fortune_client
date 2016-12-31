import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import NavBar from '../NavBar/NavBar';
import OptionsNav from '../OptionsNav/OptionsNav';
import Fortunes from '../Fortunes/Fortunes';
import {Modal, Input, Col, Form, Icon, Button} from 'antd';
import './App.css';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@inject('AppState')
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleFortune : false,
      visibleConnection : false,
      visibleSubscription : false,
      fortune: ""
    };
  }

  toggleFortune = (val) => {
    this.setState({
      visibleFortune: val,
    });
  };

  handleForturneChange = (event) => {
    this.setState({fortune: event.target.value});
  };

  addFortune = () => {
    this.props.AppState.test();
  };

  toggleConnection = (val) => {
    this.setState({
      visibleConnection: val,
    });
  };

  toggleSubscription = (val) => {
    this.setState({
      visibleSubscription: val,
    });
  };

  addFortune = () => {
    this.toggleFortune(false);
    console.log(this.state.fortune);
  };

  connect = () => {
    this.toggleConnection(false);
  };

  subscription = () => {
    this.toggleSubscription(false);
  };

  render() {

    return (
      <div className="app">
        <NavBar showConnect={this.toggleConnection.bind(this,true)}
                showSubscription={this.toggleSubscription.bind(this,true)}/>

        <div className="content">
          <OptionsNav addFortune={this.toggleFortune.bind(this,true)} />
          <Fortunes />
        </div>
        <Modal title="Ajouter Fortune" visible={this.state.visibleFortune}
          onOk={this.addFortune} onCancel={this.toggleFortune.bind(this,false)}
          okText="Ajouter" cancelText="Annuler"
        >
          <Input type="textarea" rows={4} onChange={this.handleForturneChange} />
        </Modal>
        <Modal title="Connexion" visible={this.state.visibleConnection}
          onOk={this.connect} onCancel={this.toggleConnection.bind(this,false)}
          okText="Log In" cancelText="Annuler" width={400}
        >
          <Form>
            <FormItem>
                <Input addonBefore={<Icon type="user" />} placeholder="Nom d'utilisateur" />
            </FormItem>
            <FormItem>
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Mot de passe" />
            </FormItem>
          </Form>
        </Modal>
        <Modal title="S'incrire" visible={this.state.visibleSubscription}
          onOk={this.subscription} onCancel={this.toggleSubscription.bind(this,false)}
          okText="Ok" cancelText="Annuler" width={400}
        >
          <Form>
            <FormItem>
                <Input addonBefore={<Icon type="user" />} placeholder="Nom d'utilisateur" />
            </FormItem>
            <FormItem>
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Mot de passe" />
            </FormItem>
            <FormItem>
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="confirmer le mot de passe" />
            </FormItem>
          </Form>
        </Modal>

      </div>
    );
  }
}

export default App;
