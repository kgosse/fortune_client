import React, { Component } from 'react';
import { Card, Button, Badge, Icon} from 'antd';
import './Fortune.css';

class Fortune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({hover: true});
  }

  onMouseLeave() {
    this.setState({hover: false});
  }

  render() {
    const size = 'default';

    const extra = (
      <div>
        <Button type="ghost" shape="circle" icon="delete" />
        <Button type="ghost" shape="circle" icon="edit" />
      </div>
    );
    return (
      <div className="card">
        <Card extra={this.state.hover ? extra : null} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab aliquid cum delectus doloribus, eos iste nesciunt nisi numquam optio pariatur placeat praesentium, quaerat quas quo reiciendis repellat sapiente sint.
          </div>
          <div>
            <Button type="primary"  icon="dislike" size={size}><Badge count={25} /></Button>
            <Button type="primary" icon="like" size={size}><Badge count={25} /></Button>
          </div>
        </Card>
      </div>
    )
  }
}

export default Fortune;


