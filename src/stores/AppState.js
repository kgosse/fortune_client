import { observable, action, map} from 'mobx';
import {RADIOS} from '../resources/const';
import axios from 'axios';

const defaultPagination = {
  count: 0,
  pageSize: 5,
  current: 1
};

class AppState {
  @observable requests;
  @observable errors;
  @observable success;

  @observable radios;

  @observable likes;
  @observable dislikes;

  @observable fortunes;

  @observable pagination;

  @observable user;

  static API = 'http://localhost:3001';

  constructor() {

    this.fortunes = [];
    this.likes = map();
    this.dislikes = map();

    this.radios = {
      current: RADIOS.one
    };

    this.user = {
      authenticated: false
    };

    this.pagination = {
      count: 0,
      pageSize: 5,
      current: 1
    };

    this.requests = {
      isPostingFortune: false,
      isGettingFortunes: false,
      isAuthenticating: false,
      isRegistering: false,
      isDeletingFortune: false
    };

    this.errors = {
      postFortune: null,
      getFortunes: null,
      like: null,
      dislike: null,
      register: null,
      authentication: null,
      signOut: null,
      deleteFortune: null,
      modifyFortune: null
    };

    this.success = {
      postFortune: null,
      register: null,
      authentication: null,
      signOut: null,
      deleteFortune: null,
      modifyFortune: null
    };

    this.fortunesCount();
    this.getFortunes();
  }

  injectToken(url) {
    return this.user.authenticated ?
      url + `?access_token=${this.user.data.token.id}` :
      url
  }

  @action changeRadio(v = RADIOS.one) {
    this.radios.current = v;
    switch (v) {
      case RADIOS.one:
        this.pagination = defaultPagination;
        this.fortunesCount();
        this.getFortunes();
        break;
      case RADIOS.two:
        this.pagination = {
          count: 30,
          pageSize: 30,
          current: 1
        };
        this.getThirty();
        break;
      case RADIOS.three:
        this.getUserFortunes();
        break;
      case RADIOS.four:
        this.pagination = {
          count: 30,
          pageSize: 30,
          current: 1
        };
        this.getUserTopThirty();
        break;
    }
  }

  @action signIn(data) {
    this.requests.isAuthenticating = true;
    this.errors.authentication = null;

    fetch(`${AppState.API}/api/Owners/login`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("signIn-json", r => {
        if (!r.ok) {
          throw Error(r.statusText);
        }
        return r.json();
      }))
      .then(action("signIn-success", (v) => {
        this.requests.isAuthenticating = false;
        const {userId, ...token} = v;
        this.user = {
          authenticated: true,
          data: {
            id: userId,
            username: data.username,
            token
          },
        };
        this.setSuccess({authentication: true});
      }))
      .catch (action("signIn-error", (e) => {
        this.requests.isAuthenticating = false;
        this.errors.authentication = e;
      }));
  }

  @action signOut() {
    fetch(this.injectToken(`${AppState.API}/api/Owners/logout`), {
      method: 'POST'
    })
      .then(action("signOut-json", r => {
        if (!r.ok) {
          throw Error(r.statusText);
        }
      }))
      .then(action("signOut-success", () => {
        this.user = {
          authenticated: null
        };
        // handle fortune current page
        this.success.signOut = true;
        if (this.radios.current > RADIOS.two) {
          this.radios.current = RADIOS.one;
          this.pagination = defaultPagination;
          this.fortunesCount();
          this.getFortunes();
        }
      }))
      .catch (action("signOut-error", (e) => {
        this.errors.signOut = true;
        console.log(e);
      }));
  };

  @action signUp(data) {
    this.requests.isRegistering = true;
    this.errors.register = null;

    fetch(`${AppState.API}/api/Owners`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("signUp-json", r => {
        if (!r.ok) {
          throw Error(r.statusText);
        }
        return r.json();
      }))
      .then(action("signUp-success", (v) => {
        this.requests.isRegistering = false;
        this.setSuccess({register: true});
      }))
      .catch (action("signUp-error", (e) => {
        this.requests.isRegistering = false;
        this.errors.register = e;
      }));
  }

