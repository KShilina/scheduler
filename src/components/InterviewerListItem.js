import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
  const { id, name, avatar, selected, setInterviewer } = props;

  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": selected,
  });

  const handleClick = () => {
    setInterviewer(id);
  };

  return ( 
    <li className={interviewerClass} onClick={handleClick}>
      {selected ? (
        <>
          <img className="interviewers__item-image" src={avatar} alt={name} />
          {name}
        </>
      ) : (
        <img className="interviewers__item-image" src={avatar} alt={name} />
      )}
    </li>
  );
}
