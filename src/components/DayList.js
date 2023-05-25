import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  //day=value setDay=onChange
  const { days, day, setDay } = props;

  return (
    <ul>
      {days.map(dayItem => 
        <DayListItem
          key={dayItem.id}
          name={dayItem.name}
          spots={dayItem.spots}
          selected={dayItem.name === day}
          setDay={setDay}
        />
      )}
    </ul>
  );
}
