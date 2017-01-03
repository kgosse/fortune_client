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
      <div className="extra">
        <Button type="ghost" shape="circle" icon="delete" />
        <Button type="ghost" shape="circle" icon="edit" />
      </div>
    );

    const {message, time, user} = this.props.fortune;
    return (
      <div className="card">
        <Card extra={this.state.hover ? extra : null} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <div className="message">
            {message}
          </div>
          <div className="buttons">
            <Button type="ghost"  icon="dislike" size={size}><Badge count={25} style={{backgroundColor: 'red'}} /></Button>
            <Button type="ghost" icon="like" size={size}><Badge count={25} style={{backgroundColor: 'green'}}/></Button>
            <Badge count={109} overflowCount={109} style={{ backgroundColor: '#40A5ED' }} />
          </div>
          <div className="author">
            <span>Kévin Gossé 30/12/16 - 23:05</span>
          </div>
        </Card>
      </div>
    )
  }
}

export default Fortune;


