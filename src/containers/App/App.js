import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import NavBar from '../NavBar/NavBar';
import OptionsNav from '../OptionsNav/OptionsNav';
import Fortunes from '../Fortunes/Fortunes';
import { message, Modal, Input, Form, Icon, Button} from 'antd';
import DevTools from 'mobx-react-devtools';
import debounce from 'lodash/debounce';
import './App.css';

const InputGroup = Input.Group;
const FormItem = Form.Item;

const DURATION = 7;

const success = function (m) {
  message.success(m, DURATION);
};

const error = function (m) {
  message.error(m, DURATION);
};

const warning = function (m) {
  message.warning(m, DURATION);
};

@inject('AppState')
@observer
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleFortune : false,
      visibleConnection : false,
      visibleSubscription : false,
      fortune: "",
      isPostingFortune: false,
      likes: null,
      dislikes: null
    };
  }

  handleLike = (id) => {
    if (this.props.AppState.likes.has(id.toString())) {
      this.props.AppState.unlike(id);
    } else {
      this.props.AppState.like(id);
    }
  };

  handleDislike = (id) => {
    if (this.props.AppState.dislikes.has(id.toString())) {
      this.props.AppState.undislike(id);
    } else {
      this.props.AppState.dislike(id);
    }
  };

  toggleFortune = (val) => {
    this.setState({
      visibleFortune: val
    });
  };

  handleForturneChange = (event) => {
    this.setState({fortune: event.target.value});
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
    this.props.AppState.postFortune({
      message: this.state.fortune
    });
    this.setState({fortune: ""});
    // this.toggleFortune(false);
  };

  connect = () => {
    this.toggleConnection(false);
  };

  subscription = () => {
    this.toggleSubscription(false);
  };

  debounceEventHandler = (...args) => {
    const debounced = debounce(...args);
    return function(e) {
      e.persist();
      return debounced(e);
    }
  };

  componentWillReact() {
    if (this.state.isPostingFortune && !this.props.AppState.requests.isPostingFortune) {
      this.setState({visibleFortune: false});

      if (this.props.AppState.success.postFortune) {
        success("La fortune a été ajoutée avec succès.");
        this.props.AppState.setSuccess({postFortune: null});
        this.fortuneTextarea.refs.input.value = "";
      } else if (this.props.AppState.errors.postFortune) {
        error("Erreur lors de l'ajout de la fortune");
        this.props.AppState.setErrors({postFortune: null});
      }
    }

    this.setState({
      isPostingFortune: this.props.AppState.requests.isPostingFortune,
      likes: this.props.AppState.likes,
      dislikes: this.props.AppState.dislikes
    });

  }

  fortuneModal = () => {
    return (
      <Modal title="Ajouter Fortune" visible={this.state.visibleFortune}
             onOk={this.addFortune} onCancel={this.toggleFortune.bind(this,false)}
             okText="Ajouter" cancelText="Annuler"
             footer={[
               <Button key="back" type="ghost" size="large" onClick={this.toggleFortune.bind(this, false)}>Annuler</Button>,
               <Button key="submit" type="primary" size="large"
                       loading={this.props.AppState.requests.isPostingFortune}
                       onClick={this.addFortune}>
                 Ajouter
               </Button>,
             ]}
      >
        <Input type="textarea" rows={4}
               onChange={this.debounceEventHandler(this.handleForturneChange, 1000)} ref={e => this.fortuneTextarea = e} />
      </Modal>
    );
  };

  signinModal = () => {
    return (
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
    );
  };

  signupModal = () => {
    return (
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
    );
  };

  render() {

    console.log("App", this.props.AppState.likes);

    return (
      <div className="app">
        <NavBar showConnect={this.toggleConnection.bind(this,true)}
                showSubscription={this.toggleSubscription.bind(this,true)}/>

        <div className="content">
          <OptionsNav addFortune={this.toggleFortune.bind(this,true)} />
          <Fortunes fortunes={this.props.AppState.fortunes}
                    likes={this.props.AppState.likes}
                    dislikes={this.props.AppState.dislikes}
                    like={this.handleLike}
                    dislike={this.handleDislike}
          />
        </div>

        {this.signinModal()}
        {this.signupModal()}
        {this.fortuneModal()}

        <DevTools />
      </div>
    );
  }
}


export default App;