  @action deleteFortune(id) {
    this.requests.isDeletingFortune = true;

    fetch(this.injectToken(`${AppState.API}/api/Fortunes/${id}`), {
      method: 'DELETE',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action("deleteFortune-success", (v) => {
        this.requests.isDeletingFortune = false;
        this.success.deleteFortune = true;
        this.refreshFortunes();
      }))
      .catch (action("deleteFortune-error", (e) => {
        this.requests.isDeletingFortune = false;
        this.errors.deleteFortune = e;
        console.log(e);
      }));
  }

  @action fortunesCount() {
    fetch(`${AppState.API}/api/Fortunes/count`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(action("fortunesCount-json", e => e.json()))
      .then(action("fortunesCount-success", (v) => {
        this.pagination.count = v.count;
      }))
      .catch (action("fortunesCount-error", (e) => {
        console.log(e);
      }));
  };

  @action like(id) {
    fetch(`${AppState.API}/api/Fortunes/like?id=${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("like-json", e => e.json()))
      .then(action("like-success", (v) => {
        this.likes.set(id.toString(), v.like);
        this.fortunes.find(e => e.id === id).like = v.like;
      }))
      .catch (action("like-error", (e) => {
        console.log(e);
      }));
  }

  @action unlike(id) {
    fetch(`${AppState.API}/api/Fortunes/unlike?id=${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("unlike-json", e => e.json()))
      .then(action("unlike-success", (v) => {
        this.likes.delete(id.toString());
        this.fortunes.find(e => e.id === id).like -= 1;
      }))
      .catch (action("unlike-error", (e) => {
        console.log(e);
      }));
  }

  @action dislike(id) {
    fetch(`${AppState.API}/api/Fortunes/dislike?id=${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action("dislike-success", (v) => {
        this.dislikes.set(id.toString(), v.dislike);
        this.fortunes.find(e => e.id === id).dislike = v.dislike;
      }))
      .catch (action("dislike-error", (e) => {
        console.log(e);
      }));
  }

  @action undislike(id) {
    fetch(`${AppState.API}/api/Fortunes/undislike?id=${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action("dislike-success", (v) => {
        this.dislikes.delete(id.toString());
        this.fortunes.find(e => e.id === id).dislike = v.dislike;
      }))
      .catch (action("dislike-error", (e) => {
        console.log(e);
      }));
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
        this.refreshFortunes();
      }))
      .catch (action("postFortune-error", (e) => {
        this.requests.isPostingFortune = false;
        this.errors.postFortune = e;
      }));
  }

  @action modifyFortune(data) {
    this.requests.isModifyingFortune = true;
    this.errors.postFortune = null;

    fetch(this.injectToken(`${AppState.API}/api/Fortunes/${data.id}`), {
      method: 'PATCH',
      body: JSON.stringify({message: data.message}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(action("modifyFortune-success", () => {
        this.requests.isModifyingFortune = false;
        this.setSuccess({modifyFortune: true});
        this.refreshFortunes();
      }))
      .catch (action("modifyFortune-error", (e) => {
        this.requests.isModifyingFortune = false;
        this.errors.modifyFortune = e;
      }));
  }

  @action getThirty() {
    this.requests.isGettingFortunes = true;
    this.errors.getFortunes = false;

    fetch(`${AppState.API}/api/Fortunes/getthirty`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action('getThirty-success', (response) => {
        this.requests.isGettingFortunes = false;
        this.fortunes = response.fortunes;
        this.pagination.current = 1;
      }))
      .catch (action('getThirty-error', (e) => {
        this.requests.isGettingFortunes = false;
        this.errors.getFortunes = e;
      }));
  }


  @action getFortunes(page = 1, order) {
    this.requests.isGettingFortunes = true;
    this.errors.getFortunes = false;

    const filter = {
      limit: this.pagination.pageSize,
      offset: (page - 1) * this.pagination.pageSize,
      order: order || 'time DESC',
      include: "owner"
    };

    fetch(`${AppState.API}/api/Fortunes?filter=${encodeURIComponent(JSON.stringify(filter))}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action('getFortunes-success', (response) => {
        this.requests.isGettingFortunes = false;
        this.fortunes = response;
        this.pagination.current = page;
      }))
      .catch (action('getFortunes-error', (e) => {
        this.requests.isGettingFortunes = false;
        this.errors.getFortunes = e;
      }));
  }

  @action getUserFortunes(page = 1, id) {
    if (!this.user.authenticated) return;

    this.requests.isGettingFortunes = true;
    this.errors.getFortunes = false;

    const filter = {
      limit: this.pagination.pageSize,
      offset: (page - 1) * this.pagination.pageSize,
      include: "owner",
      order: "time DESC"
    };

    fetch(this.injectToken(`${AppState.API}/api/Owners/${this.user.data.id}/Fortunes`)
      + `&filter=${encodeURIComponent(JSON.stringify(filter))}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action('getUserFortunes-success', (response) => {
        this.requests.isGettingFortunes = false;
        this.fortunes = response;
        this.pagination = {
          ...this.pagination,
          count: response.length,
          pageSize: 5,
          current: 1
        };
      }))
      .catch (action('getUserFortunes-error', (e) => {
        this.requests.isGettingFortunes = false;
        this.errors.getFortunes = e;
      }));
  }

  @action getUserTopThirty() {
    this.requests.isGettingFortunes = true;
    this.errors.getFortunes = false;

    fetch(this.injectToken(`${AppState.API}/api/Owners/getthirty`)
      + `&id=${this.user.data.id}`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
      .then(e => e.json())
      .then(action('getUserTopThirty-success', (response) => {
        this.requests.isGettingFortunes = false;
        this.fortunes = response.fortunes;
        this.pagination.current = 1;
      }))
      .catch (action('getUserTopThirty-error', (e) => {
        this.requests.isGettingFortunes = false;
        this.errors.getFortunes = e;
      }));
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

  @action refreshFortunes() {
    switch (this.radios.current) {
      case RADIOS.one:
        this.fortunesCount();
        this.getFortunes();
        break;
      case RADIOS.two:
        this.getThirty();
        break;
      case RADIOS.three:
        this.getUserFortunes();
        break;
      case RADIOS.four:
        this.getUserTopThirty();
        break;
    }
  }
}

function encodeQueryData(data) {
  let ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

export default AppState;
