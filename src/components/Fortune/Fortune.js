import React, { Component } from 'react';
import { Card, Button, Badge} from 'antd';
import './Fortune.css';

const Fortune = (props) => {
  const size = 'default';
  return (
    <div className="card">
      <Card extra={<a href="#">More</a>}>
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
};

export default Fortune;


