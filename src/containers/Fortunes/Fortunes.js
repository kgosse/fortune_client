import React, { Component } from 'react';
import Fortune from '../../components/Fortune/Fortune';
import './Fortunes.css';

class Fortunes extends Component {
  render() {
    return (
      <div className="fortunes">
        <Fortune />
        <Fortune />
      </div>
    );
  }
}

export default Fortunes;
