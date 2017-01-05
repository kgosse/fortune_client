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
      isRegistering: false
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
    this.toggleConnection(false);
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

    if (this.state.isRegistering && !this.props.AppState.requests.isRegistering) {
      this.setState({visibleSubscription: false});

      if (this.props.AppState.success.register) {
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
             okText="Ok" cancelText="Annuler" width={400}
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
                showSubscription={() => this.toggleSubscription(true)}/>

        <div className="content">
          <OptionsNav
            addFortune={() => this.toggleFortune(true)}
            pagination={this.props.AppState.pagination}
          />
          <Fortunes fortunes={this.props.AppState.fortunes}
                    likes={this.props.AppState.likes}
                    dislikes={this.props.AppState.dislikes}
                    like={this.handleLike}
                    dislike={this.handleDislike}
                    pagination={this.props.AppState.pagination}
                    onPaginate={this.handlePaginate}
                    user={this.props.AppState.user}
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
