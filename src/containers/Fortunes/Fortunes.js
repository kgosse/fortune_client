import React, { Component } from 'react';
import {observer} from 'mobx-react';
import Fortune from '../../components/Fortune/Fortune';
import './Fortunes.css';
import {Pagination} from 'antd';

@observer
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

    console.log("Fortune", this.props.likes);

    const fortunes = this.props.fortunes.map((f, i) => {
      return <Fortune key={i} fortune={f} onLike={this.props.like}
                      onDislike={this.props.dislike}
                      liked={this.props.likes.has(f.id.toString())}
                      disliked={this.props.dislikes.has(f.id.toString())}
      />
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
