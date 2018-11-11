import React from 'react';

export default props => (
  <div className="DailyForecast" style={{display: "inline-block", margin: "5px", padding: "5px", border: "1px solid #eee"}}>
    <div>{props.short.time}</div>
    <div>{props.short.icon}</div>
    <div>{props.short.temperature}</div>
  </div>
);