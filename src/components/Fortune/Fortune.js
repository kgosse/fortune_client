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
    const unknownUser = {
      id: -1,
      username: 'Unknown'
    };

    let {id, message, time, owner = unknownUser, like = 0, dislike = 0} = this.props.fortune;
    const {user: AppUser} = this.props;
    const size = 'default';

    const extra = (
      <div className="extra">
        <Button type="ghost" shape="circle" icon="delete" onClick={() => this.props.delete(id)}/>
        <Button type="ghost" shape="circle" icon="edit" onClick={() => this.props.modify(id)}/>
      </div>
    );

    return (
      <div className="card">
        <Card extra={this.state.hover && AppUser.authenticated && owner.id === AppUser.data.id ? extra : null}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}>
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
            <span>{`${owner.username} ${getFormattedDate(time)}`}</span>
          </div>
        </Card>
      </div>
    )
  }
}

function getFormattedDate(time) {
  let date = new Date(time);

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  sec = (sec < 10 ? "0" : "") + sec;

  let str =  day + "/" + month + "/" + date.getFullYear() + " " +  hour + ":" + min + ":" + sec;

  return str;
}

export default Fortune;


