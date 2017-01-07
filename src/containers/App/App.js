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
      isRegistering: false,
      isAuthenticating: false
    };
  }

  handlePaginate = (page) => {
    this.props.AppState.getFortunes(page);
  };

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
    if (this.props.AppState.requests.isPostingFortune) {
      return;
    }
    this.props.AppState.postFortune({
      message: this.state.fortune
    });
    this.setState({fortune: ""});
  };

  connect = () => {
    if (this.props.AppState.requests.isAuthenticating) {
      return;
    }
    const username = this.coUsername.refs.input.value.trim();
    const password = this.coPassword.refs.input.value.trim();
    if (username === "" || password === "") {
      error("Tous les champs sont obligatoires");
      return;
    }
    this.setState({isAuthenticating: true});
    this.props.AppState.signIn({username, password});
  };

  subscription = () => {
    if (this.props.AppState.requests.isRegistering) {
      return;
    }
    const username = this.suUsername.refs.input.value.trim();
    const pass1 = this.suPass1.refs.input.value.trim();
    const pass2 = this.suPass2.refs.input.value.trim();
    if (username === "" || pass1 === "" || pass2 === "") {
      error("Tous les champs sont obligatoires");
      return;
    } else if (pass1 != pass2) {
      error("Les mots de passe ne correspondent pas");
      return;
    }
    this.setState({isRegistering: true});
    this.props.AppState.signUp({username, password: pass1});
  };

  debounceEventHandler = (...args) => {
    const debounced = debounce(...args);
    return function(e) {
      e.persist();
      return debounced(e);
    }
  };

  handleLogout = () => {

  };

  handleDelete = (id) => {

  };

  handleModify = (id) => {

  };

  componentWillReact() {

    if (this.state.isPostingFortune && !this.props.AppState.requests.isPostingFortune) {
      if (this.props.AppState.success.postFortune) {
        this.setState({visibleFortune: false});
        success("La fortune a été ajoutée avec succès.");
        this.props.AppState.setSuccess({postFortune: null});
        this.fortuneTextarea.refs.input.value = "";
      } else if (this.props.AppState.errors.postFortune) {
        error("Erreur lors de l'ajout de la fortune");
        this.props.AppState.setErrors({postFortune: null});
      }
    }

    if (this.state.isRegistering && !this.props.AppState.requests.isRegistering) {
      if (this.props.AppState.success.register) {
        this.setState({visibleSubscription: false});
        success("Nouvel utilisateur ajouté avec succès.");
        this.props.AppState.setSuccess({register: null});
        this.suUsername.refs.input.value = "";
        this.suPass1.refs.input.value = "";
        this.suPass2.refs.input.value = "";
      } else if (this.props.AppState.errors.register) {
        error("Erreur lors de la création de l'utilisateur");
        this.props.AppState.setErrors({register: null});
      }
    }

    if (this.state.isAuthenticating && !this.props.AppState.requests.isAuthenticating) {
      if (this.props.AppState.success.authentication) {
        this.setState({visibleConnection: false});
        success(`Bienvenue ${this.coUsername.refs.input.value} ;)`);
        this.props.AppState.setSuccess({authentication: null});
        this.coUsername.refs.input.value = "";
        this.coPassword.refs.input.value = "";
      } else if (this.props.AppState.errors.authentication) {
        error("Erreur lors de la connection");
        this.props.AppState.setErrors({authentication: null});
      }
    }




    this.setState({
      isPostingFortune: this.props.AppState.requests.isPostingFortune,
      isRegistering: this.props.AppState.requests.isRegistering
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
             width={400}
             footer={[
               <Button key="back" type="ghost" size="large" onClick={() => this.toggleConnection(false)}>Annuler</Button>,
               <Button key="submit" type="primary" size="large"
                       loading={this.props.AppState.requests.isAuthenticating}
                       onClick={this.connect}>
                 Se connecter
               </Button>,
             ]}
      >
        <Form>
          <FormItem>
            <Input addonBefore={<Icon type="user" />}
                   placeholder="Nom d'utilisateur"
                   ref={e => this.coUsername = e}
            />
          </FormItem>
          <FormItem>
            <Input addonBefore={<Icon type="lock" />} type="password"
                   placeholder="Mot de passe"
                   ref={e => this.coPassword = e}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  };

  signupModal = () => {
    return (
      <Modal title="S'incrire" visible={this.state.visibleSubscription}
             width={400}
             footer={[
               <Button key="back" type="ghost" size="large" onClick={() => this.toggleSubscription(false)}>Annuler</Button>,
               <Button key="submit" type="primary" size="large"
                       loading={this.props.AppState.requests.isRegistering}
                       onClick={this.subscription}>
                 Ajouter
               </Button>,
             ]}
      >
        <Form>
          <FormItem>
            <Input addonBefore={<Icon type="user" />}
                   placeholder="Nom d'utilisateur"
                   ref={e => this.suUsername = e}
            />
          </FormItem>
          <FormItem>
            <Input addonBefore={<Icon type="lock" />} type="password"
                   placeholder="Mot de passe"
                   ref={e => this.suPass1 = e}
            />
          </FormItem>
          <FormItem>
            <Input addonBefore={<Icon type="lock" />} type="password"
                   placeholder="confirmer le mot de passe"
                   ref={e => this.suPass2 = e}
            />
          </FormItem>
        </Form>
      </Modal>
    );
  };

  render() {

    console.log("App", this.props.AppState.likes);

    return (
      <div className="app">
        <NavBar showConnect={() => this.toggleConnection(true)}
                showSubscription={() => this.toggleSubscription(true)}
                logout={this.handleLogout}
                user={this.props.AppState.user}
        />

        <div className="content">
          <OptionsNav
            addFortune={() => this.toggleFortune(true)}
            pagination={this.props.AppState.pagination}
            radios={this.props.AppState.radios}
            user={this.props.AppState.user}
          />
          <Fortunes fortunes={this.props.AppState.fortunes}
                    likes={this.props.AppState.likes}
                    dislikes={this.props.AppState.dislikes}
                    like={this.handleLike}
                    dislike={this.handleDislike}
                    pagination={this.props.AppState.pagination}
                    onPaginate={this.handlePaginate}
                    user={this.props.AppState.user}
                    delete={this.handleDelete}
                    modify={this.handleModify}
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
