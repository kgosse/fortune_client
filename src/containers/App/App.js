import React, { Component } from 'react';
import NavBar from '../NavBar/NavBar';
import OptionsNav from '../OptionsNav/OptionsNav';
import Fortunes from '../Fortunes/Fortunes';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <NavBar />
        <div className="content">
          <OptionsNav />
          <Fortunes />
        </div>
      </div>
    );
  }
}

export default App;
