import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  //day=value setDay=onChange
  const { days, value, onChange } = props;

  return (
    <ul>
      {days.map(dayItem => 
        <DayListItem
          key={dayItem.id}
          name={dayItem.name}
          spots={dayItem.spots}
          selected={dayItem.name === value}
          setDay={onChange}
        />
      )}
    </ul>
  );
}
