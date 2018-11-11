import React from 'react';
import Place from './Place/Place';
import Details from './Details/Details';
import DailyForecasts from './DailyForecasts/DailyForecasts';

export default (props) => {
  let details;

  if (props.typeOfDetails === "currently" && props.selectedHour === null) {
    details = {...props.data.currently.details}
  } else if (props.typeOfDetails === "currently" && props.selectedHour !== null) {
    details = {...props.data.currently.hourly[props.selectedHour].details};
  } else if (props.typeOfDetails === "daily" && props.selectedHour === null) {
    details = {...props.data.daily[props.selectedDay].details}
  } else if (props.typeOfDetails === "daily" && props.selectedHour !== null) {
    details = {...props.data.daily[props.selectedDay].hourly[props.selectedHour].details}
  }

  return (
    <div className="Weather">
      <Place place={props.place}/>
      <Details {...details}/>
      <DailyForecasts daily={props.data.daily}/>
    </div>
  );
};