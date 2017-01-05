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

    const fortunes = this.props.fortunes.map((f, i) => {
      return <Fortune key={f.id} fortune={f} onLike={this.props.like}
                      onDislike={this.props.dislike}
                      liked={this.props.likes.has(f.id.toString())}
                      disliked={this.props.dislikes.has(f.id.toString())}
                      user={this.props.user}
      />
    });

    const pagination = this.props.pagination.count <= this.props.pagination.pageSize ?
      null :
      (<Pagination
        current={this.props.pagination.current}
        onChange={this.props.onPaginate}
        total={this.props.pagination.count}
        pageSize={this.props.pagination.pageSize}
      />);

    return (
      <div className="fortunes">
        {fortunes}
        <div>
          {pagination}
        </div>
      </div>
    );
  }
}

export default Fortunes;
