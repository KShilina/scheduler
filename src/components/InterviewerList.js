import React from "react";
import PropTypes from 'prop-types';
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {
  const { interviewers, value, onChange } = props;

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
      {interviewers.map(interviwerPointer => 
        <InterviewerListItem
          key={interviwerPointer.id}
          name={interviwerPointer.name}
          avatar={interviwerPointer.avatar}
          selected={interviwerPointer.id === value}
          setInterviewer={()=> onChange(interviwerPointer.id)}
        />
      )}
      </ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

