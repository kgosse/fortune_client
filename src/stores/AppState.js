import { observable, action } from 'mobx';
import axios from 'axios';

class AppState {
  @observable authenticated;

  @observable requests;
  @observable errors;
  @observable success;

  @observable fortunes;

  static API = 'http://localhost:3001';

  constructor() {
    this.authenticated = false;

    this.fortunes = [];

    this.requests = {
      isPostingFortune: false,
      isGettingFortunes: false,
      isAuthenticating: false
    };

    this.errors = {
      postFortune: null,
      getFortunes: null
    };

    this.success = {
      postFortune: null
    };

    this.getFortunes();
  }

  async fetchData(pathname, id) {
    let {data} = await axios.get(`https://jsonplaceholder.typicode.com${pathname}`);
    console.log(data);
    data.length > 0 ? this.setData(data) : this.setSingle(data);
  }

  @action postFortune(data) {
    this.requests.isPostingFortune = true;
    this.errors.postFortune = null;

    fetch(`${AppState.API}/api/Fortunes`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("postFortune-success", () => {
        this.requests.isPostingFortune = false;
        this.setSuccess({postFortune: true});
        this.getFortunes();
      }))
      .catch (action("postFortune-error", (e) => {
        this.requests.isPostingFortune = false;
        this.errors.postFortune = e;
      }));
  }

  @action getFortunes() {
    this.requests.isGettingFortunes = true;
    this.errors.getFortunes = false;

    fetch(`${AppState.API}/api/Fortunes`, {
      method: 'GET'
    })
      .then(e => e.json())
      .then((response) => {
        this.requests.isGettingFortunes = false;
        this.fortunes = response;
      })
      .catch ((e) => {
        this.requests.isGettingFortunes = false;
        this.errors.postFortune = e;
      });
  }

  @action setSuccess(val) {
    this.success = {
      ...this.success,
      ...val
    };
  }

  @action setErrors(val) {
    this.errors = {
      ...this.errors,
      ...val
    };
  }


  @action setData(data) {
    this.items = data;
  }

  @action test() {
    console.log('Hello world mobx !!!');
  }

  @action setSingle(data) {
    this.item = data;
  }

  @action clearItems() {
    this.items = [];
    this.item = {};
  }

  @action authenticate() {
    return new Promise((resolve,reject) => {
      this.authenticating = true;
      setTimeout(() => {
        this.authenticated = !this.authenticated;
        this.authenticating = false;
        resolve(this.authenticated);
      }, 0)
    })
  }

}

export default AppState;
