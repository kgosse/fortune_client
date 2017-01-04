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

    let {id, message, time, user, like = 0, dislike = 0} = this.props.fortune;

    return (
      <div className="card">
        <Card extra={this.state.hover ? extra : null} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <div className="message">
            {message}
          </div>
          <div className="buttons">
            <Button
              type={this.props.disliked ? 'primary' : 'ghost'}
              icon="dislike"
              size={size}
              onClick={() => this.props.onDislike(id)}
            >
              <Badge count={dislike} style={{backgroundColor: 'red'}} />
            </Button>
            <Button
              type={this.props.liked ? 'primary' : 'ghost'}
              icon="like"
              size={size}
              onClick={() => this.props.onLike(id)}
            >
              <Badge count={like} style={{backgroundColor: 'green'}}/>
            </Button>
            <Badge text={like - dislike}
                   status={ (like - dislike) > 0 ? 'success': ((like - dislike) == 0 ? 'default':'error')}
                   overflowCount={1000} style={{ backgroundColor: (like - dislike) >= 0 ? 'green': 'red' }} />
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


