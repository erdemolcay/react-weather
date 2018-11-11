import React from 'react';

export default (props) => (
  <div className="Details">
    <div>{props.time}</div>
    <div>{props.summary}</div>
    <div>
      <div>
        <div>{props.icon}</div>
        <div>{props.temperature}</div>
      </div>
      <div>
        <div>{props.precipitation}</div>
        <div>{props.humidity}</div>
        <div>{props.windSpeed}</div>
      </div>
    </div>
  </div>
);