import React from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import useVisualMode from "../../hooks/useVisualMode";
import Confirm from "./Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // Function to handle the saving of an appointment
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING); // Transition to SAVING mode

    // Call the bookInterview function to make a PUT request and save the appointment with the interview data
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW); // Transition to SHOW mode when the PUT request is complete
      })
      .catch((error) => {
        console.error(error); // Handle any errors that occur during the save operation
      });
  }

function confirmDeletion(){
  transition(CONFIRMING);
}

  // Function to handle the deletion of an appointment
  function deleting() {
    transition(DELETING); // Transition to deleting mode
    
    // Call the cancelInterview function to make a DELETE request and remove the interview data
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY); // Transition back to EMPTY mode when the DELETE request is complete
      })
      .catch((error) => {
        console.log(error); // Handle any error that occurs during the delete operation
      });
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDeletion}
        />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back(EMPTY)}
        />
      )}

      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRMING && <Confirm 
      message="Are you sure you would like to delete?"
      onConfirm={deleting}
      onCancel={() => back(SHOW)}
      />}
    </article>
  );
}
