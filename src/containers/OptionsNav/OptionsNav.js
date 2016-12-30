import React, { Component } from 'react';
import { Radio, Button} from 'antd';
import './OptionsNav.css';

const RadioGroup = Radio.Group;


class OptionsNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div className="optionsnav">
        <RadioGroup onChange={this.onChange} value={this.state.value}>
          <Radio value={1}>All</Radio>
          <Radio value={2}>Top 30</Radio>
        </RadioGroup>
        <Button type="primary">Add Fortune</Button>
      </div>
    );
  }
}

export default OptionsNav;
