import React, { Component } from 'react';
import { Radio, Button} from 'antd';
import { observer } from 'mobx-react';
import {RADIOS} from '../../resources/const';
import './OptionsNav.css';

const RadioGroup = Radio.Group;

@observer
class OptionsNav extends Component {

  onChange = (e) => {
    this.props.changeRadio(e.target.value);
  };

  render() {
    const {user} = this.props;
    let options = null;

    const total = this.props.radios.current != RADIOS.one ?
      null : `(${this.props.pagination.count})`;

    if (user.authenticated) {
      options = (
        <RadioGroup onChange={this.onChange} value={this.props.radios.current}>
          <Radio value={RADIOS.one}>Toutes {total}</Radio>
          <Radio value={RADIOS.two}>Top 30</Radio>
          <Radio value={RADIOS.three}>Mes fortunes</Radio>
          <Radio value={RADIOS.four}>Mon top 30</Radio>
        </RadioGroup>
      );
    } else {
      options = (
        <RadioGroup onChange={this.onChange} value={this.props.radios.current}>
          <Radio value={RADIOS.one}>Toutes {total}</Radio>
          <Radio value={RADIOS.two}>Top 30</Radio>
        </RadioGroup>
      );
    }

    return (
      <div className="optionsnav">
        {options}
        <Button type="primary" onClick={this.props.addFortune}>Ajouter Fortune</Button>
      </div>
    );
  }
}

export default OptionsNav;
