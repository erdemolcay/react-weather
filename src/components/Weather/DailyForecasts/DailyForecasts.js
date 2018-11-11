import React from 'react';
import DailyForecast from './DailyForecast/DailyForecast';

export default props => (
  <div className="DailyForecasts">
    {props.daily.map((data, key) => (
      <DailyForecast {...data} key={key}/>
    ))}
  </div>
);