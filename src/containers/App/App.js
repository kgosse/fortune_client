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
      visibleConnection : false,
      visibleSubscription : false
    };
    this.toggleFortune = this.toggleFortune.bind(this);
    this.addFortune = this.addFortune.bind(this);
    this.toggleConnection = this.toggleConnection.bind(this);
    this.connect = this.connect.bind(this);
    this.toggleSubscription = this.toggleSubscription.bind(this);
    this.subscription = this.subscription.bind(this);
  }

  toggleFortune(val){
    this.setState({
      visibleFortune: val,
    });
  }
  
  toggleConnection(val){
    this.setState({
      visibleConnection: val,
    });
  }
  
  toggleSubscription(val){
    this.setState({
      visibleSubscription: val,
    });
  }
  
  addFortune(){
    this.toggleFortune(false);
  }
  
  connect(){
    this.toggleConnection(false);
  }
  
  subscription(){
    this.toggleSubscription(false);
  }

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
          <Input type="textarea" rows={4} />
        </Modal>
        <Modal title="Connexion" visible={this.state.visibleConnection}
          onOk={this.connect} onCancel={this.toggleConnection.bind(this,false)}
          okText="Ok" cancelText="Annuler"
        >
          <Input placeholder="nom d'utilisateur"/>
          <Input type="password" placeholder="mot de passe"/>
        </Modal>
        <Modal title="S'incrire" visible={this.state.visibleSubscription}
          onOk={this.subscription} onCancel={this.toggleSubscription.bind(this,false)}
          okText="Ok" cancelText="Annuler"
        >
          <Input placeholder="nom d'utilisateur"/>
          <Input type="password" placeholder="mot de passe"/>
          <Input type="password" placeholder="confirmer le mot de passe"/>
        </Modal>  
        
      </div>
    );
  }
}

export default App;
