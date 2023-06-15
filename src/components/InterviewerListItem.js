import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
  const { name, avatar, selected, setInterviewer } = props;
  //classNames is a function,first argument "interviewers__item" is a base class that will always be applied to the element. The second argument is an object where the keys represent the CSS classes, and the values represent the conditions for applying those classes.
  // When selected is true: "interviewers__item interviewers__item--selected"
  // When selected is false: "interviewers__item"
  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": selected,
  });

  return (
    <li className={interviewerClass} onClick={setInterviewer}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
