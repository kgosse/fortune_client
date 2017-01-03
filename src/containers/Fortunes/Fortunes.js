import React, { Component } from 'react';
import Fortune from '../../components/Fortune/Fortune';
import './Fortunes.css';
import {Pagination} from 'antd';

class Fortunes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 1
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(page) {
    this.setState({
      current: page,
    });
  }


  render() {
    const fortunes = this.props.fortunes.map((f, i) => {
      return <Fortune key={i} fortune={f}/>
    });
    return (
      <div className="fortunes">
        {fortunes}
        <div>
          <Pagination current={this.state.current} onChange={this.onChange} total={50} />
        </div>
      </div>
    );
  }
}

export default Fortunes;
