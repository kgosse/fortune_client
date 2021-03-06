import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import NavBar from '../NavBar/NavBar';
import OptionsNav from '../OptionsNav/OptionsNav';
import Fortunes from '../Fortunes/Fortunes';
import { message, Modal, Input, Form, Icon, Button} from 'antd';
import DevTools from 'mobx-react-devtools';
import debounce from 'lodash/debounce';
import Log from '../../components/Log/Log';
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
      isAuthenticating: false,
      fortuneId: null
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
    let data = {
      message: this.state.fortune
    };
    if (this.props.AppState.user.authenticated) {
      data.ownerId = this.props.AppState.user.data.id
    }
    this.props.AppState.postFortune(data);
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
    this.props.AppState.signOut();
  };

  handleRadio = (r) => {
    this.props.AppState.changeRadio(r);
  };

  handleDelete = (id) => {
    this.props.AppState.deleteFortune(id);
  };

  handleModify = (f) => {
    this.setState({fortuneId: f.id, visibleFortune: true});
    this.fortuneTextarea.refs.input.value = f.message;
  };

  onModify = () => {
    if (this.props.AppState.requests.isModifyingFortune) return;

    this.props.AppState.modifyFortune({
      id: this.state.fortuneId,
      message: this.fortuneTextarea.refs.input.value.trim()
    });
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

    if (this.props.AppState.success.signOut) {
      success("Déconnexion réussie.");
      this.props.AppState.setSuccess({signOut: null});
    } else if (this.props.AppState.errors.signOut) {
      error("Erreur déconnexion.");
      this.props.AppState.setErrors({signOut: null});
    }

    if (this.props.AppState.success.deleteFortune) {
      success("Fortune supprimée avec succès.");
      this.props.AppState.setSuccess({deleteFortune: null});
    } else if (this.props.AppState.errors.deleteFortune) {
      error("Erreur suppression fortune.");
      this.props.AppState.setErrors({deleteFortune: null});
    }

    if (this.props.AppState.success.modifyFortune) {
      this.setState({visibleFortune: false, fortuneId: null});
      success("La fortune a été modifiée avec succès.");
      this.props.AppState.setSuccess({modifyFortune: null});
      this.fortuneTextarea.refs.input.value = "";
    } else if (this.props.AppState.errors.modifyFortune) {
      error("Erreur lors de la modification de la fortune");
      this.props.AppState.setErrors({modifyFortune: null});
    }

    this.setState({
      isPostingFortune: this.props.AppState.requests.isPostingFortune,
      isRegistering: this.props.AppState.requests.isRegistering,
      isAuthenticating: this.props.AppState.requests.isAuthenticating
    });

  }

  fortuneModal = () => {
    const button = this.state.fortuneId != null ?
      (
        <Button key="submit" type="primary" size="large"
                loading={this.props.AppState.requests.isModifyingFortune}
                onClick={this.onModify}>
          Modifier
        </Button>
      ) :
      (
        <Button key="submit" type="primary" size="large"
                loading={this.props.AppState.requests.isPostingFortune}
                onClick={this.addFortune}>
          Ajouter
        </Button>
      );

    return (
      <Modal title="Ajouter Fortune" visible={this.state.visibleFortune}
             footer={[
               <Button key="back" type="ghost" size="large"
                       onClick={() => this.toggleFortune(false)}>Annuler</Button>,
               button
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
            changeRadio={this.handleRadio}
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

        <Log {...this.props.AppState.errors}
             {...this.props.AppState.success} />

        <DevTools />
      </div>
    );
  }
}


export default App;
